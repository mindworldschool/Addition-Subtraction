// main.js (fixed version)

// Audio setup with unlock mechanism
const sfx = { 
  click: new Audio('assets/sfx/click.wav'), 
  success: new Audio('assets/sfx/success.wav'), 
  error: new Audio('assets/sfx/error.wav')
};

Object.values(sfx).forEach(a => {
  a.preload = 'auto'; 
  a.volume = 0.7;
});

const unlockAudio = () => {
  try {
    Object.values(sfx).forEach(a => {
      a.play().then(() => a.pause()).catch(() => {});
    });
  } catch(e) {}
  document.removeEventListener('pointerdown', unlockAudio);
  document.removeEventListener('click', unlockAudio);
};

document.addEventListener('pointerdown', unlockAudio, {once: true});
document.addEventListener('click', unlockAudio, {once: true});

// Game state
const state = { 
  lang: 'uk', 
  level: 'easy', 
  mode: '2', 
  series: 10, 
  total: 0, 
  correct: 0, 
  wrong: 0, 
  streak: 0, 
  current: null 
};

// Update statistics display
function updateStats() { 
  document.getElementById("stat-total").textContent = state.total;
  document.getElementById("stat-correct").textContent = state.correct;
  document.getElementById("stat-wrong").textContent = state.wrong;
  document.getElementById("stat-streak").textContent = state.streak;
}

// Switch between settings and game panels
function switchPanel(game) { 
  document.getElementById("panel-settings").hidden = game;
  document.getElementById("panel-game").hidden = !game;
}

// Generate and display next task
function nextTask() {
  const task = Generator.generateTask(state.level);
  state.current = task;
  renderTask(task);
  
  // Task animation
  const tEl = document.getElementById('task');
  tEl.classList.remove('task-anim');
  void tEl.offsetWidth; // Force reflow
  tEl.classList.add('task-anim');
  
  // Generate answer options
  const opts = Answers.makeOptions(task, state.mode);
  
  if (state.mode !== 'input') {
    if (opts && opts.length > 0) {
      renderOptions(opts);
    } else {
      // Fallback: generate simple options if Answers.makeOptions failed
      const right = task.answer;
      const need = Number(state.mode) || 2;
      const set = new Set([right]);
      const deltas = [1, -1, 2, -2, 3, -3, 5, -5];
      
      for (const d of deltas) { 
        if (set.size >= need) break;
        set.add(right + d);
      }
      
      const arr = Array.from(set).slice(0, need).map(v => ({
        value: v, 
        correct: v === right
      }));
      
      renderOptions(arr);
    }
  }
  
  // Show/hide input mode
  document.getElementById("inputWrap").hidden = state.mode !== 'input';
  document.getElementById('answers').style.display = (state.mode === 'input') ? 'none' : 'flex';
  
  if (state.mode === 'input') { 
    const input = document.getElementById("answerInput");
    input.value = '';
    input.focus();
  }
}

// Start game with selected settings
function onStart() {
  state.level = document.getElementById("level").value;
  state.mode = document.getElementById("mode").value;
  state.series = Number(document.getElementById("series").value);
  
  Storage.saveSettings({
    level: state.level, 
    mode: state.mode, 
    series: state.series, 
    lang: state.lang
  });
  
  state.total = 0;
  state.correct = 0;
  state.wrong = 0;
  state.streak = 0;
  
  updateStats();
  switchPanel(true);
  nextTask();
}

// Check if series is finished
function finishIfNeeded() {
  if (state.series && state.total >= state.series) {
    switchPanel(false);
    showToast('✔️ ' + (I18N[state.lang].total || 'Total') + ': ' + state.total, true);
    return true;
  }
  return false;
}

// Handle user answer
function handleAnswer(isCorrect, value) {
  // Visual feedback on board
  try {
    const board = document.querySelector('.board');
    if (board) {
      board.classList.remove('correct', 'wrong');
      board.classList.add(isCorrect ? 'correct' : 'wrong');
      setTimeout(() => board.classList.remove('correct', 'wrong'), 300);
    }
  } catch(e) {}
  
  state.total++;
  
  if (isCorrect) {
    state.correct++;
    state.streak++;
    Storage.logResult({ok: true, task: state.current, value});
    
    try { 
      sfx.success.currentTime = 0;
      sfx.success.play();
    } catch(e) {}
    
    showToast(I18N[state.lang].right_toast, true);
  } else {
    state.wrong++;
    state.streak = 0;
    Storage.logResult({ok: false, task: state.current, value});
    
    try { 
      sfx.error.currentTime = 0;
      sfx.error.play();
    } catch(e) {}
    
    showToast(I18N[state.lang].wrong_toast, false);
  }
  
  updateStats();
  
  if (!finishIfNeeded()) {
    nextTask();
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  // Enable start button
  const bs = document.getElementById('btn-start');
  if (bs) {
    bs.disabled = false;
    bs.removeAttribute('disabled');
  }
  
  // Load saved settings
  const saved = Storage.loadSettings();
  if (saved?.lang) {
    state.lang = saved.lang;
  }
  applyI18n(state.lang);
  
  // Language switcher
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.addEventListener('click', () => {
      state.lang = b.dataset.lang;
      applyI18n(state.lang);
      Storage.saveSettings({
        level: state.level, 
        mode: state.mode, 
        series: state.series, 
        lang: state.lang
      });
    });
  });
  
  // Restore saved settings
  if (saved) {
    document.getElementById("level").value = saved.level || 'easy';
    document.getElementById("mode").value = saved.mode || '2';
    document.getElementById("series").value = String(saved.series ?? 10);
  }
  
  // Event listeners
  document.getElementById("btn-start").addEventListener('click', () => {
    sfx.click.currentTime = 0;
    sfx.click.play();
    onStart();
  });
  
  document.getElementById("btn-settings").addEventListener('click', () => {
    sfx.click.currentTime = 0;
    sfx.click.play();
    switchPanel(false);
  });
  
  document.getElementById("btn-next").addEventListener('click', () => {
    sfx.click.currentTime = 0;
    sfx.click.play();
    nextTask();
  });
  
  // Answer buttons click
  document.getElementById("answers").addEventListener('click', (e) => {
    const btn = e.target.closest('.answer-btn');
    if (!btn) return;
    handleAnswer(btn.dataset.correct === '1', Number(btn.textContent));
  });
  
  // Submit input answer
  document.getElementById("btn-submit").addEventListener('click', () => {
    const val = Number(document.getElementById("answerInput").value);
    handleAnswer(val === state.current.answer, val);
  });
  
  // Enter key in input mode
  document.getElementById("answerInput").addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('btn-submit').click();
    }
  });
  
  // Keyboard shortcuts for answer buttons (1, 2, 3)
  document.addEventListener('keydown', (e) => {
    if (document.getElementById("panel-game").hidden) return;
    if (state.mode !== 'input') {
      const n = Number(state.mode);
      const idx = ['1', '2', '3'].indexOf(e.key);
      if (idx >= 0 && idx < n) {
        const btn = document.querySelectorAll('#answers .answer-btn')[idx];
        if (btn) btn.click();
      }
    }
  });
});