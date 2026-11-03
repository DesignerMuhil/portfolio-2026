import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Loose text that isn't inside one of the listed blocks */
const TEXT_SELECTOR = "h2, h3, p, li, blockquote, figcaption";

const MEDIA_SELECTOR = "img, svg, picture, video, canvas";

/* Never animate anything inside these
   (already animated elsewhere, or should stay static) */
const SKIP_INSIDE = [
  ".scroll-float",
  ".scroll-reveal",
  "nav",
  "footer",
  "[class*='hero']",
  "[class*='topbar']",
].join(",");

export default function useTextReveal(
  rootSelector,
  units = [],
  {
    distance = 44,
    duration = 1.4,
    stagger = 0.12,
    start = "top 88%",
  } = {}
) {
  const unitSelector = units.join(",");

  useLayoutEffect(() => {
    const root = document.querySelector(rootSelector);

    if (!root) return undefined;

    const hasUnits = unitSelector !== "";
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const unitEls = hasUnits
        ? Array.from(root.querySelectorAll(unitSelector))
        : [];

      const textEls = Array.from(
        root.querySelectorAll(TEXT_SELECTOR)
      ).filter((el) => !el.querySelector(TEXT_SELECTOR));

      /* Only the outermost block animates,
         never a block inside another block */
      const insideUnit = (el) => {
        if (!hasUnits) return false;

        const parentUnit =
          el.parentElement?.closest(unitSelector);

        return Boolean(parentUnit && root.contains(parentUnit));
      };

      const hasContent = (el) =>
        el.textContent.trim() !== "" ||
        Boolean(el.querySelector(MEDIA_SELECTOR));

      const targets = Array.from(
        new Set([...unitEls, ...textEls])
      )
        .filter(
          (el) =>
            !el.closest(SKIP_INSIDE) &&
            !insideUnit(el) &&
            hasContent(el)
        )
        .sort((a, b) =>
          a.compareDocumentPosition(b) &
          Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1
        );

      if (!targets.length) return undefined;

      /* Keep each element's own CSS opacity as the end state */
      const finalOpacity = new Map(
        targets.map((el) => [
          el,
          parseFloat(getComputedStyle(el).opacity) || 1,
        ])
      );

      /* Stop CSS transitions from fighting the animation */
      targets.forEach((el) => {
        el.style.transition = "none";
      });

      gsap.set(targets, { opacity: 0, y: distance });

      const triggers = ScrollTrigger.batch(targets, {
        start,
        once: true,
        interval: 0.12,
        batchMax: 6,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: (_, el) => finalOpacity.get(el) ?? 1,
            y: 0,
            duration,
            ease: "power3.out",
            stagger,
            overwrite: true,
            clearProps: "opacity,transform",
            onComplete: () => {
              batch.forEach((el) => {
                el.style.transition = "";
              });
            },
          }),
      });

      return () => {
        triggers.forEach((trigger) => trigger.kill());

        targets.forEach((el) => {
          el.style.transition = "";
        });

        gsap.set(targets, {
          clearProps: "opacity,transform",
        });
      };
    });

    return () => mm.revert();
  }, [
    rootSelector,
    unitSelector,
    distance,
    duration,
    stagger,
    start,
  ]);
}