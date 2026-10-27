// Answer checking for typed review. Lenient by design: it accepts the CED wording,
// common short names, small typos, and reordered words, but rejects wrong numbers/eras.
(function (root) {
  const STOP = new Set(("a an the of and with on in from at to for by its his her their or as " +
    "also known including is c ca circa de da di del della van von der le la les el du des " +
    "modern present near through").split(" "));
  const ARTIST_GENERIC = new Set(("artist artists architect architects attributed sculptor sculptors " +
    "unknown circle family workshop photo supervising master plan facade ceiling fresco school").split(" "));
  const CULTURE_STOP = new Set(["europe", "peoples", "people", "period"]);
  // words that appear in many culture labels and say little on their own
  const CULTURE_WEAK = new Set("kingdom dynasty dynasties greek roman european early late mid society islamic".split(" "));
  const ORD = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8,
    ninth: 9, tenth: 10, eleventh: 11, twelfth: 12, thirteenth: 13, fourteenth: 14, fifteenth: 15,
    sixteenth: 16, seventeenth: 17, eighteenth: 18, nineteenth: 19, twentieth: 20 };

  function fold(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[‘’ʼ'`]/g, "")
      .replace(/\bu\.\s?s\.?(?![a-z])/g, "us").replace(/\bd\.\s?c\.?(?![a-z])/g, "dc")
      .replace(/&/g, " and ").replace(/terracotta/g, "terra cotta");
  }

  function tokens(s, extraStop) {
    const out = [];
    for (let t of fold(s).split(/[^a-z0-9]+/)) {
      if (!t) continue;
      if (/^\d+(st|nd|rd|th)$/.test(t)) t = String(parseInt(t, 10));
      else if (ORD[t]) t = String(ORD[t]);
      if (t === "st") t = "saint";
      if (t === "mt") t = "mount";
      if (t.length === 1 && !/\d/.test(t)) continue;
      if (STOP.has(t) || (extraStop && extraStop.has(t))) continue;
      out.push(t);
    }
    return out;
  }

  function lev(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      [prev, cur] = [cur, prev];
    }
    return prev[n];
  }

  function similar(a, b) {
    const L = Math.max(a.length, b.length);
    return L ? 1 - lev(a, b) / L : 1;
  }

  function tokEq(a, b) {
    if (a === b) return true;
    if (/\d/.test(a) || /\d/.test(b)) return false; // numbers must match exactly
    const L = Math.min(a.length, b.length);
    if (L < 5) return false; // short words must be exact (Iraq vs. Iran)
    const d = lev(a, b);
    return d <= 1 || (L >= 9 && d <= 2); // Parthenon vs. Pantheon stays wrong
  }

  // cov: share of the key's distinct words the user wrote; prec: share of the user's words that are in the key
  function overlap(keyToks, userToks) {
    const K = [...new Set(keyToks)], U = [...new Set(userToks)];
    if (!K.length || !U.length) return { cov: 0, prec: 0, n: K.length };
    const joinedU = U.join("");
    let hit = 0;
    for (const k of K) if (U.some(u => tokEq(k, u)) || (k.length >= 5 && joinedU.includes(k))) hit++;
    let uhit = 0;
    for (const u of U) if (K.some(k => tokEq(k, u))) uhit++;
    else if (u.length >= 6 && K.join("").includes(u)) uhit++; // "hunefer" vs "hu nefer"
    return { cov: hit / K.length, prec: uhit / U.length, n: K.length };
  }

  function stripParens(s) { return s.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim(); }

  function variants(key, field) {
    const out = new Set([key.answer, ...(key.accept || [])]);
    for (const v of [...out]) {
      const np = stripParens(v); if (np) out.add(np);
      if (field === "title") {
        for (const sep of [", from ", ", including ", ": "]) {
          const i = v.indexOf(sep);
          if (i > 3) { out.add(v.slice(0, i)); out.add(stripParens(v.slice(0, i))); }
        }
      }
    }
    return [...out].filter(Boolean);
  }

  const COV_NEED = { title: [3, 0.6], material: [3, 0.6], culture: [2, 0.5], location: [2, 0.5], artist: [3, 0.6] };

  function textMatch(cand, user, field, strict) {
    const extra = field === "culture" ? CULTURE_STOP : null;
    const kt = tokens(cand, extra), ut = tokens(user, extra);
    if (!kt.length || !ut.length) return false;
    const nums = a => a.filter(x => /\d/.test(x)).sort().join(",");
    if (nums(kt) === nums(ut) && similar(kt.join(" "), ut.join(" ")) >= (strict ? 0.9 : 0.8)) return true;
    const { cov, prec, n } = overlap(kt, ut);
    if (strict) return cov >= 0.85 && prec >= 0.7;
    if (field === "culture") {
      const ki = kt.filter(x => !CULTURE_WEAK.has(x)), ui = ut.filter(x => !CULTURE_WEAK.has(x));
      if (ki.length) {
        if (!ui.length) return false;
        const o = overlap(ki, ui);
        return o.cov >= 0.5 && o.prec >= 0.6 && prec >= 0.5;
      }
    }
    const [smallN, need] = COV_NEED[field] || [3, 0.6];
    return prec >= (field === "title" ? 0.75 : 0.6) && (n <= smallN ? cov === 1 : cov >= need);
  }

  function locationComponents(s) {
    return s.split(/[,;()]|\bor\b/).map(x => x.trim()).filter(x => tokens(x).length);
  }

  function artistPeople(s) {
    return stripParens(s).split(/;|,|\band\b|\bwith\b|\bbased on\b/)
      .map(p => tokens(p, ARTIST_GENERIC)).filter(p => p.length);
  }

  function personMatch(P, U) {
    const { cov } = overlap(P, U);
    if (cov >= (P.length >= 3 ? 0.66 : 0.5)) return true;
    const last = P[P.length - 1];
    return last.length >= 4 && U.some(u => tokEq(u, last));
  }

  function gradeText(field, key, user, strict) {
    if (!tokens(user).length) return { correct: false };
    for (const v of variants(key, field)) if (textMatch(v, user, field, strict)) return { correct: true };
    if (field === "location" && !strict) {
      const ut = tokens(user);
      for (const c of locationComponents(key.answer)) {
        const ct = tokens(c);
        const { cov, prec } = overlap(ct, ut);
        if (cov === 1 && prec >= 0.6) return { correct: true };
      }
    }
    if (field === "artist") {
      const U = tokens(user, ARTIST_GENERIC);
      const people = artistPeople(key.answer);
      if (U.length && people.length) {
        const matched = people.filter(P => personMatch(P, U)).length;
        const allK = people.flat();
        const prec = overlap(allK, U).prec;
        if (strict ? matched === people.length && prec >= 0.7 : matched >= 1 && prec >= 0.6) return { correct: true };
      }
    }
    return { correct: false };
  }

  // ---------- dates ----------
  function parseDate(s) {
    let t = fold(s).replace(/(\d),(?=\d{3})/g, "$1").replace(/[‐-―−]/g, "-");
    const eras = [];
    const eraRe = /\b(b\.?\s?c\.?\s?e\.?|b\.?\s?c\.?)(?![a-z])|\b(c\.?\s?e\.?|a\.?\s?d\.?)(?![a-z])/g;
    let m;
    while ((m = eraRe.exec(t))) eras.push({ pos: m.index, era: m[1] ? "bce" : "ce" });
    const vals = [];
    const numRe = /\b(\d+)(st|nd|rd|th|s)?\b|\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth)\b/g;
    while ((m = numRe.exec(t))) {
      const pos = m.index;
      let v, kind;
      const after = t.slice(pos, pos + 60);
      const unitWord = (after.match(/\b(centur|millenni)/) || [])[1];
      if (m[3]) { v = ORD[m[3]]; kind = unitWord === "millenni" ? "millennium" : "century"; }
      else if (m[2] && m[2] !== "s") { v = parseInt(m[1], 10); kind = unitWord === "millenni" ? "millennium" : "century"; }
      else if (m[2] === "s" && parseInt(m[1], 10) >= 100 && parseInt(m[1], 10) % 100 === 0) { v = parseInt(m[1], 10) / 100 + 1; kind = "century"; }
      else { v = parseInt(m[1], 10); kind = "year"; }
      const next = eras.find(e => e.pos > pos), prevE = [...eras].reverse().find(e => e.pos < pos);
      const era = next ? next.era : prevE ? prevE.era : "none";
      vals.push({ v, kind, era, pos });
    }
    return vals;
  }

  function eraOk(u, k) {
    if (u.era === k.era) return true;
    if (u.era === "none") return k.era !== "bce";
    if (k.era === "none") return u.era !== "bce";
    return false;
  }

  function valMatch(u, k, tol, lenient, ignoreEra, centuryOnly) {
    if (!ignoreEra && !eraOk(u, k)) return false;
    if (u.kind === k.kind) return u.kind === "year" ? Math.abs(u.v - k.v) <= tol : u.v === k.v;
    // a year inside the century counts, but only when the key gives no exact years
    if (lenient && centuryOnly && u.kind === "year" && k.kind === "century" && k.era !== "bce") {
      return u.v > (k.v - 1) * 100 - tol && u.v <= k.v * 100 + tol;
    }
    return false;
  }

  function gradeDate(key, user, opts) {
    const tol = opts.dateTolerance || 0, lenient = !opts.strict;
    const U = parseDate(user);
    if (!U.length) return { correct: false };
    const answers = [key.answer, ...(key.accept || [])];
    let hint = "";
    for (const a of answers) {
      const A = parseDate(a);
      if (!A.length) continue;
      // "required" numbers: the first part of the date that has numbers, ignoring parentheses
      const segs = stripParens(a).split(";");
      let R = [];
      for (const sg of segs) { R = parseDate(sg); if (R.length) break; }
      if (!R.length) R = A;
      const need = Math.min(2, R.length);
      const co = !A.some(k => k.kind === "year");
      const test = ignoreEra => {
        if (!U.every(u => A.some(k => valMatch(u, k, tol, lenient, ignoreEra, co)))) return false;
        const hitR = R.filter(k => U.some(u => valMatch(u, k, tol, lenient, ignoreEra, co))).length;
        const hitA = A.filter(k => U.some(u => valMatch(u, k, tol, lenient, ignoreEra, co))).length;
        return hitR >= need || (lenient && hitA >= need);
      };
      if (test(false)) return { correct: true };
      if (test(true)) hint = A.some(k => k.era === "bce") ? "Check B.C.E. vs. C.E." : "Check the era (B.C.E./C.E.)";
    }
    return { correct: false, hint };
  }

  function grade(field, key, user, opts) {
    opts = opts || {};
    if (field === "date") return gradeDate(key, user, opts);
    return gradeText(field, key, user, !!opts.strict);
  }

  const api = { grade, tokens, parseDate, fold };
  if (typeof module !== "undefined") module.exports = api; else root.Grader = api;
})(typeof window !== "undefined" ? window : globalThis);
