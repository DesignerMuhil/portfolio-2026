
import { useId, useRef, useState } from "react";
import nextIcon from "../../assets/icons/next.svg";
import "./ComparisonSlider.css";

export default function ComparisonSlider({
  before,
  after,
  beforeAlt = "Original design",
  afterAlt = "Redesigned design",
  title = "Design comparison",
}) {
  const [mode, setMode] = useState("full");
  const [position, setPosition] = useState(50);
  const [ratio, setRatio] = useState("16 / 9");

  const frameRef = useRef(null);
  const draggingRef = useRef(false);
  const descriptionId = useId();

  const updatePosition = (clientX) => {
    const frame = frameRef.current;
    if (!frame) return;

    const bounds = frame.getBoundingClientRect();
    const percentage = ((clientX - bounds.left) / bounds.width) * 100;

    setPosition(Math.max(2, Math.min(98, percentage)));
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (event) => {
    if (draggingRef.current) {
      updatePosition(event.clientX);
    }
  };

  const handlePointerEnd = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((value) => Math.max(2, value - 5));
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((value) => Math.min(98, value + 5));
    }

    if (event.key === "Home") {
      event.preventDefault();
      setPosition(2);
    }

    if (event.key === "End") {
      event.preventDefault();
      setPosition(98);
    }
  };

  const handleAfterLoad = (event) => {
    const image = event.currentTarget;

    if (image.naturalWidth && image.naturalHeight) {
      setRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
    }
  };

  return (
    <div className="comparison">
      <div className="comparison__toolbar">
        <div className="comparison__toolbar-copy">
          <span>SCREEN COMPARISON</span>
          <p>View the original and redesigned experience.</p>
        </div>

        <div
          className="comparison__modes"
          role="group"
          aria-label={`${title} display mode`}
        >
          <button
            type="button"
            className={mode === "full" ? "is-active" : ""}
            aria-pressed={mode === "full"}
            onClick={() => setMode("full")}
          >
            FULL VIEW
          </button>

          <button
            type="button"
            className={mode === "compare" ? "is-active" : ""}
            aria-pressed={mode === "compare"}
            onClick={() => setMode("compare")}
          >
            COMPARE
          </button>
        </div>
      </div>

      {mode === "full" ? (
        <div className="comparison__full-view">
          <figure className="comparison__screen">
            <figcaption>
              <span className="comparison__status-dot" />
              BEFORE / ORIGINAL
            </figcaption>

            <div className="comparison__screen-image">
              <img
                src={before}
                alt={beforeAlt}
                loading="lazy"
              />
            </div>
          </figure>

          <figure className="comparison__screen">
            <figcaption>
              <span className="comparison__status-dot comparison__status-dot--after" />
              AFTER / REDESIGNED
            </figcaption>

            <div className="comparison__screen-image">
              <img
                src={after}
                alt={afterAlt}
                loading="lazy"
              />
            </div>
          </figure>
        </div>
      ) : (
        <div className="comparison__compare-view">
          <div
            className="comparison__frame"
            ref={frameRef}
            style={{ aspectRatio: ratio }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onLostPointerCapture={handlePointerEnd}
          >
            <div className="comparison__layer comparison__layer--after">
              <img
                src={after}
                alt={afterAlt}
                draggable={false}
                onLoad={handleAfterLoad}
              />
            </div>

            <div
              className="comparison__layer comparison__layer--before"
              style={{
                clipPath: `inset(0 ${100 - position}% 0 0)`,
              }}
            >
              <img
                src={before}
                alt={beforeAlt}
                draggable={false}
              />
            </div>

            <span className="comparison__tag comparison__tag--before">
              BEFORE
            </span>

            <span className="comparison__tag comparison__tag--after">
              AFTER
            </span>

            <div
              className="comparison__divider"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            />

            <div
              className="comparison__handle"
              style={{ left: `${position}%` }}
              role="slider"
              tabIndex={0}
              aria-label={title}
              aria-describedby={descriptionId}
              aria-orientation="horizontal"
              aria-valuemin={2}
              aria-valuemax={98}
              aria-valuenow={Math.round(position)}
              aria-valuetext={`${Math.round(position)} percent original screen visible`}
              onKeyDown={handleKeyDown}
            >
              <img
                src={nextIcon}
                alt=""
                aria-hidden="true"
                className="comparison__arrow comparison__arrow--left"
              />
              <img
                src={nextIcon}
                alt=""
                aria-hidden="true"
                className="comparison__arrow comparison__arrow--right"
              />
            </div>
          </div>

          <p className="comparison__hint" id={descriptionId}>
            Drag the handle to reveal each screen. Switch to Full View
            to read the complete annotations.
          </p>
        </div>
      )}
    </div>
  );
}
