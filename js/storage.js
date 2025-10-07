
window.Storage = (function(){
  const KEY="mws-math-trainer";
  function saveSettings(s){ const d=JSON.parse(localStorage.getItem(KEY)||"{}"); d.settings=s; localStorage.setItem(KEY,JSON.stringify(d)); }
  function loadSettings(){ const d=JSON.parse(localStorage.getItem(KEY)||"{}"); return d.settings||null; }
  function logResult(entry){ const d=JSON.parse(localStorage.getItem(KEY)||"{}"); d.log=d.log||[]; d.log.push({...entry,ts:Date.now()}); localStorage.setItem(KEY,JSON.stringify(d)); }
  function exportJSON(){ const d=JSON.parse(localStorage.getItem(KEY)||"{}"); return JSON.stringify(d,null,2); }
  return { saveSettings, loadSettings, logResult, exportJSON };
})();
