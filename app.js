(function () {
  "use strict";

  const G = window.Grader;
  const { works } = parseWorks();
  const BY_NUM = new Map(works.map(w => [w.num, w]));

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

  const LS_SETTINGS = "apah.settings.v1";
  const LS_SESSION = "apah.session.v1";
  const store = {
    get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* storage unavailable */ } },
  };

  const DEFAULTS = {
    units: [1], range: "", mode: "typed", prompt: "image",
    fields: { title: true, artist: true, culture: true, location: true, date: true, material: true },
    mcqPer: "one", retry: "soon", order: "shuffle", strict: "lenient", tol: "0",
  };

  function loadSettings() {
    const s = Object.assign({}, DEFAULTS, store.get(LS_SETTINGS) || {});
    s.fields = Object.assign({}, DEFAULTS.fields, s.fields || {});
    if (!Array.isArray(s.units)) s.units = DEFAULTS.units.slice();
    return s;
  }
  function loadSession() {
    const s = store.get(LS_SESSION);
    if (!s || s.v !== 1 || !Array.isArray(s.items) || !Array.isArray(s.queue)) return null;
    if (s.items.some(it => !BY_NUM.has(it.num))) return null;
    return s;
  }

  let settings = loadSettings();
  let session = loadSession();
  let screen = "setup";
  let view = freshView();
  let lastCardKey = null;

  const app = document.getElementById("app");
  const lightbox = document.getElementById("lightbox");

  // ---------- helpers ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const plural = (n, one, many) => `${n} ${n === 1 ? one : (many || one + "s")}`;
  function freshView() { return { checked: false, results: {}, hints: {}, inputs: {}, revealed: {}, options: null, chosen: null, imgFailed: false }; }
  function saveSettings() { store.set(LS_SETTINGS, settings); }
  function saveSession() { if (session) store.set(LS_SESSION, session); else store.del(LS_SESSION); }

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

  function buildSession(nums, s) {
    const items = [];
    let skipped = 0;
    for (const num of nums) {
      const w = BY_NUM.get(num);
      let prompt = s.prompt === "mix" ? (Math.random() < 0.5 ? "image" : "title") : s.prompt;
      if (!w.image) prompt = "title";
      let fs = askableFields(w, prompt, s.fields);
      if (!fs.length && prompt === "title" && w.image && s.fields.title) { prompt = "image"; fs = askableFields(w, prompt, s.fields); }
      if (!fs.length) { skipped++; continue; }
      if (s.mode === "typed") {
        items.push({ id: items.length, num, prompt, fields: fs, done: [], attempts: 0, missed: [] });
      } else {
        const picks = s.mcqPer === "all" ? fs : [fs[Math.floor(Math.random() * fs.length)]];
        for (const f of picks) items.push({ id: items.length, num, prompt, field: f, attempts: 0, missed: [] });
      }
    }
    const queue = items.map(i => i.id);
    if (s.order === "shuffle") shuffle(queue);
    return {
      v: 1, mode: s.mode, settings: JSON.parse(JSON.stringify(s)), items, queue,
      total: items.length, firstTryRight: 0, skipped, started: Date.now(), ended: null, finished: false,
    };
  }

  const currentItem = () => session.items[session.queue[0]];
  const pendingFields = item => item.fields.filter(f => !item.done.includes(f));

  function advance(item, complete) {
    session.queue.shift();
    if (!complete) {
      const q = session.queue;
      const pos = session.settings.retry === "end" ? q.length : Math.min(q.length, 3 + Math.floor(Math.random() * 4));
      q.splice(pos, 0, item.id);
    }
    if (!session.queue.length) { session.finished = true; session.ended = Date.now(); screen = "done"; }
    view = freshView();
    saveSession();
    render();
  }

  function gradeOpts() {
    return { strict: session.settings.strict === "strict", dateTolerance: parseInt(session.settings.tol, 10) || 0 };
  }

  // ---------- rendering ----------
  function render() {
    if (screen === "review" && (!session || session.finished)) screen = session ? "done" : "setup";
    if (screen === "done" && !session) screen = "setup";
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
    const fieldsOn = Object.keys(settings.fields).filter(f => settings.fields[f]);
    let line = nums.length ? `${plural(nums.length, "work")} selected` : "No works selected yet";
    let sub = "";
    if (nums.length && fieldsOn.length) {
      const usable = nums.filter(n => {
        const w = BY_NUM.get(n);
        return FIELDS.some(f => w.fields[f] && settings.fields[f] && !(f === "title" && (settings.prompt === "title" || !w.image)));
      }).length;
      if (usable < nums.length) sub = `${usable} of them have the identifiers you picked`;
    }
    if (!fieldsOn.length) sub = "Pick at least one identifier to ask";
    return { line, sub, bad, n: nums.length };
  }

  function renderSetup() {
    const s = settings;
    const c = countText();
    let resume = "";
    if (session && !session.finished) {
      const doneN = session.total - session.queue.length;
      resume = `<div class="resume"><p><strong>Review in progress.</strong> ${doneN} of ${session.total} done${session.mode === "mcq" ? " (multiple choice)" : ""}.</p>
        <div class="btns"><button class="btn primary" data-act="resume">Resume</button><button class="btn" data-act="discard">Discard it</button></div></div>`;
    } else if (session && session.finished) {
      resume = `<div class="resume"><p>Your last review is finished.</p><div class="btns"><button class="btn" data-act="show-done">See results</button></div></div>`;
    }
    const fieldsHTML = FIELDS.map(f => `<label class="check"><input type="checkbox" data-field="${f}" ${s.fields[f] ? "checked" : ""}> ${f === "title" ? "Title (image cards)" : LABEL[f]}</label>`).join("");

    app.innerHTML = `
      <header class="masthead">
        <h1>AP Art History identifier review</h1>
        <p class="lede">Choose works by unit or by number, then identify each one from its image or its title. Anything you miss comes back until you've gotten every work right once.</p>
      </header>
      ${resume}
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

        <section class="panel" aria-labelledby="h-how">
          <h2 id="h-how">How to review</h2>
          <h3>Answer by</h3>
          <div class="seg-row">${seg("mode", [["typed", "Typing the identifiers"], ["mcq", "Multiple choice"]], s.mode, "Answer by")}</div>
          <h3>Show me</h3>
          <div class="seg-row">${seg("prompt", [["image", "The image"], ["title", "The title"], ["mix", "A mix"]], s.prompt, "Show me")}</div>
          <h3>Identifiers to ask</h3>
          <div class="checks">${fieldsHTML}</div>
          ${s.mode === "mcq" ? `<h3>Questions per work</h3><div class="seg-row">${seg("mcqPer", [["one", "One identifier"], ["all", "Every identifier"]], s.mcqPer, "Questions per work")}</div>` : ""}
          <details class="more">
            <summary>More options</summary>
            <h3>Missed works come back</h3>
            <div class="seg-row">${seg("retry", [["soon", "A few cards later"], ["end", "At the end"]], s.retry, "Missed works come back")}</div>
            <h3>Order</h3>
            <div class="seg-row">${seg("order", [["shuffle", "Shuffled"], ["inorder", "By number"]], s.order, "Order")}</div>
            ${s.mode === "typed" ? `<h3>Answer checking</h3>
            <div class="seg-row">${seg("strict", [["lenient", "Lenient"], ["strict", "Strict"]], s.strict, "Answer checking")}</div>
            <p class="help">Lenient accepts short names, a surname, or part of a location. Strict wants close to the full CED wording.</p>
            <h3><label for="tol">Date leeway</label></h3>
            <select id="tol">${[["0", "Exact years"], ["10", "Within 10 years"], ["25", "Within 25 years"], ["50", "Within 50 years"]].map(([v, t]) => `<option value="${v}" ${s.tol === v ? "selected" : ""}>${t}</option>`).join("")}</select>` : ""}
          </details>
        </section>
      </div>

      <div class="start-bar">
        <p class="count" id="count">${esc(c.line)}${c.sub ? `<small>${esc(c.sub)}</small>` : ""}</p>
        <button type="button" class="btn" data-act="browse" ${c.n ? "" : "disabled"}>Browse these works</button>
        <button type="button" class="btn primary big" data-act="start" ${c.n ? "" : "disabled"}>Start review</button>
      </div>

      <p class="credits">Identifiers follow Appendix A of the College Board's AP Art History Course and Exam Description. Images come from the Knowt set “ap art history 250 (identifiers only)” and load from Knowt's servers. Progress is saved in this browser.</p>`;
  }

  function updateCount() {
    const c = countText();
    const el = document.getElementById("count");
    if (el) el.innerHTML = `${esc(c.line)}${c.sub ? `<small>${esc(c.sub)}</small>` : ""}`;
    const help = document.getElementById("range-help");
    if (help) {
      help.className = "help" + (c.bad.length ? " bad" : "");
      help.textContent = c.bad.length ? `Couldn't read: ${c.bad.join(", ")}. Use numbers 1–250 and ranges like 12-47.` : "Added to any units selected above.";
    }
    app.querySelectorAll('[data-act="start"], [data-act="browse"]').forEach(b => { b.disabled = !c.n; });
  }

  function imgTag(w, cls, alt) {
    return `<img src="${esc(w.image)}" alt="${esc(alt)}" referrerpolicy="no-referrer" ${cls ? `class="${cls}"` : ""}>`;
  }

  function tombstone(w) {
    return `<dl class="tomb">` + TOMB_ORDER.filter(f => w.fields[f]).map(f =>
      `<div><dt>${LABEL[f]}</dt><dd class="${f === "title" ? "t" : f === "artist" ? "a" : ""}">${esc(w.fields[f].answer)}</dd></div>`).join("") + `</dl>`;
  }

  function wallHTML(item, w) {
    const answered = view.checked;
    const showImage = item.prompt === "image" && w.image && !view.imgFailed;
    if (showImage) {
      return `<button type="button" class="frame" data-act="zoom" data-src="${esc(w.image)}" aria-label="Enlarge image">${imgTag(w, "", "Work to identify")}</button>
        ${answered ? `<p class="caption">No. ${w.num}</p>` : ""}`;
    }
    const note = item.prompt === "image" && view.imgFailed ? `<p class="img-note">The image didn't load, so here's the title instead.</p>` : "";
    const after = answered && w.image && !view.imgFailed
      ? `<button type="button" class="frame small" data-act="zoom" data-src="${esc(w.image)}" aria-label="Enlarge image">${imgTag(w, "", w.fields.title.answer)}</button>` : "";
    return `${note}<div class="placard"><span class="no">No. ${w.num}</span><h2 class="work-title">${esc(w.fields.title.answer)}</h2></div>${after}`;
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
      let state = "", fb = "";
      if (view.checked) {
        const ok = view.results[f];
        state = ok ? "right" : "wrong";
        fb = ok
          ? `<p class="fb ok"><span class="mark" aria-hidden="true">✓</span><span class="sr-only">Correct.</span><span class="key">${esc(key.answer)}</span></p>`
          : `<p class="fb no"><span class="mark" aria-hidden="true">✗</span><span class="sr-only">Missed. Answer:</span><span class="key">${esc(key.answer)}</span>${view.hints[f] ? ` <em class="hint">${esc(view.hints[f])}</em>` : ""}</p>
             <button type="button" class="btn small override" data-act="override" data-f="${f}">Count mine as right</button>`;
      }
      return `<div class="row ${state}"><label class="lab" for="in-${f}">${LABEL[f]}</label>
        <input id="in-${f}" class="in" data-f="${f}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="${f === pend[pend.length - 1] ? "done" : "next"}" ${view.checked ? "readonly" : ""} value="${esc(view.inputs[f] || "")}">
        ${fb}</div>`;
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

  function buildOptions(item, w) {
    const f = item.field, key = w.fields[f];
    const seen = new Set([G.fold(key.answer).trim()]);
    const cands = works.filter(o => o !== w && o.fields[f])
      .sort((a, b) => Math.abs(a.num - w.num) - Math.abs(b.num - w.num));
    const pool = [];
    for (const o of cands) {
      const v = o.fields[f].answer, k = G.fold(v).trim();
      if (seen.has(k)) continue;
      if (G.grade(f, key, v, {}).correct) continue; // would also count as right
      seen.add(k);
      pool.push(v);
      if (pool.length >= 9) break;
    }
    const picks = shuffle(pool).slice(0, 3);
    return shuffle([{ text: key.answer, correct: true }, ...picks.map(t => ({ text: t, correct: false }))]);
  }

  function mcqHTML(item, w) {
    if (!view.options) view.options = buildOptions(item, w);
    const opts = view.options.map((o, i) => {
      let cls = "opt";
      if (view.checked) cls += o.correct ? " right" : i === view.chosen ? " wrong" : " dim";
      return `<button type="button" class="${cls}" data-act="choose" data-i="${i}" ${view.checked ? "disabled" : ""}><span class="k">${i + 1}</span><span>${esc(o.text)}</span></button>`;
    }).join("");
    let after = "";
    if (view.checked) {
      const ok = view.options[view.chosen].correct;
      const when = session.settings.retry === "end" ? "at the end" : "in a few cards";
      after = `<div class="actions"><button type="button" class="btn primary big" data-act="next">Next</button>
        <p class="note${ok ? " good" : ""}">${ok ? "Right." : `Not quite. This question comes back ${when}.`}</p></div>${tombstone(w)}`;
    }
    const skip = !view.checked && item.field === "title" && item.prompt === "image" && view.imgFailed
      ? `<div class="actions"><button type="button" class="btn" data-act="skip">Skip this card</button></div>` : "";
    return `<div class="label-card"><h2 class="q">${QUESTION[item.field]}</h2><div class="opts">${opts}</div>${skip}${after}
      ${view.checked ? "" : `<p class="tip">Press 1–4 to answer.</p>`}</div>`;
  }

  function renderReview() {
    const item = currentItem();
    const w = BY_NUM.get(item.num);
    const doneN = session.total - session.queue.length;
    const retryN = session.queue.filter(id => session.items[id].attempts > 0).length;
    const pct = session.total ? Math.round(100 * doneN / session.total) : 0;
    const cardKey = `${item.id}:${item.attempts}`;
    const isNewCard = cardKey !== lastCardKey;
    lastCardKey = cardKey;

    app.innerHTML = `
      <div class="topbar">
        <button type="button" class="btn small" data-act="exit">Exit</button>
        <div class="progress" aria-label="Progress">
          <div class="bar"><span style="width:${pct}%"></span></div>
          <p>${doneN} of ${session.total} done${retryN ? `, ${retryN} to retry` : ""}</p>
        </div>
      </div>
      <div class="stage">
        <div class="wall">${wallHTML(item, w)}</div>
        <div class="side">${session.mode === "typed" ? typedHTML(item, w) : mcqHTML(item, w)}</div>
      </div>`;

    const img = app.querySelector(".wall .frame img");
    if (img && item.prompt === "image") img.addEventListener("error", onImageError, { once: true });

    if (isNewCard) {
      window.scrollTo(0, 0);
      prefetchNext();
    }
    if (session.mode === "typed") {
      if (!view.checked) {
        const first = pendingFields(item).map(f => document.getElementById("in-" + f)).find(el => el && !el.value) ||
          document.getElementById("in-" + pendingFields(item)[0]);
        if (first && isNewCard && window.matchMedia("(hover: hover)").matches) first.focus();
      } else {
        const nb = app.querySelector('[data-act="next"]');
        if (nb) nb.focus({ preventScroll: true });
      }
    } else if (view.checked) {
      const nb = app.querySelector('[data-act="next"]');
      if (nb) nb.focus({ preventScroll: true });
    }
  }

  function onImageError() {
    const item = currentItem();
    view.imgFailed = true;
    if (session.mode === "typed" && item.fields.includes("title") && !item.done.includes("title")) {
      item.done.push("title"); // the title is now on screen, so it can't be asked
      if (!pendingFields(item).length) { advance(item, true); return; }
    }
    render();
  }

  function prefetchNext() {
    const id = session.queue[1];
    if (id == null) return;
    const w = BY_NUM.get(session.items[id].num);
    if (w && w.image) { const im = new Image(); im.referrerPolicy = "no-referrer"; im.src = w.image; }
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
    const unit = s.mode === "typed" ? "work" : "question";
    const list = [...missed.entries()].sort((a, b) => a[0] - b[0]).map(([num, fs]) => {
      const w = BY_NUM.get(num);
      const th = w.image ? `<img class="thumb" src="${esc(w.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="thumb none">No image</span>`;
      return `<li>${th}<div><div class="t">No. ${num}: ${esc(w.fields.title.answer)}</div><div class="m">Missed ${fs.map(f => LABEL[f].toLowerCase()).join(", ")}</div></div></li>`;
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
      ${missed.size ? `<h2 class="panel-title" style="font:400 22px/1.2 var(--serif);margin:24px 0 12px">Missed at least once</h2><ul class="missed">${list}</ul>` : ""}
      ${s.skipped ? `<p class="help">${plural(s.skipped, "work")} skipped because they don't have any of the identifiers you picked.</p>` : ""}`;
  }

  function renderBrowse() {
    const { nums } = selectedNums();
    const cards = nums.map(n => {
      const w = BY_NUM.get(n);
      const pic = w.image
        ? `<button type="button" class="pic" data-act="zoom" data-src="${esc(w.image)}" aria-label="Enlarge image of ${esc(w.fields.title.answer)}"><img src="${esc(w.image)}" alt="${esc(w.fields.title.answer)}" loading="lazy" referrerpolicy="no-referrer"></button>`
        : `<div class="pic none">No image in the Knowt set</div>`;
      return `<article class="card">${pic}<div class="body"><span class="no">No. ${n}</span>${tombstone(w)}</div></article>`;
    }).join("");
    app.innerHTML = `
      <div class="browse-head">
        <h1>${plural(nums.length, "work")}</h1>
        <div class="btns" style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="btn" data-act="home">Back to setup</button>
          <button type="button" class="btn primary" data-act="start">Start review</button>
        </div>
      </div>
      <div class="cards">${cards}</div>`;
    window.scrollTo(0, 0);
  }

  // ---------- actions ----------
  function start(nums) {
    const s = settings;
    if (!Object.values(s.fields).some(Boolean)) { alertInline("Pick at least one identifier to ask."); return; }
    const sess = buildSession(nums, s);
    if (!sess.total) { alertInline("None of these works have the identifiers you picked. Turn on more identifiers."); return; }
    session = sess;
    view = freshView();
    lastCardKey = null;
    screen = "review";
    saveSession();
    render();
  }

  function alertInline(msg) {
    const el = document.getElementById("count");
    if (el) { el.innerHTML = `${esc(msg)}`; el.style.color = "var(--wrong)"; setTimeout(() => { el.style.color = ""; updateCount(); }, 3500); }
  }

  function checkTyped() {
    const item = currentItem(), w = BY_NUM.get(item.num);
    app.querySelectorAll(".row .in").forEach(el => { view.inputs[el.dataset.f] = el.value; });
    const opts = gradeOpts();
    for (const f of pendingFields(item)) {
      const val = (view.inputs[f] || "").trim();
      const r = val ? G.grade(f, w.fields[f], val, opts) : { correct: false };
      view.results[f] = !!r.correct;
      view.hints[f] = r.hint || "";
    }
    view.checked = true;
    render();
  }

  function nextTyped() {
    const item = currentItem();
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
    if (!ok && !item.missed.includes(item.field)) item.missed.push(item.field);
    if (item.attempts === 1 && ok) session.firstTryRight++;
    advance(item, ok);
  }

  function goNext() {
    if (screen !== "review" || !view.checked) return;
    if (session.mode === "typed") nextTyped(); else nextMcq();
  }

  function openLightbox(src) {
    const img = lightbox.querySelector("img");
    img.referrerPolicy = "no-referrer";
    img.src = src;
    lightbox.hidden = false;
  }
  function closeLightbox() { lightbox.hidden = true; lightbox.querySelector("img").removeAttribute("src"); }
  lightbox.addEventListener("click", closeLightbox);

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
    if (t.dataset.set) {
      settings[t.dataset.set] = t.dataset.val;
      saveSettings();
      const openMore = !!app.querySelector("details.more[open]");
      renderSetup();
      if (openMore) { const d = app.querySelector("details.more"); if (d) d.open = true; }
      return;
    }

    switch (t.dataset.act) {
      case "units-all": settings.units = UNITS.map(u => u.n); saveSettings(); renderSetup(); break;
      case "units-none": settings.units = []; saveSettings(); renderSetup(); break;
      case "start": start(selectedNums().nums); break;
      case "browse": screen = "browse"; render(); break;
      case "home": screen = "setup"; render(); window.scrollTo(0, 0); break;
      case "resume": view = freshView(); lastCardKey = null; screen = "review"; render(); break;
      case "discard": session = null; saveSession(); renderSetup(); break;
      case "show-done": screen = "done"; render(); break;
      case "exit": screen = "setup"; render(); window.scrollTo(0, 0); break;
      case "zoom": openLightbox(t.dataset.src); break;
      case "reveal": view.revealed[t.dataset.f] = !view.revealed[t.dataset.f]; rememberInputs(); render(); break;
      case "override": view.results[t.dataset.f] = true; view.hints[t.dataset.f] = ""; render(); break;
      case "next": goNext(); break;
      case "choose": chooseMcq(parseInt(t.dataset.i, 10)); break;
      case "skip": { const it = currentItem(); it.attempts++; advance(it, true); break; }
      case "again-missed": {
        const nums = [...new Set(session.items.filter(i => i.missed.length).map(i => i.num))].sort((a, b) => a - b);
        const keep = settings; settings = Object.assign({}, session.settings); start(nums); settings = keep; break;
      }
      case "again-all": {
        const nums = [...new Set(session.items.map(i => i.num))].sort((a, b) => a - b);
        const keep = settings; settings = Object.assign({}, session.settings); start(nums); settings = keep; break;
      }
    }
  });

  function rememberInputs() {
    app.querySelectorAll(".row .in").forEach(el => { if (!el.readOnly) view.inputs[el.dataset.f] = el.value; });
  }

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
    if (t.dataset.field) {
      settings.fields[t.dataset.field] = t.checked; saveSettings(); updateCount();
    } else if (t.id === "tol") {
      settings.tol = t.value; saveSettings();
    }
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
    if (!lightbox.hidden) { if (e.key === "Escape") closeLightbox(); return; }
    if (screen !== "review" || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (session.mode === "mcq" && !view.checked && /^[1-4]$/.test(e.key)) {
      e.preventDefault(); chooseMcq(parseInt(e.key, 10) - 1); return;
    }
    const typing = tag === "INPUT" && !document.activeElement.readOnly;
    if (view.checked && (e.key === "Enter" || (e.key === " " && session.mode === "mcq")) && tag !== "BUTTON" && !typing) {
      e.preventDefault(); goNext();
    }
  });

  render();
})();
