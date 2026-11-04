import { useEffect, useState } from "react";
import "./MenuOverlay.css";

import closeIcon from "../../assets/icons/close.svg";
import openLinkIcon from "../../assets/icons/open-link.svg";

import MusicPlayer from "../MusicPlayer/MusicPlayer";
import HoverText from "../HoverText/HoverText";


/* =========================================================
   NAVIGATION
========================================================= */

const NAV_ITEMS = [
  {
    label: "HOME",
    href: "#home",
  },
  {
    label: "WORK",
    href: "#work",
  },
  {
    label: "ABOUT",
    href: "/about",
  },
];


/* =========================================================
   CONNECT LINKS
========================================================= */

/* =========================================================
   CONNECT LINKS
========================================================= */

const SOCIAL_ITEMS = [
  {
    label: "RESUME",
    href: "/Muhil-Arasan-Resume.pdf",
    download: "Muhil-Arasan-Resume.pdf",
  },
  {
    label: "EMAIL",
    href: "mailto:dezignermuhil@gmail.com",
  },
  {
    label: "BEHANCE",
    href: "https://www.behance.net/muhilarasan2",
    external: true,
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/muhilarasan-manivannan-a65b022a8/",
    external: true,
  },
];


/* On any page other than home, "#home" / "#work" must point to "/#home" / "/#work" */
const resolveHref = (href) =>
  href.startsWith("#") && window.location.pathname !== "/"
    ? "/" + href
    : href;


/* =========================================================
   MENU OVERLAY
========================================================= */

const MenuOverlay = ({
  isOpen,
  onClose,
  musicPlayer,
}) => {
  const [shouldRender, setShouldRender] =
    useState(isOpen);

  const [isVisible, setIsVisible] =
    useState(false);

  const [activeHref, setActiveHref] =
    useState("");


  /* =======================================================
     OPEN / CLOSE ANIMATION
  ======================================================= */

  useEffect(() => {
    let frameOne;
    let frameTwo;
    let closeTimer;

    if (isOpen) {
      setShouldRender(true);

      frameOne = requestAnimationFrame(() => {
        frameTwo = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      document.body.style.overflow = "hidden";
    }

    else if (shouldRender) {
      setIsVisible(false);

      closeTimer = window.setTimeout(() => {
        setShouldRender(false);
      }, 760);

      document.body.style.overflow = "";
    }

    return () => {
      if (frameOne) {
        cancelAnimationFrame(frameOne);
      }

      if (frameTwo) {
        cancelAnimationFrame(frameTwo);
      }

      if (closeTimer) {
        clearTimeout(closeTimer);
      }

      document.body.style.overflow = "";
    };
  }, [isOpen, shouldRender]);


  /* =======================================================
     ACTIVE SECTION
     Runs each time the menu opens. The section that
     is at or above the middle of the screen is active.
     - Links that are not "#" anchors (like /about) are skipped.
     - Sections inside hidden scenes are skipped.
  ======================================================= */

  useEffect(() => {
    if (!isOpen) return;

    const middle = window.innerHeight / 2;

    let current = "";

    NAV_ITEMS.forEach((item) => {
      if (!item.href.startsWith("#")) return;

      const section =
        document.querySelector(item.href);

      if (!section) return;

      if (getComputedStyle(section).visibility === "hidden") {
        return;
      }

      if (
        section.getBoundingClientRect().top <= middle
      ) {
        current = item.href;
      }
    });

    setActiveHref(current);
  }, [isOpen]);


  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [shouldRender, onClose]);


  /* =======================================================
     DON'T RENDER UNTIL NEEDED
  ======================================================= */

  if (!shouldRender) {
    return null;
  }


  /* =======================================================
     COMPONENT
  ======================================================= */

  return (
    <div
      className={`menu-overlay ${
        isVisible
          ? "menu-overlay--open"
          : "menu-overlay--closing"
      }`}
    >

      {/* ===================================================
          BLURRED HERO BACKDROP
      ==================================================== */}

      <button
        className="menu-overlay__backdrop"
        type="button"
        aria-label="Close menu"
        onClick={onClose}
      />


      {/* ===================================================
          LEFT SIDE MUSIC PLAYER
      ==================================================== */}

      <div className="menu-overlay__audio-zone">

        {musicPlayer && (
          <MusicPlayer
            player={musicPlayer}
          />
        )}

      </div>


      {/* ===================================================
          RIGHT MENU PANEL
      ==================================================== */}

      <aside
        className="menu-panel"
        aria-label="Main navigation"
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <header className="menu-panel__header">

          <span className="menu-panel__eyebrow">
            MENU
          </span>


          <button
            className="menu-close"
            type="button"
            onClick={onClose}
            data-sound="both"
            aria-label="Close menu"
          >

            <span
              className="menu-close__corner menu-close__corner--tl"
              aria-hidden="true"
            />

            <span
              className="menu-close__corner menu-close__corner--tr"
              aria-hidden="true"
            />

            <span
              className="menu-close__corner menu-close__corner--bl"
              aria-hidden="true"
            />

            <span
              className="menu-close__corner menu-close__corner--br"
              aria-hidden="true"
            />

            <span className="menu-close__label">
              <HoverText text="CLOSE" />
            </span>

            <img
              className="menu-close__icon"
              src={closeIcon}
              alt=""
              aria-hidden="true"
            />

          </button>

        </header>


        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav
          className="menu-panel__nav"
          aria-label="Portfolio navigation"
        >

          {NAV_ITEMS.map((item, index) => {

            const isActive =
              activeHref === item.href;

            return (

              <a
                key={item.label}

                className={`menu-nav-item ${
                  isActive
                    ? "menu-nav-item--active"
                    : ""
                }`}

                href={resolveHref(item.href)}

                aria-current={
                  isActive ? "location" : undefined
                }

                onClick={onClose}

                data-sound="both"

                style={{
                  "--menu-delay":
                    `${160 + index * 70}ms`,
                }}
              >

                <span className="menu-nav-item__label">
                  <HoverText text={item.label} />
                </span>

              </a>

            );
          })}

        </nav>


        {/* =================================================
            BOTTOM AREA
        ================================================== */}

        <div className="menu-panel__bottom">


          {/* ===============================================
              CONNECT
          ================================================ */}

          <section className="menu-panel__connect">

            <div className="menu-panel__section-heading">
              CONNECT
            </div>


            <div className="menu-panel__socials">

              {SOCIAL_ITEMS.map((item, index) => {

                const isExternal =
                  Boolean(item.external);

                return (

                  <a
                    key={item.label}

                    className="menu-social"

                    href={item.href}

                    download={
                      item.download || undefined
                    }

                    target={
                      isExternal
                        ? "_blank"
                        : undefined
                    }

                    rel={
                      isExternal
                        ? "noopener noreferrer"
                        : undefined
                    }

                    data-sound="both"

                    style={{
                      "--social-delay":
                        `${430 + index * 45}ms`,
                    }}
                  >

                    <span
                      className="menu-social__index"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="menu-social__label">
                      <HoverText text={item.label} />
                    </span>

                    <img
                      className="menu-social__icon"
                      src={openLinkIcon}
                      alt=""
                      aria-hidden="true"
                    />

                  </a>

                );
              })}

            </div>

          </section>


          {/* ===============================================
              FOOTER
          ================================================ */}

          <footer className="menu-panel__footer">

            <div>
              <span>MUHIL</span>
              <span>PRODUCT DESIGNER</span>
            </div>

            <div>
              <span>PORTFOLIO</span>
              <span>2026</span>
            </div>

          </footer>

        </div>

      </aside>

    </div>
  );
};

export default MenuOverlay;