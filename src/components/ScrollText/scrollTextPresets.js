/* All scroll-text animation settings live here.
   Tune the feel in this one file. */

/* Section titles (ScrollFloat) */
export const FLOAT_TITLE = {
  effect: "float",
  splitBy: "words",
  stretch: 1,
  distance: 100,
  stagger: 0.14,
  animationDuration: 1,
  ease: "power3.out",
  smoothing: 1.2,
  scrollStart: "top bottom-=5%",
  scrollEnd: "top 35%",
};

/* Section descriptions (ScrollReveal, scroll-linked) */
export const REVEAL_BODY = {
  baseRotation: 0,
  baseOpacity: 0.3,
  enableBlur: false,
  stagger: 0.05,
  smoothing: 0.8,
  wordAnimationEnd: "bottom center",
};

/* Hero headline (plays once on load) */
export const REVEAL_HERO = {
  mode: "enter",
  effect: "rise",
  baseRotation: 0,
  enableBlur: false,
  stagger: 0.1,
  duration: 1.4,
};

/* Hero paragraph (plays once on load) */
export const REVEAL_HERO_BODY = {
  mode: "enter",
  effect: "rise",
  baseRotation: 0,
  enableBlur: false,
  stagger: 0.03,
  duration: 1.2,
};

/* ==========================================================
   FADE-IN BLOCKS
   Each of these fades up as one piece.
   Add or remove selectors to change what animates.
========================================================== */

export const DG_UNITS = [
  ".dg-context__statement",
  ".dg-context__scope",
  ".dg-scope-strip",
  ".dg-problem-row",
  ".dg-research__aside",
  ".dg-quote",
  ".dg-insights__list > *",
  ".dg-decisions__intro",
  ".dg-decision-list > *",
  ".dg-system__note",
  ".dg-system__metric",
  ".dg-feature-list > *",
  ".dg-comparison__header",
  ".dg-comparison__screens",
  ".dg-results__lead",
  ".dg-success-rate",
  ".dg-results__sus",
  ".dg-results__flow",
  ".dg-reflection__aside",
  ".dg-lesson-list > *",
  ".dg-project-note",
];

export const JB_UNITS = [
  ".jb-challenge__statement",
  ".jb-problem-list > *",
  ".jb-audit-grid > *",
  ".jb-research-stat",
  ".jb-research-findings > *",
  ".jb-research-transition",
  ".jb-principle-list > *",
  ".jb-decision__heading",
  ".jb-signup-visual",
  ".jb-chat-visual",
  ".jb-decision__conclusion",
  ".jb-screen-item__heading",
  ".jb-screen-item__pair",
  ".jb-testing__metrics > *",
  ".jb-testing__successful",
  ".jb-testing__issues",
  ".jb-outcomes__feature",
  ".jb-outcomes__figures > *",
  ".jb-stakeholders__list > *",
  ".jb-reflection__list > *",
  ".jb-reflection__next",
  ".jb-project-note",
];