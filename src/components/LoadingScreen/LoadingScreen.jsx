import { useCallback, useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

const LoadingScreen = ({ onEnter, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");

  const exitTimeoutRef = useRef(null);

  /*
   * Phones and tablets (touch is the main input) go straight in
   * once loading reaches 100. Desktop waits for ENTER.
   */
  const [autoEnter] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: none) and (pointer: coarse)")
        .matches === true
  );

  /* Guards against double triggers (key + click + auto) */
  const enteredRef = useRef(false);

  /* Always call the latest props without re-running effects */
  const onEnterRef = useRef(onEnter);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onEnterRef.current = onEnter;
    onCompleteRef.current = onComplete;
  });

  /* =========================================================
     LOADING
  ========================================================= */

  useEffect(() => {
    let current = 0;
    let timeout;

    const updateProgress = () => {
      const increment =
        Math.floor(Math.random() * 4) + 1;

      current = Math.min(current + increment, 100);

      setProgress(current);

      if (current < 100) {
        const delay =
          35 + Math.random() * 55;

        timeout = setTimeout(
          updateProgress,
          delay
        );

        return;
      }

      /*
       * 100
       * ↓
       * SYSTEM READY
       * ↓
       * ENTER
       *
       * Wait here until the user clicks.
       */

      timeout = setTimeout(() => {
        setPhase("ready");
      }, 300);
    };

    timeout = setTimeout(
      updateProgress,
      250
    );

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  /* =========================================================
     ENTER
  ========================================================= */

  const enter = useCallback(() => {
    if (enteredRef.current) return;

    enteredRef.current = true;

    /*
     * Starts music. With a click or key press this is allowed.
     * On touch devices (auto enter) the browser may block audio.
     */
    try {
      Promise.resolve(onEnterRef.current?.()).catch(() => {});
    } catch {
      /* ignore */
    }

    /*
     * Start existing vertical curtain animation.
     */
    setPhase("opening");

    /*
     * Existing curtain = 1.05s.
     */
    exitTimeoutRef.current = setTimeout(() => {
      onCompleteRef.current?.();
    }, 1100);
  }, []);

  /* =========================================================
     KEYBOARD: the Enter key works like the ENTER button
  ========================================================= */

  useEffect(() => {
    if (phase !== "ready" || autoEnter) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Enter" || event.repeat) return;

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();
      enter();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase, autoEnter, enter]);

  /* =========================================================
     TOUCH DEVICES: continue automatically at 100
  ========================================================= */

  useEffect(() => {
    if (phase !== "ready" || !autoEnter) return undefined;

    /* Short pause so 100% / SYSTEM READY is seen */
    const timer = setTimeout(enter, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [phase, autoEnter, enter]);

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(
          exitTimeoutRef.current
        );
      }
    };
  }, []);

  const formattedProgress =
    String(progress).padStart(3, "0");

  const isLoading =
    phase === "loading";

  const isReady =
    phase === "ready";

  return (
    <div
      className={`loader loader--${phase}`}
      aria-label="Loading portfolio"
    >
      {/* ================= TOP ================= */}

      <div className="loader__panel loader__panel--top">
        <div className="loader__meta loader__meta--top-left">
          <span>MUHILARASAN</span>
          <span>PORTFOLIO / 2026</span>
        </div>

        <div className="loader__meta loader__meta--top-right">
          <span>SYS.001</span>

          <span>
            {isLoading
              ? "INITIALIZING"
              : "READY"}
          </span>
        </div>

        {/* ORIGINAL DECORATION */}

        <span className="loader__cross loader__cross--top">
          +
        </span>

        <div className="loader__orbit loader__orbit--top">
          <span />
        </div>
      </div>

      {/* ================= BOTTOM ================= */}

      <div className="loader__panel loader__panel--bottom">
        <div className="loader__meta loader__meta--bottom-left">
          <span>11°00'N</span>

          <span>
            SYSTEM //{" "}
            {isLoading
              ? "INIT"
              : "READY"}
          </span>
        </div>

        <div className="loader__meta loader__meta--bottom-right">
          <span>[ 01 ]</span>
          <span>INTERFACE</span>
        </div>

        {/* ORIGINAL DECORATION */}

        <span className="loader__cross loader__cross--bottom">
          +
        </span>

        <div className="loader__orbit loader__orbit--bottom">
          <span />
        </div>
      </div>

      {/* ================= CENTER ================= */}

      <div className="loader__center">
        <span className="loader__index">
          SYSTEM / LOAD
        </span>

        <div className="loader__count" aria-hidden="true">
          {formattedProgress}%
        </div>

        <div className="loader__status" aria-live="polite">
          {isLoading
            ? "INITIALIZING"
            : "SYSTEM READY"}
        </div>

        <div className="loader__progress">
          <div
            className="loader__progress-fill"
            style={{
              transform: `scaleX(${
                progress / 100
              })`,
            }}
          />
        </div>

        {/* ================= ENTER ================= */}

        {isReady && !autoEnter && (
          <button
            className="loader__enter"
            type="button"
            onClick={enter}
            data-sound="both"
            aria-keyshortcuts="Enter"
          >
            <span className="loader__enter-text">
              PRESS ENTER
            </span>

            <span
              className="loader__enter-line"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;