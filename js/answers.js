
const Answers = (() => {
  function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }
  function typicalCarryMistake(task){
    if (task.op === "+") {
      const u = (task.a % 10) + (task.b % 10);
      const t = Math.floor(task.a/10) + Math.floor(task.b/10);
      return t*10 + (u % 10);
    } else {
      const u1 = task.a % 10, u2 = task.b % 10;
      const t1 = Math.floor(task.a/10), t2 = Math.floor(task.b/10);
      let u = u1 - u2; if (u < 0) u = Math.abs(u);
      return (t1 - t2)*10 + u;
    }
  }
  function makeOptions(task, mode){
    if (mode === "input") return null;
    const right = task.answer; const opts = new Set([right]);
    [1,-1,2,-2].forEach(d=>{ if(opts.size<Number(mode)) opts.add(right+d); });
    if (opts.size < Number(mode)) opts.add(typicalCarryMistake(task));
    while (opts.size < Number(mode)) { const jitter = (Math.random()<0.5?-1:1)*(1+Math.floor(Math.random()*3)); opts.add(right+jitter); }
    return shuffle([...opts]).slice(0, Number(mode)).map(v=>({value:v, correct:v===right}));
  }
  return { makeOptions };
})();
