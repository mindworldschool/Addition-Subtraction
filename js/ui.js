
// ui.js — глобальные I18N и утилиты рендера
window.I18N = {
  uk:{title:"Додавання та віднімання",settings:"Налаштування",level:"Рівень",
      level_easy:"Легкий (≤10)",level_medium:"Середній (≤100 без переходу)",level_adv:"Просунутий (≤100 з переходом)",
      mode:"Режим відповіді",mode_2:"2 варіанти",mode_3:"3 варіанти",mode_input:"Ввід відповіді",series:"Серія",endless:"Без обмежень",
      start:"Почати",next:"Далі",back:"Налаштування",exit:"Вихід",submit:"Відповісти",total:"Всього",correct:"Вірно",wrong:"Помилки",streak:"Серія",
      right_toast:"Правильно!",wrong_toast:"Спробуй ще раз!"},
  en:{title:"Addition & Subtraction",settings:"Settings",level:"Difficulty",
      level_easy:"Easy (≤10)",level_medium:"Medium (≤100 no carry)",level_adv:"Advanced (≤100 with carry/borrow)",
      mode:"Answer mode",mode_2:"2 options",mode_3:"3 options",mode_input:"Type answer",series:"Series",endless:"Endless",
      start:"Start",next:"Next",back:"Settings",exit:"Exit",submit:"Submit",total:"Total",correct:"Correct",wrong:"Wrong",streak:"Streak",
      right_toast:"Correct!",wrong_toast:"Try again!"},
  ru:{title:"Сложение и вычитание",settings:"Настройки",level:"Уровень сложности",
      level_easy:"Лёгкий (≤10)",level_medium:"Средний (≤100 без перехода)",level_adv:"Продвинутый (≤100 с переходом)",
      mode:"Режим ответа",mode_2:"2 варианта",mode_3:"3 варианта",mode_input:"Ввод ответа",series:"Серия",endless:"Без ограничения",
      start:"Старт",next:"Следующий",back:"Настройки",exit:"Выход",submit:"Ответить",total:"Всего",correct:"Верно",wrong:"Ошибки",streak:"Серия",
      right_toast:"Правильно!",wrong_toast:"Попробуй ещё раз!"},
  es:{title:"Suma y Resta",settings:"Ajustes",level:"Nivel",
      level_easy:"Fácil (≤10)",level_medium:"Medio (≤100 sin llevada)",level_adv:"Avanzado (≤100 con llevada/préstamo)",
      mode:"Modo de respuesta",mode_2:"2 opciones",mode_3:"3 opciones",mode_input:"Escribir respuesta",series:"Serie",endless:"Sin límite",
      start:"Inicio",next:"Siguiente",back:"Ajustes",exit:"Salir",submit:"Responder",total:"Total",correct:"Correcto",wrong:"Errores",streak:"Racha",
      right_toast:"¡Correcto!",wrong_toast:"¡Intenta de nuevo!"}
};
window.applyI18n = function(lang){
  const dict = window.I18N[lang] || window.I18N.uk;
  document.querySelectorAll("[data-i18n]").forEach(el=>{ const k=el.getAttribute("data-i18n"); if(dict[k]) el.textContent=dict[k]; });
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active", b.dataset.lang===lang));
};
window.showToast = function(msg, ok=true){
  const t=document.getElementById("toast"); t.textContent=msg; t.className="toast"+(ok?"":" error");
  requestAnimationFrame(()=>{ t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1200); });
};
window.renderTask = function(task){ document.getElementById("task").textContent = `${task.a} ${task.op} ${task.b} = ?`; };
window.renderOptions = function(options){
  const wrap=document.getElementById("answers"); wrap.innerHTML=""; if(!options) return;
  options.forEach(opt=>{ const b=document.createElement("button"); b.className="answer-btn"; b.textContent=opt.value; b.dataset.correct=opt.correct?"1":"0"; wrap.appendChild(b); });
};
