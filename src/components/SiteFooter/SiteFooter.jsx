import { useEffect, useRef, useState } from "react";

import "./SiteFooter.css";

import DecryptedText from "../DecryptedText/DecryptedText";

import downloadIcon from "../../assets/icons/download.svg";
import openLinkIcon from "../../assets/icons/open-link.svg";


/* =========================================================
   FOOTER LINKS
   Add your real links here when you have them.
   Empty = shown as plain text (not clickable) for now.

   Examples:
   message:  "mailto:you@example.com"
   cv:       "/Muhil-Arasan-Resume.pdf"
   phone:    "tel:+919344478374"
========================================================= */

const FOOTER_LINKS = {
  message: "mailto:dezignermuhil@gmail.com",
  cv: "/Muhil-Arasan-Resume.pdf",
  mail: "mailto:dezignermuhil@gmail.com",
  phone: "+91 9344478374",
  linkedin: "https://www.linkedin.com/in/muhilarasan-manivannan-a65b022a8/",
  instagram: "https://www.instagram.com/known.as.muhil/",
  behance: "https://www.behance.net/muhilarasan2",
  steam: "https://steamcommunity.com/profiles/76561199511203739/",
};


/* =========================================================
   HOVER DECRYPT SETTINGS
   Used for every button and link in the footer.
========================================================= */

const DECRYPT_PROPS = {
  animateOn: "hover",
  effect: "scramble",
  sequential: true,
  revealDirection: "start",
  speed: 35,
  scrambleColor: "#a5a0ff",
  characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  parentClassName: "site-footer__decrypt",
};


/* =========================================================
   MAGNETIC SNAP SETTINGS
========================================================= */

const SNAP_TRIGGER_DISTANCE = 20;   // px of scrolling before the glide starts
const SNAP_MIN_DURATION = 1000;     // ms (short distances)
const SNAP_MAX_DURATION = 1500;     // ms (long distances)
const SNAP_COOLDOWN = 500;          // ms to ignore leftover momentum afterwards


/* =========================================================
   SMALL HELPERS
========================================================= */

const isWebLink = (href) => /^https?:/i.test(href);

/* Ease-out quartic: confident start, long soft landing. */
const easeSilk = (t) => 1 - Math.pow(1 - t, 4);

function FooterIcon({ src }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      style={{
        width: 16,
        height: 16,
        display: "inline-block",
        verticalAlign: "middle",
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
  );
}

function FooterAction({
  href,
  download = false,
  icon,
  label,
}) {
  const content = (
    <>
      <DecryptedText text={label} {...DECRYPT_PROPS} />
      {icon && <FooterIcon src={icon} />}
    </>
  );

  if (!href) {
    return (
      <button type="button" className="site-footer__action">
        {content}
      </button>
    );
  }

  return (
    <a
      className="site-footer__action"
      href={href}
      download={download || undefined}
      target={isWebLink(href) ? "_blank" : undefined}
      rel={isWebLink(href) ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

/* =========================================================
   FOOTER LINK
   - copyText given  -> renders a button that copies the text
   - href given      -> renders a normal link
   - neither         -> renders plain text
========================================================= */

function FooterLink({ href, label, copyText }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  /* Clear the timer if the footer unmounts */
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (copyText) {
    return (
      <button
        type="button"
        className="site-footer__social-link"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
      >
        <DecryptedText
          text={copied ? "COPIED!" : label}
          {...DECRYPT_PROPS}
        />
      </button>
    );
  }

  const content = (
    <>
      <DecryptedText text={label} {...DECRYPT_PROPS} />
      <FooterIcon src={openLinkIcon} />
    </>
  );

  if (!href) {
    return (
      <span className="site-footer__social-link">
        {content}
      </span>
    );
  }

  return (
    <a
      className="site-footer__social-link"
      href={href}
      target={isWebLink(href) ? "_blank" : undefined}
      rel={isWebLink(href) ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}


/* =========================================================
   SITE FOOTER
   Wrap a page with <SiteFooter> ...page... </SiteFooter>
   The page sits above; the footer is revealed at the end.
========================================================= */

export default function SiteFooter({
  children,
  scrollContainer = null,
}) {
  const revealRef = useRef(null);


  /* =======================================================
     MAGNETIC SNAP
     Two resting positions:
       closed = end of the page, footer hidden
       open   = bottom of the page, footer fully revealed
     Scrolling into the reveal zone glides to the resting
     position in the scroll direction. While gliding, wheel
     and touch input is blocked so nothing fights the motion.
  ======================================================= */

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reduceMotion.matches) return undefined;

    const scroller = scrollContainer
      ? document.querySelector(scrollContainer)
      : null;

    const root = scroller || document.documentElement;
    const eventTarget = scroller || window;

    const getY = () =>
      scroller ? scroller.scrollTop : window.scrollY;

    const setY = (y) => {
      if (scroller) scroller.scrollTop = y;
      else window.scrollTo(window.scrollX, y);
    };

    let frame = 0;
    let animating = false;
    let cooldownUntil = 0;
    let lastY = getY();
    let previousScrollBehavior = "";

    const getBounds = () => {
      const reveal = revealRef.current;

      if (!reveal) return null;

      const height = reveal.offsetHeight;

      const openY = scroller
        ? scroller.scrollHeight - scroller.clientHeight
        : root.scrollHeight - window.innerHeight;

      const closedY = openY - height;

      /* Page too short for a reveal zone */
      if (closedY <= 0) return null;

      return { openY, closedY };
    };

    const finish = () => {
      animating = false;

      root.style.scrollBehavior = previousScrollBehavior;

      cooldownUntil = performance.now() + SNAP_COOLDOWN;
      lastY = getY();
    };

    const glideTo = (target) => {
      const startY = getY();
      const distance = target - startY;

      if (Math.abs(distance) < 2) return;

      const duration = Math.min(
        SNAP_MAX_DURATION,
        SNAP_MIN_DURATION + Math.abs(distance) * 0.5
      );

      const startTime = performance.now();

      animating = true;

      /* Make sure no CSS smooth-scroll fights the glide */
      previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";

      const step = (now) => {
        const progress = Math.min(
          1,
          (now - startTime) / duration
        );

        setY(startY + distance * easeSilk(progress));

        if (progress < 1) {
          frame = requestAnimationFrame(step);
        } else {
          finish();
        }
      };

      frame = requestAnimationFrame(step);
    };

    const handleScroll = () => {
      const y = getY();

      if (animating || performance.now() < cooldownUntil) {
        lastY = y;
        return;
      }

      const delta = y - lastY;
      lastY = y;

      const bounds = getBounds();

      if (!bounds || Math.abs(delta) < 1) return;

      const { openY, closedY } = bounds;

      /* Scrolling down into the footer zone */
      if (
        delta > 0 &&
        y > closedY + SNAP_TRIGGER_DISTANCE &&
        y < openY - 1
      ) {
        glideTo(openY);
      }

      /* Scrolling up out of the footer zone */
      else if (
        delta < 0 &&
        y < openY - SNAP_TRIGGER_DISTANCE &&
        y > closedY + 1
      ) {
        glideTo(closedY);
      }
    };

    /* Block input while gliding so nothing fights the motion */

    const blockInput = (event) => {
      if (animating && event.cancelable) {
        event.preventDefault();
      }
    };

    eventTarget.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    eventTarget.addEventListener("wheel", blockInput, {
      passive: false,
    });

    eventTarget.addEventListener("touchmove", blockInput, {
      passive: false,
    });

    return () => {
      cancelAnimationFrame(frame);

      if (animating) {
        root.style.scrollBehavior = previousScrollBehavior;
      }

      eventTarget.removeEventListener("scroll", handleScroll);
      eventTarget.removeEventListener("wheel", blockInput);
      eventTarget.removeEventListener("touchmove", blockInput);
    };
  }, [scrollContainer]);


  return (
    <>
      <div className="site-footer-layer">{children}</div>

      <div
        ref={revealRef}
        className="site-footer-reveal"
        aria-hidden="true"
      />

      <div className="site-footer-underlay">
        <footer className="site-footer" id="site-footer">
          <div className="site-footer__upper">
            <div className="site-footer__left">
              <div className="site-footer__headline">
                <span className="site-footer__eyebrow">
                  HAVE SOMETHING IN MIND?
                </span>

                <h2>
                  LET’S CREATE
                  <br />
                  GOOD STUFF
                  <br />
                  TOGETHER
                </h2>
              </div>

              <div className="site-footer__actions">
                <FooterAction
                  href={FOOTER_LINKS.message}
                  label="SHOOT A MESSAGE"
                />

                <FooterAction
                  href={FOOTER_LINKS.cv}
                  download
                  icon={downloadIcon}
                  label="DOWNLOAD CV"
                />
              </div>
            </div>

            <div className="site-footer__links">
              <div className="site-footer__links-heading">
                <span>FIND ME ONLINE</span>
              </div>

              <div className="site-footer__social-rows">
                <div className="site-footer__social-row">
                  <span className="site-footer__social-category">
                    CONTACT
                  </span>

                  <FooterLink
                    href={FOOTER_LINKS.mail}
                    label="MAIL"
                  />

                  <FooterLink
                    copyText={FOOTER_LINKS.phone}
                    label="+91 93444 78374"
                  />
                </div>

                <div className="site-footer__social-row">
                  <span className="site-footer__social-category">
                    SOCIALS
                  </span>

                  <FooterLink
                    href={FOOTER_LINKS.linkedin}
                    label="LINKEDIN"
                  />

                  <FooterLink
                    href={FOOTER_LINKS.instagram}
                    label="INSTAGRAM"
                  />
                </div>

                <div className="site-footer__social-row">
                  <span className="site-footer__social-category">
                    OTHERS
                  </span>

                  <FooterLink
                    href={FOOTER_LINKS.behance}
                    label="BEHANCE"
                  />

                  <FooterLink
                    href={FOOTER_LINKS.steam}
                    label="STEAM"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="site-footer__bottom">
            <div
              className="site-footer__center-name"
              aria-label="DezignerMuhil"
            >
              DezignerMuhil
            </div>

            <div className="site-footer__bottom-meta">
              <span>
                © {new Date().getFullYear()} DEZIGNERMUHIL
              </span>

              <span>DESIGNED WITH INTENT</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}