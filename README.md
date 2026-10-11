# FocusFlow — Student Productivity & Study Dashboard

DecodeLabs Full Stack Development Internship — **Project 1: Responsive Frontend Development**

FocusFlow is a modern, responsive web application that helps students plan their day, manage tasks, focus with a Pomodoro timer and track study progress.

Built with **HTML5, CSS3 and Vanilla JavaScript only**. No frameworks, no libraries, no backend, no database and no build tools.

## Run it locally

No installation is needed.

1. Download or clone this folder.
2. Double-click **`index.html`** (it opens in your browser).

Optional: for a local server, open the folder in VS Code and use the Live Server extension, or run `npx serve` in this folder.

## Project structure

```
FocusFlow/
├── index.html          the page (semantic HTML5)
├── style.css           all the styling (mobile-first, CSS Grid and Flexbox)
├── script.js           all the interactivity (Vanilla JavaScript)
├── README.md
└── assets/
    └── images/
        ├── favicon.svg
        └── hero-dashboard.svg
```

HTML, CSS and JavaScript are kept in separate files. There is no inline CSS block and no inline JavaScript in the HTML.

## Sections

1. **Navigation** — sticky bar, active link, hamburger menu on mobile, "Get Started" button
2. **Hero** — headline, buttons and a dashboard illustration
3. **Features** — four feature cards with hover animation
4. **Productivity Dashboard** — Today's Progress 75%, Tasks 6 / 8, Study Hours 4.5 hrs, Streak 7 days, with progress bars
5. **Task Manager** — add, complete, un-complete and delete tasks with live counters
6. **Focus Timer** — 25:00 Pomodoro timer with Start, Pause and Reset
7. **Study Planner** — a Monday to Sunday weekly plan
8. **Progress** — weekly goal 32 / 40 hours, 75% tasks completed, 7 day streak
9. **Motivation** — three clearly fictional sample testimonials
10. **FAQ** — accessible accordion
11. **Footer** — links, contact and social icons

## How it works

- `index.html` contains all the content and structure.
- `style.css` sets the design (colors, spacing, fonts as CSS variables) and the responsive layout.
- `script.js` adds behaviour. When the page loads, it sets up the menu, the task list, the timer, the planner highlight, the FAQ and the animations.
- The task list is an array in JavaScript. Every action (add, tick, delete) changes the array and then redraws the list, so the page never reloads. The tasks reset when the page is reloaded, because there is no backend.

## Responsive design

The page is **mobile-first**: the base CSS is written for a phone, and `@media (min-width: ...)` rules add layout for bigger screens.

| Breakpoint        | Layout                                                                         |
| ----------------- | ------------------------------------------------------------------------------ |
| Mobile < 768px    | One column, hamburger menu, stacked cards, 2 x 2 dashboard on small phones     |
| Tablet 768-1023px | Two-column hero, 4-column planner, full-width sections                         |
| Desktop 1024px+   | Full navigation bar, 7-column weekly planner, multi-column grids               |

Techniques used:

- **CSS Grid** for page layouts (feature cards, dashboard, planner, progress cards, footer)
- **Flexbox** for components (navigation, buttons, task rows, timer controls)
- **Media queries** at 600px, 768px and 1024px, plus small-phone and touch-screen rules
- **`clamp()`** for fluid typography and spacing
- **Responsive images** (`max-width: 100%`, SVG images that scale)
- **CSS variables** for all colors, spacing, radius and shadows

Tested at 320, 375, 425, 768, 1024, 1280 and 1440 px: no horizontal scrolling, no overlapping elements, navigation, task manager, timer and planner all work.

## JavaScript functionality

| Feature                | How it works                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| Mobile navigation      | The hamburger toggles a class; clicking a link, pressing Escape or clicking outside closes it          |
| Smooth scrolling       | Anchor links use `scrollIntoView({ behavior: 'smooth' })` (and respect "reduce motion")                |
| Active navigation link | An `IntersectionObserver` marks the link of the section that is on screen                              |
| Task manager           | Add, tick, untick and delete; Total / Completed / Pending counters; "No tasks yet. Add one to get started!" |
| Pomodoro timer         | 25:00 countdown with Start / Pause / Reset; the tab title shows `24:35 — FocusFlow`; only one timer can run |
| Timer completion       | Shows "Focus session complete! Take a short break."                                                    |
| FAQ accordion          | One answer open at a time, animated, with `aria-expanded` updated                                      |
| Toast notifications    | One reusable `showToast()` function; messages disappear automatically                                  |
| "Get Started" button   | Scrolls to the task manager, shows a welcome toast and focuses the input                               |
| Scroll reveal          | Sections fade in when they first scroll into view                                                      |
| Progress bars          | Animate from empty to their value when they come into view                                             |

## Accessibility

- Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`) and a logical `h1` / `h2` / `h3` hierarchy
- Real `<button>` elements and `<a>` links, all reachable by keyboard, with visible focus outlines
- "Skip to main content" link
- `aria-label`, `aria-expanded`, `aria-current` and `aria-live` where needed
- Alt text on the hero illustration; decorative icons are hidden from screen readers
- Completed tasks are struck through *and* dimmed, so meaning does not rely on color alone
- Good color contrast and support for `prefers-reduced-motion`

## Design

Primary `#6C63FF`, secondary `#8B7CFF`, background `#F7F8FC`, card `#FFFFFF`, text `#202124`, secondary text `#6B7280`, success `#22C55E`, danger `#EF4444`. Two font families only: **Plus Jakarta Sans** (headings) and **Inter** (body), with system fonts as a fallback.

## Features to mention in the evaluation

- Fully responsive, mobile-first design tested from 320px to 1440px
- Semantic HTML5 with proper heading hierarchy and accessibility features
- CSS Grid and Flexbox layouts, CSS variables, `clamp()` fluid typography
- Working task manager (add, complete, delete, live counters, empty state) with no page reload
- Pomodoro timer with Start / Pause / Reset, live tab-title countdown and no duplicate timers
- Reusable toast notification component
- Accessible FAQ accordion and hamburger menu
- Scroll-reveal and progress-bar animations that respect reduced-motion settings
- Clean, commented, framework-free code in three separate files
- User input is shown with `textContent`, so typed text can never inject HTML

## Development flow

Discovery -> Wireframe -> Semantic HTML -> Visual style -> JavaScript logic -> Accessibility and responsive audit.

The sample testimonials are fictional and are labelled as such on the page.
