/* =====================================================
   BabySteps — SCREEN RENDERERS
   Each renderXxx(app) returns a DOM element representing
   the full screen. `app` is the global App orchestrator.
   ===================================================== */

const C = window.COPY;

/* =====================================================
   1. Splash
   ===================================================== */
function renderSplash(app) {
  return h('div', { class: 'screen scr-splash' }, [
    BgPattern(),
    h('div', { class: 'deco', style: { top: '-30px', right: '-30px' } }, [Star({ size: 140, rotate: -12 })]),
    h('div', { class: 'deco', style: { top: '120px', left: '-10px' } }, [Star({ size: 90, rotate: 18, color: T.c.pink })]),
    h('div', { class: 'deco', style: { bottom: '180px', right: '30px' } }, [Star({ size: 60, rotate: 6, color: T.c.mintDeep })]),

    h('div', { class: 'title-block' }, [
      h('h1', {}, [
        C.splash.line1, h('br'), C.splash.line2, h('span', { class: 'colon' }, [':']),
      ]),
      h('h2', {}, [C.splash.tag]),
      h('p', {}, [C.splash.blurb]),
    ]),

    PrimaryButton({ text: C.splash.cta, onClick: () => app.go('role'), style: { marginTop: '32px' } }),

    app.tweaks.showMascot
      ? h('div', { class: 'deco', style: { bottom: '50px', left: '30px' } }, [Piffy({ size: 70 })])
      : null,
  ]);
}

/* =====================================================
   2. Role select
   ===================================================== */
function renderRole(app) {
  return h('div', { class: 'screen scr-role' }, [
    BgPattern(),
    h('div', { class: 'deco', style: { top: '80px', right: '-20px' } }, [Star({ size: 120, rotate: -8 })]),
    h('div', { class: 'deco', style: { top: '180px', left: '24px' } }, [Star({ size: 70, rotate: 14, color: T.c.lilac })]),

    h('div', { class: 'greeting screen-inner', style: { marginTop: '30px' } }, [
      h('h2', {}, [C.role.hello]),
      h('h1', {}, [C.role.title]),
    ]),

    h('div', { class: 'role-list' }, [
      renderRoleCard({
        label: C.role.parent.label, sub: C.role.parent.sub,
        bg: T.c.lilac, icon: '👤', onClick: () => app.startLogin('parent'),
      }),
      renderRoleCard({
        label: C.role.kid.label, sub: C.role.kid.sub,
        bg: T.c.mintDeep, icon: '🐾', onClick: () => app.startLogin('kid'),
      }),
    ]),

    h('p', { class: 'footer' }, [C.role.footer]),
  ]);
}

function renderRoleCard({ label, sub, bg, icon, onClick }) {
  return h('button', { class: 'role-card', style: { background: bg }, onClick }, [
    h('div', { class: 'avatar' }, [icon]),
    h('div', { class: 'info' }, [
      h('div', { class: 'label' }, [label]),
      h('div', { class: 'sub' }, [sub]),
    ]),
    h('span', { class: 'chev' }, ['›']),
  ]);
}

/* =====================================================
   3. Login
   ===================================================== */
function renderLogin(app) {
  const isKid = app.role === 'kid';
  const accent = isKid ? T.c.berry : T.c.rust;
  const tagBg = isKid ? T.c.mint : T.c.pink;
  const blobBg = isKid ? T.c.lilac : T.c.paper;

  const nameInput = PillInput({
    placeholder: C.login.namePh,
    iconSvg: svgIcon('<circle cx="10" cy="6" r="4" fill="currentColor"/><path d="M2 18c0-4 4-7 8-7s8 3 8 7" fill="currentColor"/>'),
  });
  const pwInput = PillInput({
    placeholder: C.login.pwPh, type: 'password',
    iconSvg: svgIcon('<rect x="3" y="9" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 9V6a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2"/>'),
  });

  const row2 = isKid
    ? h('div', { class: 'row-2' }, [
        PillInput({ placeholder: C.login.bdayPh,
          iconSvg: svgIcon('<rect x="3" y="5" width="14" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 8h14M7 3v4M13 3v4" fill="none" stroke="currentColor" stroke-width="2"/>') }),
        PillInput({ placeholder: C.login.agePh }),
      ])
    : h('div', { class: 'row-2' }, [
        PillInput({ placeholder: C.login.childNamePh }),
        PillInput({ placeholder: C.login.agePh }),
      ]);

  const submit = () => {
    const name = nameInput._input.value.trim();
    app.finishLogin(app.role, name || (isKid ? 'Buddy' : 'Parent'));
  };

  return h('div', { class: 'screen scr-login' }, [
    BgPattern(),

    h('div', { class: 'login-head' }, [
      h('div', { class: 'blob', style: { background: blobBg } }),
      h('div', { class: 'login-emoji' }, [isKid ? '🦊' : '👋']),
    ]),

    h('div', { class: 'login-card' }, [
      h('div', { style: { textAlign: 'center', marginBottom: '8px' } }, [
        h('h1', {}, [C.login.title]),
        h('div', { class: 'role-tag', style: { background: tagBg, display: 'inline-block' } }, [
          isKid ? 'Kid' : 'Parent',
        ]),
      ]),
      nameInput,
      pwInput,
      row2,
      h('div', { style: { flex: 1 } }),
      PrimaryButton({
        text: C.login.cta, color: accent, onClick: submit,
        style: { alignSelf: 'center', marginTop: '8px' },
      }),
      h('button', { class: 'change-role', onClick: () => app.go('role') }, [C.login.back]),
    ]),
  ]);
}

/* =====================================================
   4. Parent home
   ===================================================== */
function renderParentHome(app) {
  const child = app.activeChildObj() || app.children[0];
  const childTasks = app.tasks[app.activeChild] || [];
  const done = childTasks.filter(t => t.done).length;
  const total = childTasks.length;

  // Parent header
  const header = h('div', { class: 'parent-header' }, [
    h('div', { class: 'user-pill' }, [
      h('div', { class: 'av' }, [(app.userName || 'P')[0].toUpperCase()]),
      h('span', { class: 'name' }, [app.userName || 'Parent']),
    ]),
    IconBtn({ icon: Icons.menu(), onClick: () => app.logout() }),
  ]);

  // Child selector
  const selector = renderChildSelector(app);

  // Hero card
  const hero = h('div', { style: { padding: '0 0' } }, [
    h('div', { class: 'hero-card' }, [
      h('div', { class: 'h-eyebrow' }, [C.parent.twoway]),
      h('div', { class: 'h-title' }, [C.parent.todo]),
      h('div', { class: 'h-sub' }, [`${child?.name || 'your kid'} — ${done}/${total} done today`]),
      h('div', { class: 'progress' }, [
        h('div', { style: { width: total ? `${(done / total) * 100}%` : '0%' } }),
      ]),
      h('div', { class: 'hero-star' }, [Star({ size: 80, rotate: 20, color: T.c.yellow })]),
    ]),
  ]);

  // Tasks block
  const list = h('div', { class: 'task-list' }, []);
  if (childTasks.length === 0) {
    list.appendChild(h('div', { class: 'task-empty' }, [C.parent.empty]));
  } else {
    childTasks.forEach(t => list.appendChild(renderTaskRow(t, app)));
  }

  const tasksBlock = h('div', { class: 'tasks-block' }, [
    h('div', { class: 'head' }, [
      h('h2', {}, ['Tasks']),
      h('span', { class: 'age' }, [`age ${child?.age || ''}`]),
    ]),
    list,
  ]);

  const actions = h('div', { class: 'actions' }, [
    SoftButton({
      text: `${C.parent.shuffle} ${child?.age || 4}`,
      color: T.c.yellow,
      onClick: () => app.shuffleTasks(),
    }),
    SoftButton({
      text: C.parent.add,
      color: T.c.mint,
      onClick: () => app.openAddSheet(),
    }),
  ]);

  return h('div', { class: 'screen' }, [
    BgPattern(),
    h('div', { class: 'screen-inner' }, [header, selector, hero, tasksBlock, actions]),
  ]);
}

function renderChildSelector(app) {
  const row = h('div', { class: 'row' }, []);
  app.children.forEach(c => {
    const on = c.id === app.activeChild;
    row.appendChild(h('button', {
      class: `child-chip${on ? ' active' : ''}`,
      onClick: () => { app.activeChild = c.id; app.save(); app.render(); },
    }, [
      h('div', { class: 'av', style: { background: c.color } }, [c.emoji]),
      h('span', { class: 'lbl' }, [c.name]),
    ]));
  });
  row.appendChild(h('button', {
    class: 'child-add',
    onClick: () => {
      const name = prompt('New child name?');
      if (!name) return;
      const ageStr = prompt('Age (2-7)?', '4');
      const age = Math.max(2, Math.min(7, parseInt(ageStr || '4', 10) || 4));
      const id = 'c' + (Date.now());
      const palette = [T.c.pink, T.c.sky, T.c.mint, T.c.lilac, T.c.yellow];
      const emojis = ['🐰','🦊','🐻','🐼','🐯','🦁','🐸','🦄'];
      app.children.push(new Child({
        id, name, age,
        color: palette[Math.floor(Math.random()*palette.length)],
        emoji: emojis[Math.floor(Math.random()*emojis.length)],
        stars: 0,
      }));
      app.tasks[id] = [];
      app.activeChild = id;
      app.save();
      app.render();
    },
  }, ['+']));

  return h('div', { class: 'child-selector' }, [row]);
}

function renderTaskRow(task, app) {
  const row = h('div', { class: `task-row${task.done ? ' done' : ''}` }, [
    h('button', { class: 'toggle', onClick: () => app.toggleTask(task.id) },
      task.done ? [svgIcon('<path d="M3 7l3 3 5-6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>', 14)] : []
    ),
    h('span', { class: 'title' }, [task.title]),
    h('span', { class: 'stars' },
      Array.from({ length: task.stars }, () => Star({ size: 14, color: T.c.yellow }))
    ),
    task.done ? null : h('button', { class: 'del', onClick: () => app.deleteTask(task.id) }, ['×']),
  ]);
  return row;
}

/* =====================================================
   5. Add task bottom sheet (overlay)
   ===================================================== */
function renderAddSheet(app) {
  const child = app.activeChildObj();
  const age = child?.age || 4;
  let stars = 2;

  const input = PillInput({
    placeholder: C.sheet.placeholder,
  });

  const starsRow = h('div', { class: 'star-options' }, [1, 2, 3].map(n => {
    const btn = h('button', {
      class: stars === n ? 'active' : '',
      onClick: () => {
        stars = n;
        starsRow.querySelectorAll('button').forEach((b, i) => b.classList.toggle('active', i + 1 === n));
      },
    }, Array.from({ length: n }, () => Star({ size: 18, color: T.c.yellow })));
    return btn;
  }));

  const suggestions = (AGE_TASK_BANK[age] || AGE_TASK_BANK[4]).slice(0, 4);
  const chips = h('div', { class: 'chips' }, suggestions.map(s =>
    h('button', {
      class: 'chip',
      onClick: () => { input._input.value = s; },
    }, [s])
  ));

  const save = () => {
    const t = (input._input.value || '').trim();
    if (!t) return;
    app.addTask(new Task({ title: t, stars, done: false }));
    app.closeAddSheet();
  };

  return h('div', { class: 'sheet-back', onClick: () => app.closeAddSheet() }, [
    h('div', {
      class: 'sheet',
      onClick: (e) => e.stopPropagation(),
    }, [
      h('div', { class: 'grabber' }),
      h('h2', {}, [C.sheet.title]),
      input,
      h('div', {}, [
        h('div', { class: 'field-label' }, [C.sheet.reward]),
        starsRow,
      ]),
      h('div', {}, [
        h('div', { class: 'field-label' }, [`${C.sheet.quickPicks} ${age}`]),
        chips,
      ]),
      h('div', { class: 'actions-row' }, [
        SoftButton({ text: C.sheet.cancel, onClick: () => app.closeAddSheet() }),
        PrimaryButton({ text: C.sheet.save, size: 'md', onClick: save }),
      ]),
    ]),
  ]);
}

/* =====================================================
   6. Kid home
   ===================================================== */
function renderKidHome(app) {
  const child = app.activeChildObj() || app.children[0];
  const childTasks = app.tasks[app.activeChild] || [];
  const next = childTasks.find(t => !t.done);

  const header = h('div', { class: 'kid-header' }, [
    h('div', { class: 'name-pill' }, [
      h('span', { class: 'em' }, [child?.emoji || '🦊']),
      h('span', { class: 'nm' }, [app.userName || child?.name || 'Buddy']),
    ]),
    h('div', { style: { flex: 1 } }),
    h('div', { class: 'stars-pill' }, [
      Star({ size: 20, color: T.c.yellowDeep }),
      h('span', {}, [String(child?.stars ?? 0)]),
    ]),
    IconBtn({ icon: Icons.menu(), onClick: () => app.logout() }),
  ]);

  const nq = h('div', { class: 'next-quest' }, [
    h('div', { class: 'nq-card' }, [
      h('div', { class: 'icon-circle' }, [next ? '🎯' : '🎉']),
      h('div', { class: 'info' }, [
        h('div', { class: 'eyebrow' }, [next ? C.kid.nextQuest : C.kid.allDone]),
        h('div', { class: 'title' }, [next ? next.title : C.kid.breakLine]),
      ]),
      next ? h('button', { class: 'play-btn', onClick: () => app.playTask(next.id) }, ['▶']) : null,
    ]),
  ]);

  const playCards = h('div', { class: 'play-cards' }, [
    h('button', { class: 'play-card', onClick: () => app.go('adv') }, [
      h('div', { class: 'pc-info' }, [
        h('div', { class: 'pc-eyebrow' }, [C.kid.advCardEyebrow]),
        h('div', { class: 'pc-title' }, [C.kid.advCardTitle]),
      ]),
      h('div', { class: 'pc-art' }, [AdventureDoor()]),
    ]),
    h('button', { class: 'play-card', onClick: () => app.go('smart') }, [
      h('div', { class: 'pc-info' }, [
        h('div', { class: 'pc-eyebrow' }, [C.kid.smartCardEyebrow]),
        h('div', { class: 'pc-title' }, [C.kid.smartCardTitle]),
      ]),
      h('div', { class: 'pc-art' }, [SmartieArt()]),
    ]),
  ]);

  const list = h('div', { class: 'task-list' }, []);
  if (childTasks.length === 0) {
    list.appendChild(h('div', { class: 'task-empty' }, [C.kid.emptyQuests]));
  } else {
    childTasks.forEach(t => list.appendChild(renderKidQuestRow(t, app)));
  }

  const questsBlock = h('div', { class: 'quests-block' }, [
    h('h2', {}, [C.kid.quests]),
    list,
  ]);

  const mascot = app.tweaks.showMascot
    ? h('div', { class: 'mascot-strip' }, [
        Piffy({ size: 80 }),
        h('div', { class: 'bubble' }, [
          h('div', { class: 'who' }, [C.kid.piffyName]),
          h('span', {}, [C.kid.piffyLine]),
        ]),
      ])
    : null;

  return h('div', { class: 'screen' }, [
    BgPattern(),
    h('div', { class: 'screen-inner', style: { paddingBottom: '32px' } }, [
      header, nq, playCards, questsBlock, mascot,
    ]),
  ]);
}

function renderKidQuestRow(task, app) {
  return h('button', {
    class: `quest-row${task.done ? ' done' : ''}`,
    onClick: () => { if (!task.done) app.playTask(task.id); },
  }, [
    h('div', { class: 'mark' }, [
      task.done
        ? svgIcon('<path d="M3 7l3 3 5-6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>', 14)
        : h('span', { style: { fontSize: '14px' } }, ['▶']),
    ]),
    h('span', { class: 'title' }, [task.title]),
    h('span', { class: 'stars' }, Array.from({ length: task.stars }, () => Star({ size: 14 }))),
  ]);
}

/* =====================================================
   7. Task Play (intro → doing → done)
   ===================================================== */
function renderTaskPlay(app) {
  const task = (app.tasks[app.activeChild] || []).find(t => t.id === app.playingTaskId);
  if (!task) {
    setTimeout(() => app.go('kid'), 0);
    return h('div', { class: 'screen' });
  }

  const state = { stage: 'intro', t: 0, timer: null };

  const stagesArea = h('div', {}, []);
  const footer = h('div', { class: 'footer' }, []);

  function rerender() {
    stagesArea.innerHTML = '';
    footer.innerHTML = '';
    if (state.stage === 'intro') {
      if (app.tweaks.showMascot) stagesArea.appendChild(Piffy({ size: 120 }));
      footer.appendChild(PrimaryButton({
        text: C.play.ready, color: T.c.sage, full: true,
        onClick: () => { state.stage = 'doing'; startTimer(); rerender(); },
      }));
    } else if (state.stage === 'doing') {
      const mins = Math.floor(state.t / 60), secs = state.t % 60;
      const ring = h('div', { class: 'timer-ring' }, [
        h('div', { class: 'lbl' }, [C.play.doing]),
        h('div', { class: 'time' }, [`${String(mins)}:${String(secs).padStart(2, '0')}`]),
        h('div', { class: 'pulse' }, [['🌱','💫','✨','🌟'][Math.floor(state.t/2) % 4]]),
      ]);
      stagesArea.appendChild(ring);
      footer.appendChild(PrimaryButton({
        text: C.play.didIt, color: T.c.berry, full: true,
        onClick: () => { stopTimer(); state.stage = 'done'; rerender(); },
      }));
    } else if (state.stage === 'done') {
      stagesArea.appendChild(h('div', { class: 'done-word' }, [C.play.done]));
      footer.appendChild(PrimaryButton({
        text: `${C.play.collect} ${task.stars} ⭐`, color: T.c.cobalt, full: true,
        onClick: () => app.completeTask(task.id, task.stars),
      }));
    }
  }

  function startTimer() {
    state.timer = setInterval(() => { state.t++; rerender(); }, 1000);
  }
  function stopTimer() { if (state.timer) clearInterval(state.timer); state.timer = null; }

  // Clean up timer when screen swapped
  const screen = h('div', { class: 'screen scr-play' }, [
    BgPattern(),
    h('div', { class: 'topbar' }, [
      IconBtn({ icon: Icons.back(), light: true, onClick: () => { stopTimer(); app.go('kid'); } }),
      h('span', { class: 'lbl' }, [C.play.crumb]),
    ]),
    h('div', { class: 'body' }, [
      h('div', { class: 'deco', style: { top: '20px', left: '-10px' } }, [Star({ size: 70, rotate: -12 })]),
      h('div', { class: 'deco', style: { top: '80px', right: '10px' } }, [Star({ size: 50, rotate: 18, color: T.c.pink })]),
      h('div', { style: { position: 'relative', zIndex: 1 } }, [
        h('div', { class: 'quest-label' }, [C.play.yourQuest]),
        h('h1', {}, [task.title]),
        h('div', { class: 'stars-row' }, Array.from({ length: task.stars }, () => Star({ size: 28 }))),
      ]),
      stagesArea,
    ]),
    footer,
  ]);

  // First paint
  rerender();
  // Hook for app to clean up
  screen._cleanup = stopTimer;
  return screen;
}

/* =====================================================
   8. Reward (with confetti)
   ===================================================== */
function renderReward(app) {
  const stars = app.rewardStars;
  const confetti = h('div', { class: 'confetti' }, []);
  for (let i = 0; i < 16; i++) {
    const ang = (i / 16) * Math.PI * 2;
    const r = 140 + (i % 3) * 30;
    const colors = [T.c.pink, T.c.mintDeep, T.c.yellow, T.c.lilac];
    const star = Star({ size: 20 + (i % 4) * 6, rotate: i * 20, color: colors[i % 4] });
    star.style.position = 'absolute';
    star.style.left = `calc(50% + ${Math.cos(ang) * r}px - 14px)`;
    star.style.top = `calc(40% + ${Math.sin(ang) * r}px - 14px)`;
    confetti.appendChild(star);
  }

  const piffy = app.tweaks.showMascot ? Piffy({ size: 140 }) : Star({ size: 100 });
  piffy.style.transition = 'transform .3s';
  piffy.style.transform = 'scale(0.8)';

  setTimeout(() => {
    confetti.classList.add('show');
    piffy.style.transform = 'scale(1.05)';
  }, 100);

  return h('div', { class: 'screen scr-reward' }, [
    confetti,
    piffy,
    h('div', { class: 'reward-text' }, [
      h('div', { class: 'em' }, [C.reward.title]),
      h('div', { class: 'big' }, [`+${stars} ⭐`]),
      h('div', { class: 'sm' }, [C.reward.sub]),
    ]),
    PrimaryButton({
      text: C.reward.cta, color: T.c.sage,
      onClick: () => app.go('kid'),
      style: { marginTop: '12px' },
    }),
  ]);
}

/* =====================================================
   9. Adventure
   ===================================================== */
function renderAdventure(app) {
  const adv = app.currentAdventure || pickAdventure();
  app.currentAdventure = adv;

  return h('div', { class: 'screen scr-adv' }, [
    h('div', { class: 'topbar' }, [
      IconBtn({ icon: Icons.back(), light: true, onClick: () => app.go('kid') }),
      h('span', { class: 'lbl' }, [C.adventure.crumb]),
    ]),
    h('div', { class: 'title-block' }, [
      h('div', { class: 'eyebrow' }, [C.adventure.eyebrow]),
      h('h1', {}, [C.adventure.title]),
    ]),
    h('div', { class: 'door-stage' }, [BigDoor()]),
    h('div', { class: 'quest-card' }, [
      h('div', { class: 'eyebrow' }, [C.adventure.todayLabel]),
      h('div', { class: 'title' }, [adv]),
      PrimaryButton({
        text: C.adventure.begin, size: 'md', color: T.c.cobalt,
        onClick: () => app.go('kid'), style: { marginTop: '12px' },
      }),
    ]),
  ]);
}

/* =====================================================
   10. Smartiez
   ===================================================== */
function renderSmartiez(app) {
  return h('div', { class: 'screen scr-smart' }, [
    BgPattern(),
    h('div', { class: 'screen-inner' }, [
      h('div', { class: 'topbar' }, [
        IconBtn({ icon: Icons.back(), light: true, onClick: () => app.go('kid') }),
        h('span', { class: 'lbl' }, [C.smartiez.crumb]),
      ]),
      h('div', { class: 'title-block' }, [
        h('div', { class: 'eyebrow' }, [C.smartiez.eyebrow]),
        h('h1', {}, [C.smartiez.title]),
      ]),
      h('div', { class: 'modules-grid' },
        SMARTIEZ_MODULES.map(m =>
          h('button', {
            class: 'module-card',
            style: { background: m.bg },
            onClick: () => alert(`Module: ${m.label}\n(Plug in real activity here.)`),
          }, [
            h('div', { class: 'em' }, [m.emoji]),
            h('div', { class: 'lbl' }, [m.label]),
          ])
        )
      ),
    ]),
  ]);
}

/* expose */
Object.assign(window, {
  renderSplash, renderRole, renderLogin,
  renderParentHome, renderAddSheet,
  renderKidHome, renderTaskPlay, renderReward,
  renderAdventure, renderSmartiez,
});
