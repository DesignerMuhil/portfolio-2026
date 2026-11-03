import { useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

const LoadingScreen = ({ onEnter, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");

  const exitTimeoutRef = useRef(null);

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

  const handleEnter = () => {
    if (phase !== "ready") return;

    /*
     * Starts music from the real user interaction.
     */
    onEnter?.();

    /*
     * Start existing vertical curtain animation.
     */
    setPhase("opening");

    /*
     * Existing curtain = 1.05s.
     */
    exitTimeoutRef.current =
      setTimeout(() => {
        onComplete?.();
      }, 1100);
  };

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
      aria-live="polite"
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

        <div className="loader__count">
          {formattedProgress}%
        </div>

        <div className="loader__status">
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

        {isReady && (
          <button
            className="loader__enter"
            type="button"
            onClick={handleEnter}
            data-sound="both"
          >
            <span className="loader__enter-text">
              ENTER
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