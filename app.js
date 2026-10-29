(function () {
  "use strict";

  const G = window.Grader;
  const { works } = parseWorks();
  const BY_NUM = new Map(works.map(w => [w.num, w]));
  const EXTRA = (typeof EXTRA_IMAGES !== "undefined" && EXTRA_IMAGES) || {};
  const LENIENCY = (typeof DATE_LENIENCY !== "undefined" && DATE_LENIENCY) || {};
  // years either side of the CED date that a typed date may be off by, when checking is lenient
  const leniencyOf = w => (LENIENCY[w.num] != null ? LENIENCY[w.num] : G.defaultLeniency(w.fields.date.answer));

  const LABEL = { title: "Title", artist: "Artist", culture: "Culture or period", location: "Location", date: "Date", material: "Material" };
  const QUESTION = {
    title: "What is this work called?",
    artist: "Who made it?",
    culture: "What culture or period is it from?",
    location: "Where is it from?",
    date: "When was it made?",
    material: "What is it made of?",
  };
  const TOMB_ORDER = ["artist", "title", "culture", "date", "location", "material"];

  // ---------- images: Knowt's image first, then Smarthistory's ----------
  const POOLS = new Map();
  for (const w of works) {
    const list = [];
    if (w.image) list.push({ src: w.image, cap: "", from: "Knowt" });
    for (const x of EXTRA[w.num] || []) {
      list.push({ src: SH_BASE + x.s, cap: x.c || "", from: "Smarthistory", page: x.a ? "https://smarthistory.org/" + x.a + "/" : "" });
    }
    POOLS.set(w.num, list);
  }
  const badImages = new Set(); // srcs that failed to load this visit
  const poolOf = num => (POOLS.get(num) || []).filter(p => !badImages.has(p.src));
  const imageAt = (num, idx) => (POOLS.get(num) || [])[idx] || null;

  // ---------- storage ----------
  const LS_SETTINGS = "apah.settings.v1";
  const LS_KEYS = { ids: "apah.session.v1", img: "apah.imgsession.v1" };
  const store = {
    get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* storage unavailable */ } },
  };

  const DEFAULTS = {
    tab: "ids", units: [1], range: "",
    mode: "typed", prompt: "image",
    fields: { title: true, artist: true, culture: true, location: true, date: true, material: true },
    mcqPer: "one", retry: "soon", order: "shuffle", strict: "lenient", idsImages: "main",
    img: { mode: "typed", per: "one", retry: "soon", order: "shuffle", strict: "lenient" },
  };

  function loadSettings() {
    const s = Object.assign({}, DEFAULTS, store.get(LS_SETTINGS) || {});
    s.fields = Object.assign({}, DEFAULTS.fields, s.fields || {});
    s.img = Object.assign({}, DEFAULTS.img, s.img || {});
    if (!Array.isArray(s.units)) s.units = DEFAULTS.units.slice();
    if (s.tab !== "ids" && s.tab !== "img") s.tab = "ids";
    return s;
  }
  function loadSession(kind) {
    const s = store.get(LS_KEYS[kind]);
    if (!s || s.v !== 1 || !Array.isArray(s.items) || !Array.isArray(s.queue)) return null;
    if (s.items.some(it => !BY_NUM.has(it.num))) return null;
    s.kind = kind;
    return s;
  }

  let settings = loadSettings();
  const sessions = { ids: loadSession("ids"), img: loadSession("img") };
  let session = null; // the session being reviewed right now
  let screen = "setup";
  let view = freshView();
  let lastCardKey = null;

  const app = document.getElementById("app");
  const lightbox = document.getElementById("lightbox");

  // ---------- helpers ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const plural = (n, one, many) => `${n} ${n === 1 ? one : (many || one + "s")}`;
  function freshView() { return { checked: false, results: {}, hints: {}, notes: {}, inputs: {}, revealed: {}, options: null, chosen: null, imgFailed: false, pick: null }; }
  function saveSettings() { store.set(LS_SETTINGS, settings); }
  function saveSession(s) {
    s = s || session;
    if (!s) return;
    sessions[s.kind] = s;
    store.set(LS_KEYS[s.kind], s);
  }
  function dropSession(kind) { sessions[kind] = null; store.del(LS_KEYS[kind]); if (session && session.kind === kind) session = null; }

  function parseRange(str) {
    const nums = new Set(), bad = [];
    const cleaned = String(str || "").replace(/[‐-―]/g, "-").replace(/\s*-\s*/g, "-").replace(/#/g, "");
    for (const part of cleaned.split(/[,;\s]+/).filter(Boolean)) {
      const m = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!m) { bad.push(part); continue; }
      let a = parseInt(m[1], 10), b = m[2] ? parseInt(m[2], 10) : a;
      if (a > b) [a, b] = [b, a];
      if (a < 1 || b > 250) { bad.push(part); continue; }
      for (let i = a; i <= b; i++) nums.add(i);
    }
    return { nums, bad };
  }

  function selectedNums() {
    const set = new Set();
    for (const u of UNITS) if (settings.units.includes(u.n)) for (let i = u.from; i <= u.to; i++) set.add(i);
    const r = parseRange(settings.range);
    r.nums.forEach(n => set.add(n));
    return { nums: [...set].sort((a, b) => a - b), bad: r.bad };
  }

  function askableFields(w, prompt, fieldsOn) {
    return FIELDS.filter(f => w.fields[f] && fieldsOn[f] && !(f === "title" && prompt === "title"));
  }

  // ---------- building a review ----------
  function buildIdsSession(nums, s) {
    const items = [];
    let skipped = 0;
    for (const num of nums) {
      const w = BY_NUM.get(num);
      const pool = POOLS.get(num) || [];
      let prompt = s.prompt === "mix" ? (Math.random() < 0.5 ? "image" : "title") : s.prompt;
      if (!pool.length) prompt = "title";
      let fs = askableFields(w, prompt, s.fields);
      if (!fs.length && prompt === "title" && pool.length && s.fields.title) { prompt = "image"; fs = askableFields(w, prompt, s.fields); }
      if (!fs.length) { skipped++; continue; }
      const img = s.idsImages === "any" && pool.length ? Math.floor(Math.random() * pool.length) : 0;
      if (s.mode === "typed") {
        items.push({ id: items.length, num, prompt, img, fields: fs, done: [], attempts: 0, missed: [] });
      } else {
        const picks = s.mcqPer === "all" ? fs : [fs[Math.floor(Math.random() * fs.length)]];
        for (const f of picks) items.push({ id: items.length, num, prompt, img, field: f, attempts: 0, missed: [] });
      }
    }
    return finishBuild("ids", items, s, skipped);
  }

  function buildImgSession(nums, s) {
    const items = [];
    let skipped = 0;
    for (const num of nums) {
      const pool = POOLS.get(num) || [];
      if (!pool.length) { skipped++; continue; }
      if (s.per === "all") pool.forEach((_, i) => items.push({ id: items.length, num, img: i, fixed: true, attempts: 0, missed: [] }));
      else items.push({ id: items.length, num, img: Math.floor(Math.random() * pool.length), fixed: false, attempts: 0, missed: [] });
    }
    return finishBuild("img", items, s, skipped);
  }

  function finishBuild(kind, items, s, skipped) {
    const queue = items.map(i => i.id);
    if (s.order === "shuffle") shuffle(queue);
    return {
      v: 1, kind, mode: s.mode, settings: JSON.parse(JSON.stringify(s)), items, queue,
      total: items.length, firstTryRight: 0, skipped, started: Date.now(), ended: null, finished: false,
    };
  }

  function reviewSettings(kind) {
    if (kind === "img") return Object.assign({}, settings.img);
    const s = Object.assign({}, settings);
    delete s.img; delete s.tab; delete s.units; delete s.range;
    return s;
  }

  const currentItem = () => session.items[session.queue[0]];
  const pendingFields = item => item.fields.filter(f => !item.done.includes(f));

  function advance(item, complete) {
    session.queue.shift();
    if (!complete) {
      const q = session.queue;
      const pos = session.settings.retry === "end" ? q.length : Math.min(q.length, 3 + Math.floor(Math.random() * 4));
      q.splice(pos, 0, item.id);
      // a work coming back in image review shows a different picture of it
      if (session.kind === "img" && !item.fixed) {
        const pool = POOLS.get(item.num) || [];
        const choices = pool.map((p, i) => i).filter(i => i !== item.img && !badImages.has(pool[i].src));
        if (choices.length) item.img = choices[Math.floor(Math.random() * choices.length)];
      }
    }
    if (!session.queue.length) { session.finished = true; session.ended = Date.now(); screen = "done"; }
    view = freshView();
    saveSession();
    render();
  }

  function gradeOpts(w) {
    const strict = session.settings.strict === "strict";
    return { strict, leniency: strict ? undefined : leniencyOf(w) };
  }

  // ---------- rendering ----------
  function render() {
    if ((screen === "review" || screen === "done") && !session) screen = "setup";
    if (screen === "review" && session.finished) screen = "done";
    if (screen === "setup") renderSetup();
    else if (screen === "browse") renderBrowse();
    else if (screen === "review") renderReview();
    else if (screen === "done") renderDone();
  }

  function seg(name, opts, value, label) {
    return `<div class="seg" role="radiogroup" aria-label="${esc(label)}">` +
      opts.map(([v, t]) => `<button type="button" role="radio" aria-checked="${v === value}" data-set="${name}" data-val="${v}">${esc(t)}</button>`).join("") +
      `</div>`;
  }

  function countText() {
    const { nums, bad } = selectedNums();
    let line = nums.length ? `${plural(nums.length, "work")} selected` : "No works selected yet";
    let sub = "";
    if (settings.tab === "ids") {
      const fieldsOn = Object.keys(settings.fields).filter(f => settings.fields[f]);
      if (nums.length && fieldsOn.length) {
        const usable = nums.filter(n => {
          const w = BY_NUM.get(n);
          return FIELDS.some(f => w.fields[f] && settings.fields[f] && !(f === "title" && (settings.prompt === "title" || !(POOLS.get(n) || []).length)));
        }).length;
        if (usable < nums.length) sub = `${usable} of them have the identifiers you picked`;
      }
      if (!fieldsOn.length) sub = "Pick at least one identifier to ask";
    } else if (nums.length) {
      const imgs = nums.reduce((a, n) => a + (POOLS.get(n) || []).length, 0);
      sub = `${plural(imgs, "image")} to draw from`;
    }
    return { line, sub, bad, n: nums.length };
  }

  function resumeHTML(kind) {
    const s = sessions[kind];
    if (!s) return "";
    if (!s.finished) {
      const doneN = s.total - s.queue.length;
      const what = kind === "img" ? "Image review" : "Identifier review";
      return `<div class="resume"><p><strong>${what} in progress.</strong> ${doneN} of ${s.total} done${s.mode === "mcq" ? " (multiple choice)" : ""}.</p>
        <div class="btns"><button class="btn primary" data-act="resume" data-kind="${kind}">Resume</button><button class="btn" data-act="discard" data-kind="${kind}">Discard it</button></div></div>`;
    }
    return `<div class="resume"><p>Your last ${kind === "img" ? "image" : "identifier"} review is finished.</p><div class="btns"><button class="btn" data-act="show-done" data-kind="${kind}">See results</button></div></div>`;
  }

  function idsOptionsHTML() {
    const s = settings;
    const fieldsHTML = FIELDS.map(f => `<label class="check"><input type="checkbox" data-field="${f}" ${s.fields[f] ? "checked" : ""}> ${f === "title" ? "Title (image cards)" : LABEL[f]}</label>`).join("");
    return `
      <h3>Answer by</h3>
      <div class="seg-row">${seg("mode", [["typed", "Typing the identifiers"], ["mcq", "Multiple choice"]], s.mode, "Answer by")}</div>
      <h3>Show me</h3>
      <div class="seg-row">${seg("prompt", [["image", "The image"], ["title", "The title"], ["mix", "A mix"]], s.prompt, "Show me")}</div>
      <h3>Identifiers to ask</h3>
      <div class="checks">${fieldsHTML}</div>
      ${s.mode === "mcq" ? `<h3>Questions per work</h3><div class="seg-row">${seg("mcqPer", [["one", "One identifier"], ["all", "Every identifier"]], s.mcqPer, "Questions per work")}</div>` : ""}
      <details class="more">
        <summary>More options</summary>
        <h3>Image on image cards</h3>
        <div class="seg-row">${seg("idsImages", [["main", "Main image"], ["any", "Any image of the work"]], s.idsImages, "Image on image cards")}</div>
        <h3>Missed works come back</h3>
        <div class="seg-row">${seg("retry", [["soon", "A few cards later"], ["end", "At the end"]], s.retry, "Missed works come back")}</div>
        <h3>Order</h3>
        <div class="seg-row">${seg("order", [["shuffle", "Shuffled"], ["inorder", "By number"]], s.order, "Order")}</div>
        ${s.mode === "typed" ? `<h3>Answer checking</h3>
        <div class="seg-row">${seg("strict", [["lenient", "Lenient"], ["strict", "Strict"]], s.strict, "Answer checking")}</div>
        <p class="help">Lenient accepts short names, a surname, part of a location, and any year within the AP scoring leniency for that work (for example ±50 years for c. 1450–1540, so 1400 to 1590 counts). Strict wants close to the full CED wording and dates.</p>` : ""}
      </details>`;
  }

  function imgOptionsHTML() {
    const s = settings.img;
    return `
      <p class="help" style="margin:0 0 4px">You get a picture of the work, often a different view or a detail, and name it.</p>
      <h3>Answer by</h3>
      <div class="seg-row">${seg("img.mode", [["typed", "Typing the title"], ["mcq", "Multiple choice"]], s.mode, "Answer by")}</div>
      <h3>Images per work</h3>
      <div class="seg-row">${seg("img.per", [["one", "One at a time"], ["all", "Every image"]], s.per, "Images per work")}</div>
      <p class="help">One at a time shows a random image, and a different one each time a missed work comes back. Every image asks about each picture separately.</p>
      <details class="more">
        <summary>More options</summary>
        <h3>Missed images come back</h3>
        <div class="seg-row">${seg("img.retry", [["soon", "A few cards later"], ["end", "At the end"]], s.retry, "Missed images come back")}</div>
        <h3>Order</h3>
        <div class="seg-row">${seg("img.order", [["shuffle", "Shuffled"], ["inorder", "By number"]], s.order, "Order")}</div>
        ${s.mode === "typed" ? `<h3>Answer checking</h3>
        <div class="seg-row">${seg("img.strict", [["lenient", "Lenient"], ["strict", "Strict"]], s.strict, "Answer checking")}</div>
        <p class="help">Lenient accepts common short titles like “Vienna Genesis” and small typos.</p>` : ""}
      </details>`;
  }

  function renderSetup() {
    const s = settings;
    const c = countText();
    const tab = s.tab;
    app.innerHTML = `
      <header class="masthead">
        <h1>AP Art History review</h1>
        <p class="lede">Choose works by unit or by number, then drill them. Anything you miss comes back until you've gotten every one right once.</p>
      </header>
      <div class="tabs" role="tablist" aria-label="Review type">
        <button type="button" role="tab" id="tab-ids" aria-selected="${tab === "ids"}" aria-controls="how" data-tab="ids">Identifier review</button>
        <button type="button" role="tab" id="tab-img" aria-selected="${tab === "img"}" aria-controls="how" data-tab="img">Image review</button>
      </div>
      ${resumeHTML(tab)}
      <div class="setup-grid">
        <section class="panel" aria-labelledby="h-works">
          <h2 id="h-works">Works</h2>
          <div class="units">
            ${UNITS.map(u => `<button type="button" class="unit" aria-pressed="${s.units.includes(u.n)}" data-unit="${u.n}">
              <span class="unit-n">${u.n}</span><span class="unit-name">${esc(u.name)}</span><span class="unit-range">${u.from}–${u.to}</span></button>`).join("")}
          </div>
          <div class="unit-tools">
            <button type="button" class="btn small" data-act="units-all">Select all units</button>
            <button type="button" class="btn small" data-act="units-none">Clear units</button>
          </div>
          <label class="field-label" for="range">Work numbers</label>
          <input id="range" class="text-input" inputmode="text" autocomplete="off" placeholder="e.g. 1-60, 75, 100-110" value="${esc(s.range)}">
          <p class="help" id="range-help">${c.bad.length ? `Couldn't read: ${esc(c.bad.join(", "))}. Use numbers 1–250 and ranges like 12-47.` : "Added to any units selected above."}</p>
        </section>

        <section class="panel" id="how" role="tabpanel" aria-labelledby="tab-${tab}">
          <h2>${tab === "img" ? "Image review" : "Identifier review"}</h2>
          ${tab === "img" ? imgOptionsHTML() : idsOptionsHTML()}
        </section>
      </div>

      <div class="start-bar">
        <p class="count" id="count">${esc(c.line)}${c.sub ? `<small>${esc(c.sub)}</small>` : ""}</p>
        <button type="button" class="btn" data-act="browse" ${c.n ? "" : "disabled"}>Browse these works</button>
        <button type="button" class="btn primary big" data-act="start" ${c.n ? "" : "disabled"}>Start ${tab === "img" ? "image" : "identifier"} review</button>
      </div>

      <p class="credits">Identifiers follow the list of required works in the College Board's AP Art History Course and Exam Description (effective fall 2020). The main image for each work comes from the Knowt set “ap art history 250 (identifiers only)”; the other images and their captions come from Smarthistory's AP Art History guide. Images load from those sites. Progress is saved in this browser.</p>`;
  }

  function updateCount() {
    const c = countText();
    const el = document.getElementById("count");
    if (el) { el.style.color = ""; el.innerHTML = `${esc(c.line)}${c.sub ? `<small>${esc(c.sub)}</small>` : ""}`; }
    const help = document.getElementById("range-help");
    if (help) {
      help.className = "help" + (c.bad.length ? " bad" : "");
      help.textContent = c.bad.length ? `Couldn't read: ${c.bad.join(", ")}. Use numbers 1–250 and ranges like 12-47.` : "Added to any units selected above.";
    }
    app.querySelectorAll('[data-act="start"], [data-act="browse"]').forEach(b => { b.disabled = !c.n; });
  }

  function imgTag(src, alt, extra) {
    return `<img src="${esc(src)}" alt="${esc(alt)}" referrerpolicy="no-referrer" ${extra || ""}>`;
  }

  function tombstone(w, showLeniency) {
    return `<dl class="tomb">` + TOMB_ORDER.filter(f => w.fields[f]).map(f => {
      const len = f === "date" && showLeniency ? ` <span class="len" title="Typed answers within this many years count in lenient checking">±${leniencyOf(w)} years</span>` : "";
      return `<div><dt>${LABEL[f]}</dt><dd class="${f === "title" ? "t" : f === "artist" ? "a" : ""}">${esc(w.fields[f].answer)}${len}</dd></div>`;
    }).join("") + `</dl>`;
  }

  function creditHTML(p) {
    if (!p) return "";
    if (p.from === "Smarthistory") {
      return `<p class="img-credit">${p.cap ? esc(p.cap) + " " : ""}<a href="${esc(p.page || "https://smarthistory.org/curated-guide/ap-art-history/")}" target="_blank" rel="noopener">Smarthistory</a></p>`;
    }
    return `<p class="img-credit">Image from the Knowt set.</p>`;
  }

  // which picture this card shows
  function cardImage(item) {
    const pool = POOLS.get(item.num) || [];
    let p = pool[item.img];
    if (!p || badImages.has(p.src)) {
      const ok = pool.findIndex(x => !badImages.has(x.src));
      if (ok < 0) return null;
      item.img = ok;
      p = pool[ok];
    }
    return p;
  }

  function wallHTML(item, w) {
    const answered = view.checked;
    const showImage = session.kind === "img" || item.prompt === "image";
    const p = showImage ? cardImage(item) : null;
    if (showImage && p) {
      return `<button type="button" class="frame" data-act="zoom-card" aria-label="Enlarge image">${imgTag(p.src, "Work to identify")}</button>
        ${answered ? `<p class="caption">No. ${w.num}</p>${session.kind === "img" ? creditHTML(p) : ""}` : ""}`;
    }
    const note = showImage ? `<p class="img-note">The image didn't load, so here's the title instead.</p>` : "";
    const first = poolOf(w.num)[0];
    const after = answered && first
      ? `<button type="button" class="frame small" data-act="zoom-work" data-num="${w.num}" aria-label="Enlarge image">${imgTag(first.src, w.fields.title.answer)}</button>` : "";
    return `${note}<div class="placard"><span class="no">No. ${w.num}</span><h2 class="work-title">${esc(w.fields.title.answer)}</h2></div>${after}`;
  }

  function fieldRow(f, key, pend) {
    let state = "", fb = "";
    if (view.checked) {
      const ok = view.results[f];
      state = ok ? "right" : "wrong";
      fb = ok
        ? `<p class="fb ok"><span class="mark" aria-hidden="true">✓</span><span class="sr-only">Correct.</span><span class="key">${esc(key.answer)}</span>${view.notes[f] ? ` <em class="hint">${esc(view.notes[f])}</em>` : ""}</p>`
        : `<p class="fb no"><span class="mark" aria-hidden="true">✗</span><span class="sr-only">Missed. Answer:</span><span class="key">${esc(key.answer)}</span>${view.hints[f] ? ` <em class="hint">${esc(view.hints[f])}</em>` : ""}</p>
           <button type="button" class="btn small override" data-act="override" data-f="${f}">Count mine as right</button>`;
    }
    return `<div class="row ${state}"><label class="lab" for="in-${f}">${LABEL[f]}</label>
      <input id="in-${f}" class="in" data-f="${f}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="${f === pend[pend.length - 1] ? "done" : "next"}" ${view.checked ? "readonly" : ""} value="${esc(view.inputs[f] || "")}">
      ${fb}</div>`;
  }

  function typedHTML(item, w) {
    const pend = pendingFields(item);
    const rows = item.fields.map(f => {
      const key = w.fields[f];
      if (item.done.includes(f)) {
        const shown = !!view.revealed[f] || view.checked;
        return `<div class="row locked${shown ? " shown" : ""}"><span class="lab">${LABEL[f]}</span>
          <button type="button" class="locked-btn" data-act="reveal" data-f="${f}" aria-expanded="${shown}">${shown ? `<span class="ans">${esc(key.answer)}</span>` : `You got this one already. Show answer`}</button></div>`;
      }
      return fieldRow(f, key, pend);
    }).join("");

    let actions;
    if (!view.checked) {
      actions = `<div class="actions"><button type="submit" class="btn primary big">Check</button></div>
        <p class="tip">Enter moves to the next box. Leave a box blank if you don't know it.</p>`;
    } else {
      const wrong = pend.filter(f => !view.results[f]);
      const when = session.settings.retry === "end" ? "at the end" : "in a few cards";
      const note = wrong.length
        ? `<p class="note">This work comes back ${when}, with only the ${wrong.length === 1 ? "identifier" : "identifiers"} you missed.</p>`
        : `<p class="note good">${item.fields.length > pend.length ? "That finishes this work." : "All right."}</p>`;
      actions = `<div class="actions"><button type="button" class="btn primary big" data-act="next">Next</button>${note}</div>`;
    }
    const title = item.attempts > 0 && pend.length < item.fields.length ? "Finish the ones you missed" : "Identify this work";
    return `<form class="label-card" id="typed-form" autocomplete="off" novalidate>
      <h2 class="q">${title}</h2>${rows}${actions}</form>`;
  }

  function imgTypedHTML(item, w) {
    let actions;
    if (!view.checked) {
      actions = `<div class="actions"><button type="submit" class="btn primary big">Check</button></div>
        <p class="tip">Short titles count, like “Vienna Genesis” or “The Great Wave.” Leave it blank if you don't know.</p>`;
    } else {
      const ok = view.results.title;
      const when = session.settings.retry === "end" ? "at the end" : "in a few cards";
      actions = `<div class="actions"><button type="button" class="btn primary big" data-act="next">Next</button>
        <p class="note${ok ? " good" : ""}">${ok ? "Right." : `This work comes back ${when}${item.fixed ? "" : " with a different image"}.`}</p></div>${tombstone(w)}`;
    }
    return `<form class="label-card" id="typed-form" autocomplete="off" novalidate>
      <h2 class="q">What is this work called?</h2>${fieldRow("title", w.fields.title, ["title"])}${actions}</form>`;
  }

  function buildOptions(field, w) {
    const key = w.fields[field];
    const seen = new Set([G.fold(key.answer).trim()]);
    const cands = works.filter(o => o !== w && o.fields[field])
      .sort((a, b) => Math.abs(a.num - w.num) - Math.abs(b.num - w.num));
    const pool = [];
    for (const o of cands) {
      const v = o.fields[field].answer, k = G.fold(v).trim();
      if (seen.has(k)) continue;
      if (G.grade(field, key, v, {}).correct) continue; // would also count as right
      seen.add(k);
      pool.push(v);
      if (pool.length >= 9) break;
    }
    const picks = shuffle(pool).slice(0, 3);
    return shuffle([{ text: key.answer, correct: true }, ...picks.map(t => ({ text: t, correct: false }))]);
  }

  function mcqHTML(item, w) {
    const field = session.kind === "img" ? "title" : item.field;
    if (!view.options) view.options = buildOptions(field, w);
    const opts = view.options.map((o, i) => {
      let cls = "opt";
      if (view.checked) cls += o.correct ? " right" : i === view.chosen ? " wrong" : " dim";
      return `<button type="button" class="${cls}" data-act="choose" data-i="${i}" ${view.checked ? "disabled" : ""}><span class="k">${i + 1}</span><span>${esc(o.text)}</span></button>`;
    }).join("");
    let after = "";
    if (view.checked) {
      const ok = view.options[view.chosen].correct;
      const when = session.settings.retry === "end" ? "at the end" : "in a few cards";
      const again = session.kind === "img" ? (item.fixed ? "This image comes back" : "This work comes back with a different image") : "This question comes back";
      after = `<div class="actions"><button type="button" class="btn primary big" data-act="next">Next</button>
        <p class="note${ok ? " good" : ""}">${ok ? "Right." : `Not quite. ${again} ${when}.`}</p></div>${tombstone(w)}`;
    }
    return `<div class="label-card"><h2 class="q">${QUESTION[field]}</h2><div class="opts">${opts}</div>${after}
      ${view.checked ? "" : `<p class="tip">Press 1–4 to answer.</p>`}</div>`;
  }

  function renderReview() {
    const item = currentItem();
    const w = BY_NUM.get(item.num);
    if (session.kind === "img" && !cardImage(item)) { item.attempts++; session.skipped++; advance(item, true); return; }
    const doneN = session.total - session.queue.length;
    const retryN = session.queue.filter(id => session.items[id].attempts > 0).length;
    const pct = session.total ? Math.round(100 * doneN / session.total) : 0;
    const cardKey = `${session.kind}:${item.id}:${item.attempts}`;
    const isNewCard = cardKey !== lastCardKey;
    lastCardKey = cardKey;

    let side;
    if (session.kind === "img") side = session.mode === "typed" ? imgTypedHTML(item, w) : mcqHTML(item, w);
    else side = session.mode === "typed" ? typedHTML(item, w) : mcqHTML(item, w);

    app.innerHTML = `
      <div class="topbar">
        <button type="button" class="btn small" data-act="exit">Exit</button>
        <div class="progress" aria-label="Progress">
          <div class="bar"><span style="width:${pct}%"></span></div>
          <p>${session.kind === "img" ? "Image review: " : ""}${doneN} of ${session.total} done${retryN ? `, ${retryN} to retry` : ""}</p>
        </div>
      </div>
      <div class="stage">
        <div class="wall">${wallHTML(item, w)}</div>
        <div class="side">${side}</div>
      </div>`;

    const img = app.querySelector(".wall .frame:not(.small) img");
    if (img) img.addEventListener("error", onImageError, { once: true });

    if (isNewCard) {
      window.scrollTo(0, 0);
      prefetchNext();
    }
    const typed = session.mode === "typed";
    if (typed && !view.checked) {
      const ids = session.kind === "img" ? ["title"] : pendingFields(item);
      const first = ids.map(f => document.getElementById("in-" + f)).find(el => el && !el.value) || document.getElementById("in-" + ids[0]);
      if (first && isNewCard && window.matchMedia("(hover: hover)").matches) first.focus();
    } else if (view.checked) {
      const nb = app.querySelector('[data-act="next"]');
      if (nb) nb.focus({ preventScroll: true });
    }
  }

  function onImageError(e) {
    const item = currentItem();
    const src = e && e.target && e.target.getAttribute("src");
    if (src) badImages.add(src);
    if (session.kind === "img") {
      if (item.fixed) { item.attempts++; session.skipped++; advance(item, true); return; }
      render(); // cardImage() moves on to another picture of the work
      return;
    }
    if (poolOf(item.num).length) { render(); return; }
    if (session.mode === "typed" && item.fields.includes("title") && !item.done.includes("title")) {
      item.done.push("title"); // the title is now on screen, so it can't be asked
      if (!pendingFields(item).length) { advance(item, true); return; }
    }
    render();
  }

  function prefetchNext() {
    const id = session.queue[1];
    if (id == null) return;
    const it = session.items[id];
    if (session.kind === "ids" && it.prompt !== "image") return;
    const p = imageAt(it.num, it.img);
    if (p) { const im = new Image(); im.referrerPolicy = "no-referrer"; im.src = p.src; }
  }

  function renderDone() {
    const s = session;
    const mins = Math.max(1, Math.round(((s.ended || Date.now()) - s.started) / 60000));
    const pct = s.total ? Math.round(100 * s.firstTryRight / s.total) : 0;
    const missed = new Map();
    for (const it of s.items) {
      if (!it.missed.length) continue;
      const arr = missed.get(it.num) || [];
      it.missed.forEach(f => { if (!arr.includes(f)) arr.push(f); });
      missed.set(it.num, arr);
    }
    const unit = s.kind === "img" ? "image" : s.mode === "typed" ? "work" : "question";
    const list = [...missed.entries()].sort((a, b) => a[0] - b[0]).map(([num, fs]) => {
      const w = BY_NUM.get(num);
      const p = poolOf(num)[0];
      const th = p ? `<img class="thumb" src="${esc(p.src)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="thumb none">No image</span>`;
      const what = s.kind === "img" ? `Missed ${plural(fs.length, "time")}` : `Missed ${fs.map(f => LABEL[f].toLowerCase()).join(", ")}`;
      return `<li>${th}<div><div class="t">No. ${num}: ${esc(w.fields.title.answer)}</div><div class="m">${what}</div></div></li>`;
    }).join("");

    app.innerHTML = `
      <header class="done-head">
        <h1>${missed.size ? "Review finished" : "Perfect review"}</h1>
      </header>
      <ul class="stats">
        <li><strong>${s.total}</strong>${unit}s reviewed</li>
        <li><strong>${pct}%</strong>right on the first try</li>
        <li><strong>${mins}</strong>${mins === 1 ? "minute" : "minutes"}</li>
      </ul>
      <div class="done-actions">
        ${missed.size ? `<button type="button" class="btn primary big" data-act="again-missed">Review the ${plural(missed.size, "work")} I missed</button>` : ""}
        <button type="button" class="btn${missed.size ? "" : " primary big"}" data-act="again-all">Review the same works again</button>
        <button type="button" class="btn" data-act="home">Back to setup</button>
      </div>
      ${missed.size ? `<h2 class="section-title">Missed at least once</h2><ul class="missed">${list}</ul>` : ""}
      ${s.skipped ? `<p class="help">${plural(s.skipped, s.kind === "img" ? "image" : "work")} skipped (no image, an image that didn't load, or none of the identifiers you picked).</p>` : ""}`;
  }

  function renderBrowse() {
    const { nums } = selectedNums();
    const cards = nums.map(n => {
      const w = BY_NUM.get(n);
      const pool = poolOf(n);
      const pic = pool.length
        ? `<button type="button" class="pic" data-act="zoom-work" data-num="${n}" aria-label="View images of ${esc(w.fields.title.answer)}">${imgTag(pool[0].src, w.fields.title.answer, 'loading="lazy"')}</button>`
        : `<div class="pic none">No image</div>`;
      const more = pool.length > 1 ? `<button type="button" class="btn small more-imgs" data-act="zoom-work" data-num="${n}">See all ${pool.length} images</button>` : "";
      return `<article class="card">${pic}<div class="body"><span class="no">No. ${n}</span>${tombstone(w, true)}${more}</div></article>`;
    }).join("");
    app.innerHTML = `
      <div class="browse-head">
        <h1>${plural(nums.length, "work")}</h1>
        <div class="btns">
          <button type="button" class="btn" data-act="home">Back to setup</button>
          <button type="button" class="btn primary" data-act="start">Start ${settings.tab === "img" ? "image" : "identifier"} review</button>
        </div>
      </div>
      <div class="cards">${cards}</div>`;
    window.scrollTo(0, 0);
  }

  // ---------- lightbox ----------
  const lb = { list: [], i: 0, captions: true };
  const lbImg = lightbox.querySelector("img");
  const lbCap = lightbox.querySelector(".lb-cap");
  const lbCount = lightbox.querySelector(".lb-count");
  function openLightbox(list, i, captions) {
    if (!list.length) return;
    lb.list = list; lb.i = i || 0; lb.captions = captions !== false;
    showLightbox();
    lightbox.hidden = false;
    lightbox.querySelector(".lb-close").focus();
  }
  function showLightbox() {
    const p = lb.list[lb.i];
    lbImg.referrerPolicy = "no-referrer";
    lbImg.src = p.src;
    lbCap.innerHTML = lb.captions ? (p.from === "Smarthistory" ? `${esc(p.cap)} <a href="${esc(p.page || "https://smarthistory.org/")}" target="_blank" rel="noopener">Smarthistory</a>` : "Image from the Knowt set.") : "";
    const many = lb.list.length > 1;
    lightbox.querySelector(".lb-prev").hidden = !many;
    lightbox.querySelector(".lb-next").hidden = !many;
    lbCount.textContent = many ? `${lb.i + 1} of ${lb.list.length}` : "";
  }
  function stepLightbox(d) { if (lb.list.length > 1) { lb.i = (lb.i + d + lb.list.length) % lb.list.length; showLightbox(); } }
  function closeLightbox() { lightbox.hidden = true; lbImg.removeAttribute("src"); }
  lightbox.addEventListener("click", e => {
    const b = e.target.closest("[data-lb]");
    if (b) { e.stopPropagation(); if (b.dataset.lb === "prev") stepLightbox(-1); else if (b.dataset.lb === "next") stepLightbox(1); else closeLightbox(); return; }
    if (e.target.closest("a")) return;
    if (e.target === lbImg) { stepLightbox(1); if (lb.list.length < 2) closeLightbox(); return; }
    closeLightbox();
  });

  // ---------- actions ----------
  function start(kind, nums, s) {
    if (kind === "ids" && !Object.values(s.fields).some(Boolean)) { alertInline("Pick at least one identifier to ask."); return; }
    const sess = kind === "img" ? buildImgSession(nums, s) : buildIdsSession(nums, s);
    if (!sess.total) {
      alertInline(kind === "img" ? "None of these works have images." : "None of these works have the identifiers you picked. Turn on more identifiers.");
      return;
    }
    session = sess;
    view = freshView();
    lastCardKey = null;
    screen = "review";
    saveSession();
    render();
  }

  function alertInline(msg) {
    const el = document.getElementById("count");
    if (el) { el.textContent = msg; el.style.color = "var(--wrong)"; setTimeout(updateCount, 3500); }
  }

  function readInputs() {
    app.querySelectorAll(".row .in").forEach(el => { if (!el.readOnly) view.inputs[el.dataset.f] = el.value; });
  }

  function checkTyped() {
    const item = currentItem(), w = BY_NUM.get(item.num);
    readInputs();
    const opts = gradeOpts(w);
    const fields = session.kind === "img" ? ["title"] : pendingFields(item);
    for (const f of fields) {
      const val = (view.inputs[f] || "").trim();
      const r = val ? G.grade(f, w.fields[f], val, opts) : { correct: false };
      view.results[f] = !!r.correct;
      view.hints[f] = r.hint || "";
      view.notes[f] = r.note || "";
    }
    view.checked = true;
    render();
  }

  function nextTyped() {
    const item = currentItem();
    if (session.kind === "img") {
      const ok = !!view.results.title;
      item.attempts++;
      if (!ok) item.missed.push("title");
      if (item.attempts === 1 && ok) session.firstTryRight++;
      advance(item, ok);
      return;
    }
    const pend = pendingFields(item);
    const wrong = pend.filter(f => !view.results[f]);
    item.attempts++;
    pend.filter(f => view.results[f]).forEach(f => item.done.push(f));
    wrong.forEach(f => { if (!item.missed.includes(f)) item.missed.push(f); });
    if (item.attempts === 1 && !wrong.length && !item.missed.length) session.firstTryRight++;
    advance(item, wrong.length === 0);
  }

  function chooseMcq(i) {
    if (view.checked || !view.options || !view.options[i]) return;
    view.chosen = i;
    view.checked = true;
    render();
  }

  function nextMcq() {
    const item = currentItem();
    const ok = view.options[view.chosen].correct;
    item.attempts++;
    const tag = session.kind === "img" ? "title" : item.field;
    if (!ok) { if (session.kind === "img" || !item.missed.includes(tag)) item.missed.push(tag); }
    if (item.attempts === 1 && ok) session.firstTryRight++;
    advance(item, ok);
  }

  function goNext() {
    if (screen !== "review" || !view.checked) return;
    if (session.mode === "typed") nextTyped(); else nextMcq();
  }

  function setSetting(path, val) {
    if (path.startsWith("img.")) settings.img[path.slice(4)] = val;
    else settings[path] = val;
    saveSettings();
  }

  function rerenderSetupKeepingDetails() {
    const openMore = !!app.querySelector("details.more[open]");
    renderSetup();
    if (openMore) { const d = app.querySelector("details.more"); if (d) d.open = true; }
  }

  function againFrom(nums) {
    const kind = session.kind;
    start(kind, nums, Object.assign({}, session.settings));
  }

  app.addEventListener("click", e => {
    const t = e.target.closest("button");
    if (!t || t.disabled) return;

    if (t.dataset.unit) {
      const n = parseInt(t.dataset.unit, 10);
      settings.units = settings.units.includes(n) ? settings.units.filter(x => x !== n) : [...settings.units, n].sort((a, b) => a - b);
      t.setAttribute("aria-pressed", settings.units.includes(n));
      saveSettings(); updateCount();
      return;
    }
    if (t.dataset.tab) { settings.tab = t.dataset.tab; saveSettings(); renderSetup(); return; }
    if (t.dataset.set) { setSetting(t.dataset.set, t.dataset.val); rerenderSetupKeepingDetails(); return; }

    switch (t.dataset.act) {
      case "units-all": settings.units = UNITS.map(u => u.n); saveSettings(); renderSetup(); break;
      case "units-none": settings.units = []; saveSettings(); renderSetup(); break;
      case "start": start(settings.tab, selectedNums().nums, reviewSettings(settings.tab)); break;
      case "browse": screen = "browse"; render(); break;
      case "home": case "exit": screen = "setup"; render(); window.scrollTo(0, 0); break;
      case "resume": session = sessions[t.dataset.kind]; view = freshView(); lastCardKey = null; screen = "review"; render(); break;
      case "discard": dropSession(t.dataset.kind); renderSetup(); break;
      case "show-done": session = sessions[t.dataset.kind]; screen = "done"; render(); break;
      case "zoom-card": {
        const p = cardImage(currentItem());
        if (p) openLightbox([p], 0, view.checked && session.kind === "img");
        break;
      }
      case "zoom-work": openLightbox(poolOf(parseInt(t.dataset.num, 10)), 0, true); break;
      case "reveal": view.revealed[t.dataset.f] = !view.revealed[t.dataset.f]; readInputs(); render(); break;
      case "override": view.results[t.dataset.f] = true; view.hints[t.dataset.f] = ""; view.notes[t.dataset.f] = "Counted by you"; render(); break;
      case "next": goNext(); break;
      case "choose": chooseMcq(parseInt(t.dataset.i, 10)); break;
      case "again-missed": againFrom([...new Set(session.items.filter(i => i.missed.length).map(i => i.num))].sort((a, b) => a - b)); break;
      case "again-all": againFrom([...new Set(session.items.map(i => i.num))].sort((a, b) => a - b)); break;
    }
  });

  app.addEventListener("submit", e => {
    if (e.target.id === "typed-form") { e.preventDefault(); if (!view.checked) checkTyped(); }
  });

  app.addEventListener("input", e => {
    const t = e.target;
    if (t.id === "range") { settings.range = t.value; saveSettings(); updateCount(); }
    else if (t.classList.contains("in")) view.inputs[t.dataset.f] = t.value;
  });

  app.addEventListener("change", e => {
    const t = e.target;
    if (t.dataset.field) { settings.fields[t.dataset.field] = t.checked; saveSettings(); updateCount(); }
  });

  app.addEventListener("keydown", e => {
    const t = e.target;
    if (e.key === "Enter" && t.classList && t.classList.contains("in") && !view.checked) {
      e.preventDefault();
      const inputs = [...app.querySelectorAll(".row .in:not([readonly])")];
      const i = inputs.indexOf(t);
      if (i >= 0 && i < inputs.length - 1) inputs[i + 1].focus();
      else checkTyped();
    }
  });

  document.addEventListener("keydown", e => {
    if (!lightbox.hidden) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      return;
    }
    if (screen !== "review" || !session || e.metaKey || e.ctrlKey || e.altKey) return;
    const ae = document.activeElement;
    const tag = (ae && ae.tagName) || "";
    if (session.mode === "mcq" && !view.checked && /^[1-4]$/.test(e.key)) {
      e.preventDefault(); chooseMcq(parseInt(e.key, 10) - 1); return;
    }
    const typing = tag === "INPUT" && !ae.readOnly;
    if (view.checked && (e.key === "Enter" || (e.key === " " && session.mode === "mcq")) && tag !== "BUTTON" && tag !== "A" && !typing) {
      e.preventDefault(); goNext();
    }
  });

  render();
})();
