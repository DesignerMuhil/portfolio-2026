import { Children, useEffect, useRef, useState } from "react";
import ScrollPixelTransition from "../ScrollPixelTransition/ScrollPixelTransition";
import "./HorizontalPage.css";
import "./PortfolioHeader.css";
import MenuOverlay from "../MenuOverlay/MenuOverlay";
import menuIcon from "../../assets/icons/menu.svg";
import logo from "../../assets/branding/logo.svg";

/* ======================================
   ORIGINAL SCROLL SETTINGS
====================================== */

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));

const WORK_EASE = 0.075;
const WORK_WHEEL = 0.85;
const WORK_MAX_STEP = 140;

const HERO_EASE = 0.065;
const RETURN_DURATION = 1250; // milliseconds, Work → Hero logo click

export default function HorizontalPage({ children }) {
  const shellRef = useRef(null);
  const viewportRef = useRef(null);
  const workRef = useRef(null);

  const heroTargetRef = useRef(0);
  const heroFrameRef = useRef(null);
  const returnFrameRef = useRef(null);
  const returningRef = useRef(false);

  const workTargetRef = useRef(0);
  const workFrameRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigateRef = useRef(null);

  const [hero, work] = Children.toArray(children);

  useEffect(() => {
    const shell = shellRef.current;
    const viewport = viewportRef.current;
    const workScene = workRef.current;

    if (!shell || !viewport || !workScene) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    /* PERF FIX: measure sizes once (and when they change)
       instead of asking the browser on every animation frame. */
    let cachedWidth = viewport.clientWidth || 1;
    let cachedWorkMax = 0;

    const measure = () => {
      cachedWidth = viewport.clientWidth || 1;
      cachedWorkMax = Math.max(
        0,
        workScene.scrollHeight - workScene.clientHeight
      );
    };

    const viewportWidth = () => cachedWidth;
    const getWorkMaxScroll = () => cachedWorkMax;

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(workScene);
    if (workScene.firstElementChild) {
      resizeObserver.observe(workScene.firstElementChild);
    }
    measure();

    const menuOpen = () =>
      Boolean(document.querySelector(".menu-overlay--open"));

    /*
      Work is active once the horizontal destination
      has reached Work, even if the easing animation
      is still completing.
    */
    const atWork = () =>
      heroTargetRef.current >= viewportWidth() - 1 ||
      viewport.scrollLeft >= viewportWidth() - 2;

    /* PERF FIX: only update React when the value really changed */
    let lastProgress = -1;

    const syncProgress = () => {
      const next = clamp(
        viewport.scrollLeft / viewportWidth(),
        0,
        1
      );
      if (next === lastProgress) return;
      lastProgress = next;
      setProgress(next);
    };

    /* ======================================
       HERO / WORK HORIZONTAL TRANSITION
    ====================================== */

    const stopHeroAnimation = () => {
      if (heroFrameRef.current !== null) {
        cancelAnimationFrame(heroFrameRef.current);
        heroFrameRef.current = null;
      }
    };

    const animateHero = () => {
      const target = clamp(
        heroTargetRef.current,
        0,
        viewportWidth()
      );

      const current = viewport.scrollLeft;
      const difference = target - current;

      if (Math.abs(difference) < 0.5) {
        viewport.scrollLeft = target;
        heroFrameRef.current = null;
        syncProgress();
        return;
      }

      viewport.scrollLeft =
        current + difference * HERO_EASE;

      syncProgress();

      heroFrameRef.current =
        requestAnimationFrame(animateHero);
    };

    // A fixed-duration return keeps the pixel transition visible.
    // Wheel/keyboard input cannot interrupt it mid-animation.
    const stopReturnAnimation = () => {
      if (returnFrameRef.current !== null) {
        cancelAnimationFrame(returnFrameRef.current);
        returnFrameRef.current = null;
      }
      returningRef.current = false;
    };

    const returnHomeSmoothly = () => {
      stopHeroAnimation();
      stopReturnAnimation();
      heroTargetRef.current = 0;

      if (reducedMotion.matches) {
        viewport.scrollLeft = 0;
        syncProgress();
        return;
      }

      const start = viewport.scrollLeft;
      if (start <= 0.5) {
        viewport.scrollLeft = 0;
        syncProgress();
        return;
      }

      returningRef.current = true;
      let startTime = null;

      const frame = (now) => {
        if (startTime === null) startTime = now;
        const t = clamp((now - startTime) / RETURN_DURATION, 0, 1);
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

        viewport.scrollLeft = start * (1 - eased);
        syncProgress();

        if (t < 1) {
          returnFrameRef.current = requestAnimationFrame(frame);
        } else {
          viewport.scrollLeft = 0;
          returnFrameRef.current = null;
          returningRef.current = false;
          syncProgress();
        }
      };

      returnFrameRef.current = requestAnimationFrame(frame);
    };

    const moveHeroTo = (next) => {
      heroTargetRef.current = clamp(
        next,
        0,
        viewportWidth()
      );

      if (reducedMotion.matches) {
        stopHeroAnimation();
        viewport.scrollLeft = heroTargetRef.current;
        syncProgress();
        return;
      }

      if (heroFrameRef.current === null) {
        heroFrameRef.current =
          requestAnimationFrame(animateHero);
      }
    };

    /* ======================================
       MAGNETIC VERTICAL WORK SCROLL
    ====================================== */

    const stopWorkAnimation = () => {
      if (workFrameRef.current !== null) {
        cancelAnimationFrame(workFrameRef.current);
        workFrameRef.current = null;
      }
    };

    const animateWork = () => {
      const target = clamp(
        workTargetRef.current,
        0,
        getWorkMaxScroll()
      );

      const current = workScene.scrollTop;
      const difference = target - current;

      if (Math.abs(difference) < 0.4) {
        workScene.scrollTop = target;
        workFrameRef.current = null;
        return;
      }

      workScene.scrollTop =
        current + difference * WORK_EASE;

      workFrameRef.current =
        requestAnimationFrame(animateWork);
    };

    const scrollWorkBy = (delta) => {
      const maxScroll = getWorkMaxScroll();

      if (workFrameRef.current === null) {
        workTargetRef.current = workScene.scrollTop;
      }

      const nextTarget = clamp(
        workTargetRef.current + delta,
        0,
        maxScroll
      );

      workTargetRef.current = nextTarget;

      if (reducedMotion.matches) {
        stopWorkAnimation();
        workScene.scrollTop = nextTarget;
        return;
      }

      if (workFrameRef.current === null) {
        workFrameRef.current =
          requestAnimationFrame(animateWork);
      }
    };

    /* ======================================
       RESET WORK ON NEW VISIT
    ====================================== */

    let workVisited = atWork();

    const resetWorkScroll = () => {
      stopWorkAnimation();
      workScene.scrollTop = 0;
      workTargetRef.current = 0;
    };

    const enterWork = () => {
      if (!workVisited) {
        resetWorkScroll();
        workVisited = true;
      }
    };

    /* ======================================
       CATEGORY NAVIGATION COORDINATION
    ====================================== */

    const onCategoryNavigation = () => {
      stopWorkAnimation();
      workTargetRef.current = workScene.scrollTop;
    };

    const onWorkScroll = () => {
      if (workFrameRef.current === null) {
        workTargetRef.current = workScene.scrollTop;
      }
    };

    /* ======================================
       EXPLICIT NAVIGATION
       #work / #top / #home
    ====================================== */

    const navigateTo = (destination) => {
      stopHeroAnimation();
      stopWorkAnimation();

      if (destination === "work") {
        stopReturnAnimation();
        enterWork();
        moveHeroTo(viewportWidth());
      } else {
        resetWorkScroll();
        workVisited = false;
        returnHomeSmoothly();
      }
    };

    navigateRef.current = navigateTo;

    const onHashChange = () => {
      const hash = decodeURIComponent(
        window.location.hash.slice(1)
      );

      if (hash === "work") {
        navigateTo("work");
      } else if (hash === "top" || hash === "home") {
        navigateTo("home");
      }
    };

    /* ======================================
       MOUSE WHEEL / TRACKPAD
    ====================================== */

    const onWheel = (event) => {
      if (returningRef.current) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (
        event.ctrlKey ||
        event.metaKey ||
        menuOpen()
      ) {
        return;
      }

      const raw =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (!raw) return;

      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? viewport.clientHeight
            : 1;

      const delta = raw * unit;

      if (event.cancelable) {
        event.preventDefault();
      }

      if (atWork()) {
        /*
          Finish the horizontal transition first.
          Then keep subsequent scrolling inside Work.
        */
        if (heroTargetRef.current !== viewportWidth()) {
          moveHeroTo(viewportWidth());
        }

        enterWork();

        const gentleDelta =
          clamp(
            delta,
            -WORK_MAX_STEP,
            WORK_MAX_STEP
          ) * WORK_WHEEL;

        scrollWorkBy(gentleDelta);
        return;
      }

      /*
        Before Work is active, wheel movement
        drives the horizontal transition.
      */
      const nextTarget = clamp(
        heroTargetRef.current + delta,
        0,
        viewportWidth()
      );

      if (nextTarget >= viewportWidth() - 1) {
        enterWork();
      }

      moveHeroTo(nextTarget);
    };

    /* ======================================
       KEYBOARD
    ====================================== */

    const onKeyDown = (event) => {
      if (returningRef.current) return;
      const target = event.target;

      if (
        menuOpen() ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (
          target instanceof Element &&
          target.closest(
            "input, textarea, select, button, a, [contenteditable]"
          )
        )
      ) {
        return;
      }

      const movement = {
        ArrowDown: 100,
        ArrowUp: -100,
        ArrowRight: 100,
        ArrowLeft: -100,
        PageDown: viewport.clientHeight * 0.8,
        PageUp: -viewport.clientHeight * 0.8,
        " ": event.shiftKey
          ? -viewport.clientHeight * 0.8
          : viewport.clientHeight * 0.8,
      };

      if (!(event.key in movement)) return;

      event.preventDefault();

      if (atWork()) {
        if (heroTargetRef.current !== viewportWidth()) {
          moveHeroTo(viewportWidth());
        }

        enterWork();
        scrollWorkBy(movement[event.key]);
      } else {
        const nextTarget = clamp(
          heroTargetRef.current + movement[event.key],
          0,
          viewportWidth()
        );

        if (nextTarget >= viewportWidth() - 1) {
          enterWork();
        }

        moveHeroTo(nextTarget);
      }
    };

    /* ======================================
       NATIVE SCROLL SYNCHRONIZATION
    ====================================== */

    const onViewportScroll = () => {
      /* PERF FIX: while our own animation is running it already
         updates progress, so skip the duplicate update. */
      if (heroFrameRef.current !== null || returningRef.current) {
        return;
      }

      heroTargetRef.current = viewport.scrollLeft;
      syncProgress();
    };

    const onResize = () => {
      measure();
      const wasAtWork = atWork();

      stopHeroAnimation();
      stopWorkAnimation();

      viewport.scrollLeft = wasAtWork
        ? viewportWidth()
        : 0;

      heroTargetRef.current = viewport.scrollLeft;

      workTargetRef.current = clamp(
        workScene.scrollTop,
        0,
        getWorkMaxScroll()
      );

      workVisited = wasAtWork;

      syncProgress();
    };

    /* ======================================
       TOUCH
    ====================================== */

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartPosition = 0;
    let touchAxis = null;

    const onTouchStart = (event) => {
      if (returningRef.current) return;
      if (event.touches.length !== 1) return;

      if (atWork()) {
        stopWorkAnimation();
        workTargetRef.current = workScene.scrollTop;
        return;
      }

      stopHeroAnimation();

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchStartPosition = viewport.scrollLeft;
      touchAxis = null;
    };

    const onTouchMove = (event) => {
      if (returningRef.current) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (
        event.touches.length !== 1 ||
        menuOpen() ||
        atWork()
      ) {
        return;
      }

      const dx =
        touchStartX - event.touches[0].clientX;

      const dy =
        touchStartY - event.touches[0].clientY;

      if (
        !touchAxis &&
        (Math.abs(dx) > 6 || Math.abs(dy) > 6)
      ) {
        touchAxis =
          Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (!touchAxis) return;

      if (event.cancelable) {
        event.preventDefault();
      }

      const delta =
        touchAxis === "x" ? dx : dy;

      viewport.scrollLeft = clamp(
        touchStartPosition + delta,
        0,
        viewportWidth()
      );

      heroTargetRef.current = viewport.scrollLeft;
      syncProgress();
    };

    const onTouchEnd = () => {
      if (returningRef.current) return;
      if (atWork()) return;

      const shouldEnterWork =
        viewport.scrollLeft >= viewportWidth() * 0.5;

      if (shouldEnterWork) {
        enterWork();
      }

      moveHeroTo(
        shouldEnterWork
          ? viewportWidth()
          : 0
      );
    };

    /* ======================================
       EVENT LISTENERS
    ====================================== */

    shell.addEventListener("wheel", onWheel, {
      passive: false,
    });

    shell.addEventListener("keydown", onKeyDown);

    shell.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });

    shell.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });

    shell.addEventListener("touchend", onTouchEnd);

    viewport.addEventListener(
      "scroll",
      onViewportScroll,
      { passive: true }
    );

    workScene.addEventListener(
      "scroll",
      onWorkScroll,
      { passive: true }
    );

    workScene.addEventListener(
      "work-category-navigation",
      onCategoryNavigation
    );

    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHashChange);

    /* ======================================
       INITIAL STATE
    ====================================== */

    heroTargetRef.current = viewport.scrollLeft;
    workTargetRef.current = workScene.scrollTop;

    syncProgress();
    onHashChange();

    /* ======================================
       CLEANUP
    ====================================== */

    return () => {
      resizeObserver.disconnect();
      stopHeroAnimation();
      stopWorkAnimation();
      navigateRef.current = null;

      shell.removeEventListener("wheel", onWheel);
      shell.removeEventListener("keydown", onKeyDown);

      shell.removeEventListener(
        "touchstart",
        onTouchStart
      );

      shell.removeEventListener(
        "touchmove",
        onTouchMove
      );

      shell.removeEventListener(
        "touchend",
        onTouchEnd
      );

      viewport.removeEventListener(
        "scroll",
        onViewportScroll
      );

      workScene.removeEventListener(
        "scroll",
        onWorkScroll
      );

      workScene.removeEventListener(
        "work-category-navigation",
        onCategoryNavigation
      );

      window.removeEventListener("resize", onResize);
      window.removeEventListener(
        "hashchange",
        onHashChange
      );
    };
  }, []);

  const showWork = progress >= 0.5;
  const musicPlayer = hero?.props?.musicPlayer;
  const returnToHero = () => {
    setMenuOpen(false);
    navigateRef.current?.("home");
    if (window.location.hash !== "#top") {
      window.history.replaceState(null, "", "#top");
    }
  };

  return (
    <div
      ref={shellRef}
      className="horizontal-page-shell"
      tabIndex={0}
    >
      <header className={`hero__nav portfolio-shared-nav ${showWork ? "portfolio-shared-nav--dark" : ""}`}>
        <button type="button" className="hero__brand portfolio-shared-nav__home" data-sound="both" aria-label="Back to Hero" onClick={returnToHero}>
          <img src={logo} alt="Muhil logo" className="hero__brand-logo" />
        </button>
        <div className="hero__nav-center"><span>PORTFOLIO</span></div>
        <button className="tech-button hero__menu" type="button" data-sound="both" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          <span className="tech-button__corner tech-button__corner--tl" />
          <span className="tech-button__corner tech-button__corner--tr" />
          <span className="tech-button__corner tech-button__corner--bl" />
          <span className="tech-button__corner tech-button__corner--br" />
          <span className="tech-button__label">MENU</span>
          <span className="tech-button__plus"><img className="hero__menu-icon" src={menuIcon} alt="" aria-hidden="true" /></span>
        </button>
      </header>
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} musicPlayer={musicPlayer} />

      <div
        ref={viewportRef}
        className="horizontal-page"
        aria-label="Portfolio navigation"
      >
        <div className="horizontal-page__scroll-space" />
      </div>

      <div className="horizontal-page__stage">
        <div
          className="horizontal-page__scene"
          style={{
            visibility: showWork
              ? "hidden"
              : "visible",
            pointerEvents: showWork
              ? "none"
              : "auto",
          }}
          inert={showWork}
        >
          {hero}
        </div>

        <div
          ref={workRef}
          className="horizontal-page__scene horizontal-page__scene--work"
          style={{
            visibility: showWork
              ? "visible"
              : "hidden",
            pointerEvents: showWork
              ? "auto"
              : "none",
          }}
          inert={!showWork}
        >
          {work}
        </div>

        <ScrollPixelTransition
          progress={progress}
          gridSize={110}
          randomness={0.18}
          pixelColor="#101010"
        />
      </div>
    </div>
  );
}