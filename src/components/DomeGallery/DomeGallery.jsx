
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import "./DomeGallery.css";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export default function DomeGallery({
  images = [],
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = "#101010",
  maxVerticalRotationDeg = 5,
  dragSensitivity = 20,
  enlargeTransitionMs = 300,
  segments = 35,
  dragDampening = 2,
  openedImageWidth = "min(440px, 82vw)",
  openedImageHeight = "min(560px, 72dvh)",
  imageBorderRadius = "12px",
  openedImageBorderRadius = "12px",
  grayscale = false,
}) {
  const rootRef = useRef(null);
  const dragRef = useRef({ x: 0, y: 0 });
  const momentumRef = useRef(0);
  const frameRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [openedImage, setOpenedImage] = useState(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const updateSize = () => {
      const rect = root.getBoundingClientRect();
      setViewport({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!openedImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenedImage(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openedImage]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const imageList = useMemo(
    () =>
      images
        .map((image, index) =>
          typeof image === "string"
            ? { src: image, alt: `Creative poster ${index + 1}` }
            : image
        )
        .filter((image) => image?.src),
    [images]
  );

  const columns = Math.max(8, Math.floor(segments));
  const rows = Math.max(4, Math.round(columns / 2));

  const radius = useMemo(() => {
    const { width, height } = viewport;
    if (!width || !height) return minRadius;

    const basis =
      fitBasis === "width"
        ? width
        : fitBasis === "height"
          ? height
          : Math.min(width, height);

    const fittedRadius = basis / Math.max(0.1, fit);
    return clamp(fittedRadius, minRadius, maxRadius);
  }, [viewport, fit, fitBasis, minRadius, maxRadius]);

  const items = useMemo(() => {
    if (!imageList.length) return [];

    const result = [];
    const latStart = -65;
    const latEnd = 65;

    for (let row = 0; row < rows; row++) {
      const latitude =
        latStart + ((row + 0.5) / rows) * (latEnd - latStart);

      for (let col = 0; col < columns; col++) {
        const longitude = (col / columns) * 360;
        const imageIndex = (row * columns + col) % imageList.length;

        result.push({
          ...imageList[imageIndex],
          id: `${row}-${col}`,
          latitude,
          longitude,
        });
      }
    }

    return result;
  }, [imageList, rows, columns]);

  const tileWidth = Math.min(
  210,
  Math.max(120, (2 * Math.PI * radius) / columns * 0.65)
);

  const tileHeight = Math.max(
    100,
    (Math.PI * radius) / rows * (1 - padFactor * 0.5)
  );

  const stopMomentum = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const startMomentum = useCallback(
    (velocityX, velocityY) => {
      stopMomentum();

      let vx = velocityX;
      let vy = velocityY;
      let previousTime = performance.now();

      const animate = (now) => {
        const dt = Math.min((now - previousTime) / 16.67, 2);
        previousTime = now;

        const decay = Math.pow(0.94, dt * dragDampening);
        vx *= decay;
        vy *= decay;

        if (Math.abs(vx) + Math.abs(vy) < 0.005) {
          frameRef.current = null;
          return;
        }

        setRotation((current) => ({
          x: clamp(
            current.x + vy * dt,
            -maxVerticalRotationDeg,
            maxVerticalRotationDeg
          ),
          y: current.y + vx * dt,
        }));

        frameRef.current = requestAnimationFrame(animate);
      };

      frameRef.current = requestAnimationFrame(animate);
    },
    [dragDampening, maxVerticalRotationDeg, stopMomentum]
  );

  const bind = useDrag(
    ({ first, last, movement, velocity, direction, tap }) => {
      if (openedImage || tap) return;

      if (first) {
        stopMomentum();
        dragRef.current = { ...rotation };
      }

      const sensitivity = Math.max(1, dragSensitivity);

      setRotation({
        x: clamp(
          dragRef.current.x - movement[1] / sensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        ),
        y: dragRef.current.y + movement[0] / sensitivity,
      });

      if (last) {
        const vx = (velocity[0] * direction[0] * 2) / sensitivity;
        const vy = (-velocity[1] * direction[1] * 2) / sensitivity;
        startMomentum(vx, vy);
      }
    },
    {
      pointer: { touch: true },
      filterTaps: true,
      threshold: 3,
    }
  );

  const openImage = (image) => {
    stopMomentum();
    setOpenedImage(image);
  };

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{
        "--sphere-bg": overlayBlurColor,
        "--sphere-image-radius": imageBorderRadius,
        "--sphere-open-radius": openedImageBorderRadius,
        "--sphere-transition": `${enlargeTransitionMs}ms`,
      }}
    >
      <div
        className="sphere-stage"
        {...bind()}
        aria-label="Drag to rotate the gallery"
      >
        <div
          className="sphere-scene"
          style={{
            transform: `translateZ(${-radius}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="sphere-item"
              onClick={() => openImage(item)}
              aria-label={`Enlarge ${item.alt || "poster"}`}
              style={{
                width: `${tileWidth}px`,
                height: `${tileHeight}px`,
                transform: `rotateY(${item.longitude}deg) rotateX(${-item.latitude}deg) translateZ(${radius}px)`,
              }}
            >
              <img
                src={item.src}
                alt={item.alt || "Creative poster"}
                draggable="false"
                loading="lazy"
                style={{
                  filter: grayscale ? "grayscale(1)" : "none",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="sphere-edge-fade sphere-edge-fade--top" />
      <div className="sphere-edge-fade sphere-edge-fade--bottom" />

      {openedImage && (
        <div
          className="sphere-overlay"
          role="presentation"
          onClick={() => setOpenedImage(null)}
        >
          <div
            className="sphere-opened"
            role="dialog"
            aria-modal="true"
            aria-label={openedImage.alt || "Poster preview"}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: openedImageWidth,
              height: openedImageHeight,
            }}
          >
            <img
              src={openedImage.src}
              alt={openedImage.alt || "Creative poster"}
            />
            <button
              type="button"
              className="sphere-close"
              onClick={() => setOpenedImage(null)}
              aria-label="Close poster preview"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
