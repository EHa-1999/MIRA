// Verzamelt alle Nederlandse teksten uit de demo (zonder argument), of meldt wat in een taal nog ontbreekt (argument: taalcode).
// Gebruik: node tools/strings.js            -> schrijft i18n/bron.json
//          node tools/strings.js de         -> schrijft i18n/ontbreekt-de.json
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), lang = process.argv[2] || 'nl';
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const pg = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(l => { window.__DUMP = new Set(); window.__MISS = new Set(); try { localStorage.setItem('mira.lang', l) } catch (e) {} }, lang);
  await pg.goto('file://' + path.join(root, 'index.html'));
  await pg.waitForTimeout(400);
  const c = async s => { const e = await pg.$(s); if (e) { try { await e.click({ timeout: 800 }); } catch (x) {} await pg.waitForTimeout(40); } };
  const all = async s => { const n = (await pg.$$(s)).length; for (let i = 0; i < n; i++) { const l = await pg.$$(s); if (l[i]) { try { await l[i].click({ timeout: 800 }); } catch (x) {} await pg.waitForTimeout(30); } } };
  const esc = async () => { await pg.keyboard.press('Escape'); };
  const set = (n, v) => c(`[data-act="set"][data-n="${n}"][data-v="${v}"]`);
  const nav = v => c(`[data-act="nav"][data-v="${v}"]`);
  const tab = t => c(`[data-act="tab"][data-t="${t}"]`);
  const bottom = s => pg.evaluate(q => { const d = document.querySelector(q); if (d) d.scrollTop = d.scrollHeight; }, s);
  const docPass = async t => {
    await tab('ond'); await all('[data-act="open"]'); await all('[data-act="open"]');
    for (const tb of ['meta', 'toeg', 'anon', 'clas', 'waar', 'flow']) {
      await tab(tb); await all('[data-act="wzd"]');
      if (tb === 'clas') for (const a of ['raad', 'team', 'ieder']) await c(`[data-act="actor"][data-v="${a}"]`);
      if (tb === 'anon') { for (const m of ['cursor', 'lijst', 'beeld']) await c(`[data-act="anmode"][data-v="${m}"]`); await bottom('.wd-desk'); await pg.waitForTimeout(450); await all('[data-act="hgo"]'); }
      if (tb === 'toeg') { await all('[data-act="find"]'); }
      if (tb === 'waar') { await c('[data-act="wmcheck"]'); }
    }
    await set('viewer', 'lezer'); await bottom('.wd-desk'); await set('viewer', 'opsteller');
    await tab('help'); await c('[data-act="ctl"]'); await c('[data-act="ctl"]'); await tab('ovz'); await tab('ond');
    await tab('ovz'); await c('[data-act="vast"]'); await esc(); await c('[data-act="send"]'); await esc();
    await c('[data-act="view"][data-v="beo"]'); await c('[data-act="rvshow"][data-v="gelakt"]'); await c('[data-act="rvshow"][data-v="voor"]'); await bottom('#rv-pages'); await pg.waitForTimeout(200); await c('[data-act="view"][data-v="doc"]');
  };
  const deep = async t => {
    await tab('meta'); await c('[data-act="tref"]'); await c('[data-act="save"]'); await all('[data-act="wzd"]');
    await tab('clas'); await c('[data-act="verlaag"]'); await c('[data-act="woo"]');
    await tab('toeg'); for (let i = 0; i < 6; i++) await c('[data-act="accfix"]'); await c('[data-act="accuit"]'); await tab('ovz'); await c('[data-act="vast"]'); await esc(); await c('[data-act="accuit"]');
    await tab('flow'); await c('[data-act="wfdone"]'); await c('[data-act="wfclaim"]'); await c('[data-act="wfrelease"]'); await c('[data-act="wfclaim"]');
    await c('[data-act="srcupd"]'); await tab('ond'); await all('[data-act="open"]'); await all('[data-act="open"]'); await c('[data-act="refresh"]');
    if (t === 'rekenblad') { await tab('waar'); await c('[data-act="wm"]'); await pg.waitForTimeout(1900); await c('[data-act="wmcheck"]'); }
    if (t === 'tekst') { await tab('ond'); await c('[data-act="open"][data-k="kaart"]'); await c('[data-act="ins"][data-m="kopie"]'); await c('[data-act="repair"]'); }
    await c('[data-act="view"][data-v="beo"]'); await c('[data-act="rvdec"][data-v="later"]'); await c('[data-act="rvdec"][data-v="laat"]'); await all('[data-act="rvall"]'); await bottom('#rv-pages'); await pg.waitForTimeout(200); await all('[data-act="rvall"]');
    await c('[data-act="rvlak"]'); await all('[data-act="rcgo"]'); await c('[data-act="view"][data-v="doc"]'); await set('viewer', 'lezer'); await bottom('.wd-desk'); await set('viewer', 'opsteller');
    if (t === 'mail') { await c('[data-act="send"]'); await all('#layer input[type=radio][value=openbaar], #layer input[type=radio][value=zonder]'); await c('#v-go'); await tab('ond'); await all('[data-act="open"]'); await tab('waar'); await c('[data-act="wm"]'); await pg.waitForTimeout(1900); await c('[data-act="wmcheck"]'); await tab('flow'); await set('viewer', 'lezer'); await set('viewer', 'opsteller'); await tab('clas'); await tab('anon'); await c('[data-act="newmail"]'); await set('env', 'web'); await c('[data-act="send"]'); await all('[data-act="open"]'); await c('[data-act="newmail"]'); await set('env', 'ms'); }
    else if (t !== 'rekenblad') { await tab('ovz'); await c('[data-act="vast"]'); await all('#layer input[type=checkbox]'); await c('#layer input[type=radio][value=over]'); await c('#v-go'); await tab('waar'); await c('[data-act="wm"]'); await tab('flow'); await pg.waitForTimeout(1900); await tab('waar'); await c('[data-act="wmcheck"]'); await tab('flow'); await c('[data-act="wfclaim"]'); await c('[data-act="wfdone"]'); await c('[data-act="wfdone"]'); await all('[data-act="open"]'); await tab('clas'); await tab('toeg'); await set('viewer', 'lezer'); await set('viewer', 'opsteller'); await c('[data-act="srcupd"]'); await tab('waar'); await c('[data-act="wmcheck"]'); await c('[data-act="newver"]'); await tab('waar'); await tab('flow'); }
  };
  await c('[data-act="colofon"]'); await esc(); await c('[data-act="hood"]');
  await nav('arch'); for (let i = 0; i < 8; i++) { await c(`[data-act="archh"][data-i="${i}"]`); await c('[data-act="archseg"][data-v="0"]'); await c('[data-act="archseg"][data-v="1"]'); }
  for (let i = 0; i < 3; i++) { await c(`[data-act="wire"][data-i="${i}"]`); await esc(); }
  await nav('tech'); for (const g of ['basis', 'opt', 'markt', 'platform', 'all']) await c(`[data-act="tgsel"][data-v="${g}"]`);
  await nav('groei'); await all('.gfn summary');
  await nav('help'); await all('.faq summary'); await pg.fill('#hq', 'zzzz'); await pg.fill('#hq', '');
  for (const tv of ['nu', 'oud', 'later']) for (const env of ['ms', 'web', 'libre']) for (const t of ['tekst', 'rekenblad', 'presentatie', 'mail']) {
    await nav(t); await set('tv', tv); await set('env', env); await docPass(t);
  }
  for (const env of ['ms', 'web', 'libre']) { await c('[data-act="reset"]'); await set('tv', env === 'libre' ? 'later' : 'nu'); await set('env', env); for (const t of ['tekst', 'presentatie', 'rekenblad', 'mail']) { await nav(t); await deep(t); } for (const t of ['tekst', 'presentatie', 'rekenblad', 'mail']) { await nav(t); await docPass(t); } }
  await set('tv', 'oud'); for (const t of ['tekst', 'presentatie', 'rekenblad', 'mail']) { await nav(t); await c('[data-act="srcupd"]'); await tab('ovz'); await c('[data-act="vast"]'); await c('#v-go'); await c('[data-act="send"]'); await c('[data-act="view"][data-v="beo"]'); await c('[data-act="set"][data-n="tv"]'); await c('[data-act="view"][data-v="doc"]'); await set('tv', 'oud'); }
  await c('[data-act="reset"]'); await set('tv', 'nu'); await set('env', 'ms'); await set('obj', 'enkel'); await c('[data-act="objinfo"]'); await esc(); await set('obj', 'samen'); await c('[data-act="objinfo"]'); await esc(); await set('obj', 'enkel');
  for (const t of ['tekst', 'rekenblad', 'presentatie', 'mail']) { await nav(t); await docPass(t); await c('[data-act="srcupd"]'); await tab('ovz'); await c('[data-act="vast"]'); await esc(); }
  await set('obj', 'samen');
  await c('[data-act="reset"]');
  for (const t of ['tekst', 'rekenblad', 'presentatie', 'mail']) { await nav(t); await tab('anon'); await c('[data-act="ansub"][data-v="bron"]'); for (const v of [0, 1, 2, 3]) await c(`[data-act="brppl"][data-v="${v}"]`); await c('[data-act="brok"]'); await set('viewer', 'lezer'); await set('viewer', 'opsteller'); await tab('ovz'); await tab('anon'); await all('.finding [data-act="brexp"]'); await c('.finding [data-act="brtog"]'); await c('.finding [data-act="brtog"]'); await all('[data-act="broff"]'); await all('.finding [data-act="brexp"]'); await c('[data-act="ansub"][data-v="sig"]'); }
  await nav('tekst'); await tab('anon'); await c('[data-act="ansub"][data-v="bron"]');
  await pg.evaluate(() => { const w = document.createTreeWalker(document.querySelector('.wd-page'), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (n.nodeValue.trim().length > 30 && !n.parentElement.closest('[data-act]')) { const r = document.createRange(); r.setStart(n, 0); r.setEnd(n, 12); const s = getSelection(); s.removeAllRanges(); s.addRange(r); n.parentElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); break; } } });
  await pg.waitForTimeout(150); await c('[data-act="bradd"]'); await all('.finding [data-act="brexp"]'); await c('[data-act="ansub"][data-v="sig"]');
  await nav('rekenblad'); await c('[data-act="sheet"][data-i="1"]'); await tab('anon'); await c('[data-act="psgo"]'); await c('[data-act="psaddcol"]'); await c('[data-act="psreset"]'); await c('[data-act="psmode"][data-v="rec"]'); await c('[data-act="psgo"]'); await c('[data-act="psreset"]'); await c('.psc'); await c('.psc'); await c('[data-act="psmode"][data-v="attr"]'); await tab('ond'); await tab('help'); await c('[data-act="sheet"][data-i="0"]');
  await c('[data-act="reset"]'); await nav('tekst'); for (const i of [2, 3, 4, 5, 6]) await c(`[data-act="set"][data-n="rib"][data-v="t${i}"]`); await set('rib', 'start'); await set('rib', 'oa');
  for (const [tv, env] of [['nu', 'ms'], ['nu', 'web'], ['oud', 'ms']]) { await c('[data-act="reset"]'); await nav('tekst'); await set('tv', tv); await set('env', env); await c('.qsave');
    for (const id of ['pc', 'dm', 'di', 'lw', 'dp', 'p1', 'p2', 'dw', 'vg', 'po']) await c(`.svt[data-id="${id}"]`); await c('.svt[data-id="pc"]'); await c('[data-act="svsave"]'); await c('.svt[data-id="dp"]'); await c('.svt[data-id="p2"]'); await c('[data-act="svsave"]'); await c('[data-act="dlgx"]');
    for (const id of ['dm', 'lw', 'p1', 'zp']) { await c('.qsave'); await c('.svt[data-id="dp"]'); await c('.svt[data-id="di"]'); await c(`.svt[data-id="${id}"]`); await c('[data-act="svsave"]'); await pg.waitForTimeout(100); } }
  await c('[data-act="reset"]'); await set('tv', 'nu'); await set('env', 'ms'); for (const t of ['rekenblad', 'presentatie']) { await nav(t); await c('.qsave'); await esc(); }
  await c('[data-act="reset"]'); for (const t of ['tekst', 'mail', 'rekenblad']) { await nav(t); await tab('waar'); for (const by of ['auteur', 'afd', 'org']) { await c(`[data-act="wmby"][data-v="${by}"]`); } await c('[data-act="wmby"][data-v="auteur"]'); await c('[data-act="wm"]'); await pg.waitForTimeout(1900); await c('[data-act="wmcheck"]');
    if (t === 'tekst') { await tab('ovz'); await c('[data-act="vast"]'); await all('#layer input[type=checkbox]'); await c('#layer input[type=radio][value=over]'); await c('#v-go'); await tab('waar'); await c('[data-act="wmby"][data-v="afd"]'); await c('[data-act="wm"]'); await pg.waitForTimeout(1900); await tab('ovz'); await c('[data-act="newver"]'); await tab('waar'); await c('[data-act="wmby"][data-v="org"]'); await c('[data-act="wm"]'); await pg.waitForTimeout(1900); } }
  const out = await pg.evaluate(l => Array.from(l === 'nl' ? window.__DUMP : window.__MISS).sort((a, b) => a.localeCompare(b, 'nl')), lang);
  const file = path.join(root, 'i18n', lang === 'nl' ? 'bron.json' : `ontbreekt-${lang}.json`);
  fs.writeFileSync(file, JSON.stringify(out, null, 1));
  console.log(lang, out.length, 'teksten ->', path.relative(root, file), errs.length ? '\nFOUTEN:\n' + [...new Set(errs)].join('\n') : '· geen scriptfouten');
  await b.close();
})();
