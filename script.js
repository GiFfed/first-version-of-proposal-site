// ---------- Этапы ----------
// answers: допустимые ответы (регистр, пробелы и дефисы не важны, Ё = Е)
// hints: лесенка подсказок, от мягкой к прямой
// Тексты в [скобках] и ответы-заглушки замени на свои
const stages = [
  { // 1. Вход. Текст берётся из index.html, здесь только проверка
    answers: ["код1"],
    hints: ["[подсказка к входу]"],
  },
  { // 2. Ума
    riddle: ["Доступ разрешён.", "Следующий канал защищён именем.", "Код носит хвост.", "В имени есть 3 буквы"],
    answers: ["21-14-1", "20-13-1"], // с Ё и без Ё
    hints: [
      "Буквы имени можно заменить числами.",
      "А=1, Б=2, В=3… Цифры можно писать через дефис.",
    ],
  },
  { // 3. Ксеноморфы или кино
    riddle: [
    "Канал защищён биологическим замком.",
    "Я выхожу из яйца и ищу лицо.",
    "Я не злой. Я просто очень хочу обнимашек.",
    ],
    answers: ["лицехват", "фейсхаггер", "facehugger"],
    hints: [
    "Это первая стадия после яйца.",
    "Название можно перевести дословно: лицо плюс обнимать.",
  ],
  },
  { // 4. Музыка или файтинг
    riddle: [
    "Канал защищён музыкальным ключом.",
    "Три трека, которые ты мне скинула.",
    "Первые буквы названий, в порядке отправки.",
    "Возможно, я имею ввиду один его трэк..."
  ],
    answers: ["asw", "saw"],
    hints: [
    "Alibi, Smoke & Mirrors, What You Sow.",
    "Возьми по первой букве от каждого названия.",
    "Если буквы не складываются в слово, переставь их.",
  ],
  },
  { // 5. Личное для вас двоих
    riddle: [
    "Зафиксировано непонятное поведение: кто-то построил целый квест.",
    "Вы оба знаете, как называют таких людей.",
  ],
    answers: ["фанатик", "культист", "фанатик культа сверхинтеллекта", "ежик в тумане", "золотанов", "серафим"],
    hints: [
    "Это про культ.",
    "Подумай про апостолов: Claude, ChatGPT, Astra6, DeepSeek и Gemini.",
    "Тех, кто делает непонятное ради идеи, вы называете...",
  ],
  },
  { // 6. Аститька
    riddle: ["Последний замок.", "Код носит хвост. Но это другой хвост."],
    answers: ["1-19-20-10-20-30-12-1", "1-18-19-9-19-29-11-1"], // с Ё и без Ё
    hints: [
      "Тот же приём, что и раньше.",
      "Имя второй кошки, буква за буквой, числами.",
    ],
  },
];

// ---------- Элементы ----------
const gate = document.getElementById("gate");
const log = gate.querySelector(".log");
const statusEl = gate.querySelector(".status");
const form = gate.querySelector(".prompt");
const input = document.getElementById("code");
const button = form.querySelector("button");
const hint = gate.querySelector(".hint");
const hintText = hint.querySelector("p");

let current = 0;
let wrong = 0;
let busy = false;

// ---------- Помощники ----------
const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[\s\-–—.,_]+/g, "");

const isCorrect = (stage, value) => stage.answers.map(norm).includes(norm(value));

const setLog = lines => {
  log.replaceChildren();
  lines.forEach((text, i) => {
    const p = document.createElement("p");
    p.style.setProperty("--i", i);
    p.textContent = text;
    log.append(p);
  });
};

const updateHint = () => {
  const hints = stages[current].hints;
  hintText.textContent = hints[Math.min(wrong, hints.length - 1)];
};

const flash = (cls, ms) => {
  gate.classList.add(cls);
  setTimeout(() => gate.classList.remove(cls), ms);
};

// ---------- Переходы ----------
const nextStage = () => {
  current += 1;
  wrong = 0;

  if (current >= stages.length) {
    location.hash = "final";
    return;
  }

  setLog(stages[current].riddle);
  statusEl.textContent = `Расшифровано: ${current} из ${stages.length}`;
  hint.open = false;
  updateHint();
  input.value = "";
  busy = false;
  input.focus();
};

// ---------- Ввод ----------
form.addEventListener("submit", e => {
  e.preventDefault();
  if (busy || !input.value.trim()) return;
  const eggs = [
  {
    triggers: ["cradles", "крэдлс", "крейдлс", "крэйдлс"],
    reply: "Я помню, что он его ненавидит. Я всё помню, но сейчас не про него.",
  },
];
// (объяви eggs выше, рядом с stages)

const egg = eggs.find(t => t.triggers.map(norm).includes(norm(input.value)));
if (egg) {
  const note = document.createElement("p");
  note.textContent = egg.reply;
  note.style.setProperty("--i", 0);
  log.querySelector(".log__error")?.remove();
  note.className = "log__error";
  log.append(note);
  input.value = "";
  return;
}

  if (isCorrect(stages[current], input.value)) {
    busy = true;
    flash("is-correct", 900);
    setTimeout(nextStage, 1000);
  } else {
    wrong += 1;
    flash("is-wrong", 450);
    updateHint();
    const note = document.createElement("p");
    note.textContent = "Код не принят. Попробуй ещё раз.";
    note.style.setProperty("--i", 0);
    log.querySelector(".log__error")?.remove();
    note.className = "log__error";
    log.append(note);
  }
});

updateHint();
