/* =====================================================
   BabySteps — APP ORCHESTRATOR
   Owns state, routing, tweaks panel and DOM mounting.
   ===================================================== */

const App = {
  // ── State ────────────────────────────────────────────
  route: 'splash',
  role: null,
  userName: '',
  children: [],
  activeChild: null,
  tasks: {},
  playingTaskId: null,
  rewardStars: 0,
  addOpen: false,
  currentAdventure: null,

  tweaks: { ...TWEAK_DEFAULTS },

  // Cached current screen + cleanup hook
  _currentScreen: null,
  _activeSheet: null,

  // ── Init ─────────────────────────────────────────────
  init() {
    this.hydrate();
    this.applyTweaks();
    this.bindTweaksPanel();
    this.render();
  },

  hydrate() {
    const saved = Storage.load();
    if (saved && saved.children?.length) {
      this.children = saved.children;
      this.tasks = saved.tasks;
      this.activeChild = saved.activeChild || this.children[0].id;
      this.role = saved.role || null;
      this.userName = saved.userName || '';
      this.tweaks = { ...TWEAK_DEFAULTS, ...(saved.tweaks || {}) };
    } else {
      this.children = [...DEFAULT_CHILDREN];
      this.tasks = { ...DEFAULT_TASKS };
      this.activeChild = 'c1';
    }
  },

  save() {
    Storage.save({
      children: this.children,
      tasks: this.tasks,
      activeChild: this.activeChild,
      role: this.role,
      userName: this.userName,
      tweaks: this.tweaks,
    });
  },

  // ── Routing ──────────────────────────────────────────
  go(route) {
    // cleanup hook on previous screen
    if (this._currentScreen && typeof this._currentScreen._cleanup === 'function') {
      try { this._currentScreen._cleanup(); } catch (_) {}
    }
    this.route = route;
    this.addOpen = false; // silent reset; render() will rebuild
    this._activeSheet = null;
    this.render();
  },

  // ── Selectors ────────────────────────────────────────
  activeChildObj() { return this.children.find(c => c.id === this.activeChild); },

  // ── Auth-ish ─────────────────────────────────────────
  startLogin(role) { this.role = role; this.go('login'); },
  finishLogin(role, name) {
    this.role = role; this.userName = name;
    this.save();
    this.go(role === 'parent' ? 'parent' : 'kid');
  },
  logout() {
    this.role = null; this.userName = '';
    this.save();
    this.go('role');
  },

  // ── Tasks ────────────────────────────────────────────
  toggleTask(id) {
    const list = this.tasks[this.activeChild] || [];
    const t = list.find(x => x.id === id);
    if (t) t.toggle();
    this.save();
    this.render();
  },
  deleteTask(id) {
    this.tasks[this.activeChild] = (this.tasks[this.activeChild] || []).filter(x => x.id !== id);
    this.save();
    this.render();
  },
  addTask(task) {
    if (!this.tasks[this.activeChild]) this.tasks[this.activeChild] = [];
    this.tasks[this.activeChild].push(task);
    this.save();
    this.render();
  },
  shuffleTasks() {
    const child = this.activeChildObj();
    if (!child) return;
    this.tasks[this.activeChild] = shuffleTasksFor(child.age);
    this.save();
    this.render();
  },

  // ── Kid play flow ────────────────────────────────────
  playTask(taskId) {
    this.playingTaskId = taskId;
    this.go('task');
  },
  completeTask(taskId, stars) {
    const list = this.tasks[this.activeChild] || [];
    const t = list.find(x => x.id === taskId);
    if (t) t.done = true;
    const child = this.activeChildObj();
    if (child) child.addStars(stars);
    this.rewardStars = stars;
    this.save();
    this.go('reward');
  },

  // ── Add sheet ────────────────────────────────────────
  openAddSheet() { this.addOpen = true; this.render(); },
  closeAddSheet() {
    if (!this.addOpen) return;
    this.addOpen = false;
    if (this._activeSheet?.parentElement) this._activeSheet.parentElement.removeChild(this._activeSheet);
    this._activeSheet = null;
    this.render();
  },

  // ── Tweaks ───────────────────────────────────────────
  setTweak(key, val) {
    this.tweaks[key] = val;
    this.applyTweaks();
    this.save();

    if (key === 'kidView' && val) {
      // Jump to kid POV with first kid
      const k = this.children[0];
      this.role = 'kid';
      this.userName = k?.name || 'Buddy';
      this.activeChild = k?.id || this.activeChild;
      this.go('kid');
    } else {
      this.render();
    }
  },

  applyTweaks() {
    const root = document.documentElement;
    root.style.setProperty('--c-bg', THEME_BG_MAP[this.tweaks.themeBg] || THEME_BG_MAP.cream);
    root.style.setProperty('--c-accent', this.tweaks.accent || TOKENS.c.rust);
    document.querySelector('.device-wrap').style.fontSize = `${this.tweaks.fontScale * 100}%`;

    // sync panel UI
    const set = (sel, fn) => { const el = document.querySelector(sel); if (el) fn(el); };
    set('#tw-kidview', el => el.checked = !!this.tweaks.kidView);
    set('#tw-mascot', el => el.checked = !!this.tweaks.showMascot);
    set('#tw-fontscale', el => el.value = this.tweaks.fontScale);
    set('#tw-fontscale-val', el => el.textContent = `${this.tweaks.fontScale.toFixed(2)}×`);
    document.querySelectorAll('.tw-radio[data-key="themeBg"] button')
      .forEach(b => b.classList.toggle('active', b.dataset.val === this.tweaks.themeBg));
    document.querySelectorAll('.tw-colors[data-key="accent"] button')
      .forEach(b => b.classList.toggle('active', b.dataset.val.toLowerCase() === (this.tweaks.accent || '').toLowerCase()));
  },

  bindTweaksPanel() {
    const panel = document.getElementById('tweaks-panel');
    const toggle = document.getElementById('tweaks-toggle');
    toggle.addEventListener('click', () => panel.classList.toggle('open'));

    document.getElementById('tw-kidview').addEventListener('change', (e) =>
      this.setTweak('kidView', e.target.checked));
    document.getElementById('tw-mascot').addEventListener('change', (e) =>
      this.setTweak('showMascot', e.target.checked));
    document.getElementById('tw-fontscale').addEventListener('input', (e) =>
      this.setTweak('fontScale', parseFloat(e.target.value)));

    document.querySelectorAll('.tw-radio[data-key="themeBg"] button').forEach(b =>
      b.addEventListener('click', () => this.setTweak('themeBg', b.dataset.val)));
    document.querySelectorAll('.tw-colors[data-key="accent"] button').forEach(b =>
      b.addEventListener('click', () => this.setTweak('accent', b.dataset.val)));

    document.getElementById('tw-reset').addEventListener('click', () => {
      if (!confirm('Reset all BabySteps data?')) return;
      Storage.reset();
      this.children = [...DEFAULT_CHILDREN];
      this.tasks = { ...DEFAULT_TASKS };
      this.activeChild = 'c1';
      this.role = null;
      this.userName = '';
      this.tweaks = { ...TWEAK_DEFAULTS };
      this.applyTweaks();
      this.go('splash');
    });
  },

  // ── Render ───────────────────────────────────────────
  render() {
    const screen = document.getElementById('screen');
    const chip = document.getElementById('route-chip');
    if (!screen) return;

    // remove existing
    screen.innerHTML = '';

    let el = null;
    switch (this.route) {
      case 'splash': el = renderSplash(this); break;
      case 'role':   el = renderRole(this); break;
      case 'login':  el = renderLogin(this); break;
      case 'parent': el = renderParentHome(this); break;
      case 'kid':    el = renderKidHome(this); break;
      case 'task':   el = renderTaskPlay(this); break;
      case 'reward': el = renderReward(this); break;
      case 'adv':    el = renderAdventure(this); break;
      case 'smart':  el = renderSmartiez(this); break;
      default:       el = renderSplash(this);
    }
    this._currentScreen = el;
    screen.appendChild(el);

    // Add sheet overlay (parent only)
    if (this.addOpen && this.route === 'parent') {
      this._activeSheet = renderAddSheet(this);
      screen.appendChild(this._activeSheet);
    }

    // Route chip
    if (chip) chip.textContent = routeLabel(this.route);

    // Update lab-header dot color to match accent
    const dot = document.querySelector('.lab-header .dot');
    if (dot) {
      dot.style.background = this.tweaks.accent;
      dot.style.boxShadow = `0 0 12px ${this.tweaks.accent}`;
    }
  },
};

function routeLabel(r) {
  return ({
    splash: 'splash',
    role: 'role select',
    login: 'login',
    parent: 'parent · home',
    kid: 'kid · home',
    task: 'kid · task',
    reward: 'kid · reward',
    adv: 'kid · adventure',
    smart: 'kid · smartiez',
  })[r] || r;
}

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
