/* =====================================================================
   FocusFlow — script.js
   Vanilla JavaScript only: no libraries, no frameworks, no backend.

   CONTENTS
     1. Small helpers
     2. Toast notifications
     3. Mobile navigation, smooth scrolling, active link
     4. Dashboard header and progress bars
     5. Task manager (add, complete, delete, counters)
     6. Focus timer (Pomodoro)
     7. Study planner (highlight today)
     8. FAQ accordion
     9. Scroll reveal, "Get Started" button, start-up
   ===================================================================== */
'use strict';

document.documentElement.classList.add('js'); // tells the CSS that JavaScript is running


/* ---------------------------------------------------------------------
   1. SMALL HELPERS
   --------------------------------------------------------------------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const SVG_NS = 'http://www.w3.org/2000/svg';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Create an element and (optionally) give it a class and some TEXT.
   textContent is used on purpose: whatever the user types is never run as HTML. */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* Build <svg><use href="#i-name"/></svg> (an icon from the sprite in index.html) */
function createIcon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#${name}`);
  svg.append(use);
  return svg;
}


/* ---------------------------------------------------------------------
   2. TOAST NOTIFICATIONS
   One reusable function:  showToast('Message', 'success' | 'info' | 'danger')
   The toast removes itself after a few seconds.
   --------------------------------------------------------------------- */
const TOAST_ICONS = { success: 'i-check', info: 'i-info', danger: 'i-alert' };

function showToast(message, type = 'success') {
  const region = $('#toast-region');
  if (!region) return;

  const toast = el('div', `toast toast--${type}`);
  const icon = el('span', 'toast__icon');
  icon.append(createIcon(TOAST_ICONS[type] || TOAST_ICONS.success));
  toast.append(icon, el('span', 'toast__message', message));
  region.append(toast);

  while (region.children.length > 3) region.firstElementChild.remove(); // at most 3 on screen

  setTimeout(() => {
    toast.classList.add('is-leaving'); // plays the fade-out animation
    setTimeout(() => toast.remove(), 300);
  }, type === 'danger' ? 5000 : 3200);
}


/* ---------------------------------------------------------------------
   3. MOBILE NAVIGATION, SMOOTH SCROLLING, ACTIVE LINK
   --------------------------------------------------------------------- */
const navbar = $('#navbar');
const navToggle = $('#nav-toggle');
const siteNav = $('#site-nav');

/* Open or close the hamburger menu */
function setMenu(open) {
  siteNav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function initNavigation() {
  navToggle.addEventListener('click', () => {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  // Escape closes the menu and returns focus to the button
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      setMenu(false);
      navToggle.focus();
    }
  });

  // Clicking outside the menu closes it
  document.addEventListener('click', (event) => {
    if (siteNav.classList.contains('is-open') && !navbar.contains(event.target)) setMenu(false);
  });

  // Growing to desktop width closes the mobile menu
  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  // Add a shadow to the navbar once the page is scrolled
  const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function scrollToSection(id, { focus = true } = {}) {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });

  if (focus) {
    target.setAttribute('tabindex', '-1'); // lets keyboard / screen reader users land in the section
    target.style.outline = 'none';
    target.focus({ preventScroll: true });
  }
  try { history.replaceState(null, '', `#${id}`); } catch (error) { /* some browsers block this on file:// */ }
}

/* Every link that starts with # scrolls smoothly, and clicking one closes the mobile menu */
function initSmoothScroll() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;

    event.preventDefault();
    setMenu(false);
    scrollToSection(id);
  });
}

/* Highlight the navigation link of the section that is on screen */
function initActiveNav() {
  const links = $$('[data-nav-link]');
  const sections = $$('main section[id]');
  if (!('IntersectionObserver' in window)) return;

  const setActive = (name) => {
    links.forEach((link) => {
      const active = link.dataset.navLink === name;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const name = entry.target.dataset.nav || entry.target.id; // data-nav groups sections under one link
      if (links.some((link) => link.dataset.navLink === name)) setActive(name);
    });
  }, { rootMargin: '-45% 0px -50% 0px' }); // a section counts when it crosses the middle of the screen

  sections.forEach((section) => observer.observe(section));
  setActive('home');

  // At the very bottom of the page the last link (FAQ) should be active
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setActive('faq');
  }, { passive: true });
}


/* ---------------------------------------------------------------------
   4. DASHBOARD HEADER AND PROGRESS BARS
   --------------------------------------------------------------------- */

/* Greeting and today's date at the top of the dashboard */
function initDashboardHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  $('#dash-greeting').textContent = `${greeting}!`;
  $('#dash-date').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
}

/* Any element with data-meter="<percent>" is a progress bar or ring.
   CSS transitions animate it from empty to the value when it scrolls into view. */
function applyMeter(node) {
  const value = Math.max(0, Math.min(100, Number(node.dataset.meter) || 0));
  if (node.classList.contains('ring__bar')) node.style.strokeDashoffset = String(100 - value); // circle
  else node.style.width = `${value}%`; // horizontal bar
}

function initMeters() {
  const meters = $$('[data-meter]');
  if (!('IntersectionObserver' in window) || reducedMotion()) {
    meters.forEach(applyMeter);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      applyMeter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  meters.forEach((meter) => observer.observe(meter));
}


/* ---------------------------------------------------------------------
   5. TASK MANAGER
   The tasks live in this array. Every change updates the array and then
   redraws the list, so the page never needs to reload.
   --------------------------------------------------------------------- */
let nextTaskId = 5;
const tasks = [
  { id: 1, title: 'Practice arrays on LeetCode', completed: true },
  { id: 2, title: 'Revise SQL joins', completed: false },
  { id: 3, title: 'Finish the DBMS assignment', completed: false },
  { id: 4, title: 'Solve 10 aptitude questions', completed: false }
];

const taskListEl = $('#task-list');
const taskEmptyEl = $('#task-empty');

/* Update the Total / Completed / Pending counters */
function renderCounts() {
  const done = tasks.filter((task) => task.completed).length;
  $('#count-total').textContent = tasks.length;
  $('#count-done').textContent = done;
  $('#count-pending').textContent = tasks.length - done;
}

/* Build one <li> for a task: checkbox + text + delete button */
function createTaskItem(task, isNew) {
  const item = el('li', `task-item${task.completed ? ' is-done' : ''}${isNew ? ' is-new' : ''}`);
  item.dataset.id = String(task.id);

  const label = el('label', 'task-item__check');
  const checkbox = el('input', 'task-item__checkbox');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', `Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`);
  const box = el('span', 'task-item__box');
  box.setAttribute('aria-hidden', 'true');
  label.append(checkbox, box, el('span', 'task-item__text', task.title));

  const remove = el('button', 'task-item__delete');
  remove.type = 'button';
  remove.setAttribute('aria-label', `Delete task: ${task.title}`);
  remove.append(createIcon('i-trash'));

  item.append(label, remove);
  return item;
}

/* Draw the whole list from the array (newTaskId = the task that was just added, for its entrance animation) */
function renderTasks(newTaskId) {
  taskListEl.replaceChildren(...tasks.map((task) => createTaskItem(task, task.id === newTaskId)));
  taskEmptyEl.hidden = tasks.length > 0; // "No tasks yet. Add one to get started!"
  renderCounts();
}

function addTask(title) {
  const task = { id: nextTaskId, title, completed: false };
  nextTaskId += 1;
  tasks.push(task);
  renderTasks(task.id);
  showToast('Task added successfully!');
}

function toggleTask(id) {
  const task = tasks.find((entry) => entry.id === id);
  if (!task) return;
  task.completed = !task.completed;
  renderTasks();
  showToast(task.completed ? 'Task completed!' : 'Task marked as pending.', task.completed ? 'success' : 'info');
}

function deleteTask(id, item) {
  const remove = () => {
    const index = tasks.findIndex((entry) => entry.id === id);
    if (index === -1) return;
    tasks.splice(index, 1);
    renderTasks();
    showToast('Task deleted!');
  };

  if (reducedMotion()) return remove();
  item.classList.add('is-removing'); // plays the fade-out, then the task is really removed
  setTimeout(remove, 220);
}

function initTasks() {
  const form = $('#task-form');
  const input = $('#task-input');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    const title = input.value.trim();

    if (title === '') {
      input.classList.remove('is-invalid');
      void input.offsetWidth; // restart the shake animation
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      showToast('Please enter a task first.', 'danger');
      input.focus();
      return;
    }

    addTask(title);
    form.reset();
    input.focus();
  });

  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  });

  /* One listener for the whole list (event delegation): it also works for tasks added later */
  taskListEl.addEventListener('change', (event) => {
    if (event.target.matches('.task-item__checkbox')) {
      toggleTask(Number(event.target.closest('.task-item').dataset.id));
    }
  });
  taskListEl.addEventListener('click', (event) => {
    const button = event.target.closest('.task-item__delete');
    if (!button) return;
    const item = button.closest('.task-item');
    deleteTask(Number(item.dataset.id), item);
  });

  renderTasks();
}


/* ---------------------------------------------------------------------
   6. FOCUS TIMER (Pomodoro)
   25:00 countdown with Start, Pause and Reset.
   --------------------------------------------------------------------- */
const BASE_TITLE = document.title;
const FOCUS_SECONDS = 25 * 60;

function initTimer() {
  const timerBox = $('.timer');
  const display = $('#timer-display');
  const ring = $('#timer-progress');
  const status = $('#timer-status');
  const startBtn = $('#timer-start');
  const pauseBtn = $('#timer-pause');
  const resetBtn = $('#timer-reset');

  let remaining = FOCUS_SECONDS; // seconds left
  let endTime = 0;               // the clock time (ms) when the countdown reaches zero
  let intervalId = null;         // null = not running. Only ONE interval can ever exist, so timers never double up.

  const isRunning = () => intervalId !== null;
  const pad = (n) => String(n).padStart(2, '0');
  const formatTime = (seconds) => `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

  /* aria-disabled (not "disabled") keeps keyboard focus on the button */
  function setDisabled(button, disabled) {
    button.setAttribute('aria-disabled', String(disabled));
  }

  /* Show the time, move the ring, and put the time in the browser tab title while running */
  function draw() {
    display.textContent = formatTime(remaining);
    ring.style.strokeDashoffset = String(100 - (remaining / FOCUS_SECONDS) * 100);
    document.title = isRunning() ? `${formatTime(remaining)} — FocusFlow` : BASE_TITLE;
  }

  function setStatus(message, done = false) {
    status.textContent = message;
    status.classList.toggle('is-done', done);
  }

  function stopInterval() {
    clearInterval(intervalId);
    intervalId = null;
    timerBox.classList.remove('is-running');
    setDisabled(startBtn, false);
    setDisabled(pauseBtn, true);
  }

  function complete() {
    stopInterval();
    remaining = 0;
    timerBox.classList.add('is-done');
    draw();
    document.title = BASE_TITLE;
    setStatus('Focus session complete! Take a short break.', true);
    showToast('Focus session complete! Take a short break.');
  }

  /* Runs 4 times a second. The remaining time is worked out from the real clock,
     so the timer stays accurate even if the browser slows down a background tab. */
  function tick() {
    remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    draw();
    if (remaining === 0) complete();
  }

  function start() {
    if (isRunning()) return; // already running: do nothing, so two timers can never run together
    if (remaining <= 0) reset();

    const fresh = remaining === FOCUS_SECONDS;
    timerBox.classList.remove('is-done');
    endTime = Date.now() + remaining * 1000;
    intervalId = setInterval(tick, 250);
    timerBox.classList.add('is-running');
    setDisabled(startBtn, true);
    setDisabled(pauseBtn, false);
    setStatus('Stay with it. You are in the zone.');
    draw();
    showToast(fresh ? 'Focus session started!' : 'Focus session resumed.');
  }

  function pause() {
    if (!isRunning()) return;
    tick(); // bring the display up to date first
    if (!isRunning()) return; // that tick finished the session
    stopInterval();
    draw();
    setStatus('Paused. Press Start to continue.');
    showToast('Timer paused.', 'info');
  }

  function reset() {
    const wasRunning = isRunning();
    stopInterval();
    remaining = FOCUS_SECONDS;
    timerBox.classList.remove('is-done');
    ring.classList.add('no-transition'); // jump back instantly instead of animating backwards
    draw();
    void ring.getBoundingClientRect();
    ring.classList.remove('no-transition');
    setStatus('Ready when you are.');
    if (wasRunning) showToast('Timer reset.', 'info');
  }

  startBtn.addEventListener('click', () => { if (startBtn.getAttribute('aria-disabled') !== 'true') start(); });
  pauseBtn.addEventListener('click', () => { if (pauseBtn.getAttribute('aria-disabled') !== 'true') pause(); });
  resetBtn.addEventListener('click', reset);

  draw();
}


/* ---------------------------------------------------------------------
   7. STUDY PLANNER: highlight today's card
   --------------------------------------------------------------------- */
function initPlanner() {
  const today = String(new Date().getDay()); // 0 = Sunday ... 6 = Saturday (matches data-day in the HTML)
  const card = $(`.study-card[data-day="${today}"]`);
  if (!card) return;

  card.classList.add('is-today');
  card.querySelector('.study-card__day').append(el('span', 'study-card__badge', 'Today'));
}


/* ---------------------------------------------------------------------
   8. FAQ ACCORDION
   Only one answer is open at a time. The open/close animation is done in CSS.
   --------------------------------------------------------------------- */
function initFaq() {
  const items = $$('.faq__item');

  function setOpen(item, open) {
    item.classList.toggle('is-open', open);
    $('.faq__question', item).setAttribute('aria-expanded', String(open));
  }

  items.forEach((item) => {
    $('.faq__question', item).addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach((other) => setOpen(other, other === item && willOpen)); // close all others
    });
  });

  setOpen(items[0], true); // the first answer starts open
}


/* ---------------------------------------------------------------------
   9. SCROLL REVEAL, "GET STARTED" BUTTON, START-UP
   --------------------------------------------------------------------- */

/* Elements with class "reveal" fade in the first time they scroll into view */
function initReveal() {
  const targets = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((node) => node.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // reveal only once
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((node) => observer.observe(node));
}

/* Runs the callback once smooth scrolling has stopped */
function afterScrollEnds(callback) {
  let timer = setTimeout(finish, 400);
  function finish() {
    window.removeEventListener('scroll', onScroll);
    clearTimeout(timer);
    callback();
  }
  function onScroll() {
    clearTimeout(timer);
    timer = setTimeout(finish, 150);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* "Get Started": scroll to the task manager, say hello, and focus the input */
function initGetStarted() {
  $('#get-started').addEventListener('click', () => {
    setMenu(false);
    scrollToSection('tasks', { focus: false });
    showToast('Welcome to FocusFlow! Add your first task below.', 'info');
    afterScrollEnds(() => $('#task-input').focus({ preventScroll: true }));
  });
}

/* Start-up: runs once the HTML has loaded */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSmoothScroll();
  initActiveNav();
  initDashboardHeader();
  initMeters();
  initTasks();
  initTimer();
  initPlanner();
  initFaq();
  initReveal();
  initGetStarted();
});
