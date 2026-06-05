/* =====================================================
   BabySteps — DATA LAYER (CUSTOMIZE ME!)
   Edit this file to change tasks, kids, modules, copy.
   Nothing else needs to change.
   ===================================================== */

/* ---------- Design tokens (mirrored from Figma) ---------- */
const TOKENS = {
  c: {
    cream: '#F7EEE5', creamSoft: '#FDF7EE', paper: '#FFFFFF',
    ink: '#12012A', inkSoft: '#495874', inkMute: '#7A8AA8', line: '#0A0517',
    yellow: '#FFF1C1', yellowDeep: '#F5C58C',
    pink: '#F8E5E5', pinkDeep: '#FFB9BA',
    lilac: '#F2CFE8',
    mint: '#E2F4D8', mintDeep: '#C3E4B2', sage: '#9AD17F',
    sky: '#D8EBFF', sky2: '#C7D5F3', lavender: '#A7B2D9',
    rust: '#A36565', rustDeep: '#7E4A4A',
    berry: '#C77FBE', cobalt: '#5A6899', forest: '#5F8B4D',
  },
  f: {
    display: '"Peralta", "Times New Roman", serif',
    friendly: '"Lakki Reddy", "Comic Sans MS", cursive',
    body: '"Courier Prime", "Courier New", monospace',
    fun: '"Kirang Haerang", "Courier Prime", monospace',
  },
};

/* =====================================================
   Task data class — wraps a single task with helpers.
   ===================================================== */
class Task {
  constructor({ id, title, stars = 1, done = false }) {
    this.id = id ?? Task.nextId();
    this.title = title;
    this.stars = Math.max(1, Math.min(3, stars));
    this.done = !!done;
  }
  static _seq = 1000;
  static nextId() { return ++Task._seq; }
  toggle() { this.done = !this.done; return this; }
  toJSON() { return { id: this.id, title: this.title, stars: this.stars, done: this.done }; }
}

/* =====================================================
   Child data class — represents a single kid profile.
   ===================================================== */
class Child {
  constructor({ id, name, age, color, emoji, stars = 0 }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.color = color;
    this.emoji = emoji;
    this.stars = stars;
  }
  addStars(n) { this.stars += n; return this; }
}

/* =====================================================
   TASK BANK — age-appropriate task suggestions (2-7 yrs)
   Add/remove freely. Used by Shuffle and Add-task sheet.
   ===================================================== */
const AGE_TASK_BANK = {
  2: ['Pick up toys', 'Put on shoes', 'Wash hands', 'Drink water', 'Say thank you', 'Find your hat'],
  3: ['Brush teeth', 'Feed the pet', 'Put on pajamas', 'Clear the table', 'Stack books', 'Wave goodbye'],
  4: ['Make the bed', 'Help set table', 'Pick up clothes', 'Sort socks', 'Water plants', 'Hang towel'],
  5: ['Pack school bag', 'Tie shoes (try!)', 'Wash own plate', 'Read 1 page', 'Wipe spills', 'Fold napkin'],
  6: ['Practice writing', 'Sweep floor', 'Sort recycling', 'Make sandwich', 'Set alarm', 'Match shoes'],
  7: ['Make full breakfast', 'Tidy own room', 'Help laundry', 'Walk the pet', 'Spelling drill', 'Pack lunch'],
};

/* =====================================================
   DEFAULT CHILDREN (seed data on first load)
   ===================================================== */
const DEFAULT_CHILDREN = [
  new Child({ id: 'c1', name: 'Mio',   age: 4, color: TOKENS.c.pink,     emoji: '🐰', stars: 24 }),
  new Child({ id: 'c2', name: 'Kayla', age: 6, color: TOKENS.c.sky,      emoji: '🦊', stars: 41 }),
  new Child({ id: 'c3', name: 'Bo',    age: 3, color: TOKENS.c.mint,     emoji: '🐻', stars: 11 }),
];

const DEFAULT_TASKS = {
  c1: [
    new Task({ id: 1, title: 'Brush teeth',  stars: 1, done: true }),
    new Task({ id: 2, title: 'Pick up toys', stars: 2, done: false }),
    new Task({ id: 3, title: 'Water plants', stars: 2, done: false }),
  ],
  c2: [
    new Task({ id: 4, title: 'Pack school bag', stars: 2, done: false }),
    new Task({ id: 5, title: 'Read 1 page',     stars: 3, done: true }),
  ],
  c3: [],
};

/* =====================================================
   SMARTIEZ — learning modules grid on kid POV.
   ===================================================== */
const SMARTIEZ_MODULES = [
  { id: 'a', label: 'ABC',     emoji: '🔤', bg: TOKENS.c.pink },
  { id: 'b', label: '1-2-3',   emoji: '🔢', bg: TOKENS.c.sky },
  { id: 'c', label: 'Colors',  emoji: '🎨', bg: TOKENS.c.mint },
  { id: 'd', label: 'Shapes',  emoji: '🔷', bg: TOKENS.c.lilac },
  { id: 'e', label: 'Animals', emoji: '🦊', bg: TOKENS.c.yellow },
  { id: 'f', label: 'Manners', emoji: '🙏', bg: TOKENS.c.creamSoft },
];

/* =====================================================
   ADVENTURES — surprise daily quests.
   ===================================================== */
const ADVENTURES = [
  'Find 3 round things at home',
  'Spot 5 yellow objects',
  'Hop on one foot 10 times',
  'Make an animal sound for the pet',
  'Draw your favorite snack',
];

/* =====================================================
   COPY — UI strings centralized for easy translation.
   ===================================================== */
const COPY = {
  splash: {
    line1: 'Baby', line2: 'Steps',
    tag: 'Development for All',
    blurb: 'One app, two perspectives. Parents shape the journey. Kids play through it.',
    cta: 'Get Started',
  },
  role: {
    hello: 'hello,',
    title: 'who are you?',
    parent: { label: 'Parent', sub: 'Build tasks. Track growth. Cheer them on.' },
    kid:    { label: 'Kid',    sub: 'Adventure time! Play, learn, earn stars.' },
    footer: 'ages 2 — 7 · works offline',
  },
  login: {
    title: 'Login',
    namePh: 'your name',
    pwPh: 'password',
    bdayPh: 'b-day',
    agePh: 'age',
    childNamePh: 'child name',
    cta: 'Login',
    back: '← change role',
  },
  parent: {
    twoway: 'Two-way',
    todo: 'To-do',
    progress: '— done today',
    tasks: 'Tasks',
    empty: 'No tasks yet. Add or shuffle ↓',
    shuffle: '🎲 Shuffle for',
    add: '+ Add task',
  },
  kid: {
    nextQuest: 'next quest',
    allDone: 'all done!',
    breakLine: 'Take a break, hero',
    quests: 'My quests',
    emptyQuests: 'Ask a grown-up to add quests ✨',
    piffyName: 'Piffy',
    piffyLine: "heya! pick a quest — i'll cheer~",
    advCardEyebrow: 'Ready for an',
    advCardTitle: 'Adventure ?',
    smartCardEyebrow: 'come play with',
    smartCardTitle: 'Smartiez!',
  },
  play: {
    crumb: 'quest in progress',
    yourQuest: 'your quest',
    doing: 'doing it!',
    done: 'Done!',
    ready: "I'm ready!",
    didIt: 'I did it ✓',
    collect: 'Collect',
  },
  reward: {
    title: 'You did it!',
    sub: 'Piffy is so proud~',
    cta: 'Continue',
  },
  adventure: {
    crumb: 'adventures',
    eyebrow: 'Ready for an',
    title: 'Adventure?',
    todayLabel: "Today's adventure",
    begin: 'Begin',
  },
  advmap: {
    crumb: 'your map',
    hint: 'Tap a quest pin to begin ✨',
    allDone: 'All quests done — yay!',
    empty: 'No quests yet. Ask a grown-up to add some.',
    note: 'Today the map shows',
  },
  smartiez: {
    crumb: 'smartiez',
    eyebrow: 'Learn with us~',
    title: 'Smartiez ✫',
  },
  sheet: {
    title: 'New task',
    placeholder: 'e.g. Brush teeth',
    reward: 'Reward',
    quickPicks: 'Quick picks for age',
    cancel: 'Cancel',
    save: 'Save',
  },
};

/* =====================================================
   STORAGE — tiny localStorage wrapper for persistence.
   ===================================================== */
const STORAGE_KEY = 'babysteps.v1';

const Storage = {
  save(state) {
    try {
      const payload = {
        children: state.children.map(c => ({
          id: c.id, name: c.name, age: c.age, color: c.color, emoji: c.emoji, stars: c.stars,
        })),
        tasks: Object.fromEntries(
          Object.entries(state.tasks).map(([k, list]) => [k, list.map(t => t.toJSON())])
        ),
        activeChild: state.activeChild,
        role: state.role,
        userName: state.userName,
        tweaks: state.tweaks,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {}
  },
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        children: (data.children || []).map(c => new Child(c)),
        tasks: Object.fromEntries(
          Object.entries(data.tasks || {}).map(([k, list]) => [k, list.map(t => new Task(t))])
        ),
        activeChild: data.activeChild,
        role: data.role,
        userName: data.userName,
        tweaks: data.tweaks || {},
      };
    } catch (_) { return null; }
  },
  reset() { try { localStorage.removeItem(STORAGE_KEY); } catch (_) {} },
};

/* =====================================================
   Utility — shuffle helpers
   ===================================================== */
function shuffleTasksFor(age) {
  const bank = AGE_TASK_BANK[age] || AGE_TASK_BANK[4];
  const pool = [...bank].sort(() => Math.random() - 0.5).slice(0, 3);
  return pool.map((title, i) => new Task({
    title,
    stars: 1 + (i % 3),
    done: false,
  }));
}

function pickAdventure() {
  return ADVENTURES[Math.floor(Math.random() * ADVENTURES.length)];
}

/* =====================================================
   Tweak defaults
   ===================================================== */
const TWEAK_DEFAULTS = {
  themeBg: 'cream',
  kidView: false,
  accent: TOKENS.c.rust,
  fontScale: 1,
  showMascot: true,
};

const THEME_BG_MAP = {
  cream: '#F7EEE5',
  light: '#FFF9F2',
  mint:  '#EAF5E0',
  sky:   '#EAF3FF',
};

/* expose to window */
Object.assign(window, {
  TOKENS, Task, Child,
  AGE_TASK_BANK, DEFAULT_CHILDREN, DEFAULT_TASKS,
  SMARTIEZ_MODULES, ADVENTURES, COPY,
  Storage, shuffleTasksFor, pickAdventure,
  TWEAK_DEFAULTS, THEME_BG_MAP,
});
