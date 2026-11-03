import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";
import BlurText from "../../components/BlurText/BlurText";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import MenuOverlay from "../../components/MenuOverlay/MenuOverlay";
import HoverText from "../../components/HoverText/HoverText";
import useScrollTriggerRefresh from "../../hooks/useScrollTriggerRefresh";

import brandLogo from "../../assets/branding/logo.svg";
import menuIcon from "../../assets/icons/menu.svg";
import openLinkIcon from "../../assets/icons/open-link.svg";

/* TOOL ICONS — from src/assets/icons */
import figmaIcon from "../../assets/icons/figma.svg";
import photoshopIcon from "../../assets/icons/adobe-photoshop.svg";
import miroIcon from "../../assets/icons/miro.svg";
import mazeIcon from "../../assets/icons/maze 1.svg";
import afterEffectsIcon from "../../assets/icons/adobe-after-effects.svg";
import canvaIcon from "../../assets/icons/canva.svg";
import sketchIcon from "../../assets/icons/sketch.svg";
import hotjarIcon from "../../assets/icons/hotjar.svg";
import userbrainIcon from "../../assets/icons/UserBrain.svg";
import notionIcon from "../../assets/icons/notion.svg";
import gitIcon from "../../assets/icons/git.svg";
import chatgptIcon from "../../assets/icons/chatgpt.svg";
import perplexityIcon from "../../assets/icons/perplexity.svg";
import vscodeIcon from "../../assets/icons/visual-studio-code.svg";
   import bento1 from "../../assets/bento/bento-1.jpg";
   import bento2 from "../../assets/bento/bento-2.jpg";
   import bento3 from "../../assets/bento/bento-3.jpg";

/* BENTO IMAGES — put your photos in src/assets/bento/, then
   uncomment the imports and use them in PROCESS below.


*/

/* Keep this import last so About.css wins over component CSS */
import "./About.css";


/* ============================================================
   CONTENT — edit your text here
============================================================ */

/* Where the "View my work" link goes */
const WORKS_HREF = "/#work";

/* HERO */
const NAME = "Muhilarasan";
const PRONUNCIATION = "/mu·hi·la·ra·san/"; /* adjust to how you say it */

const BIO = [
  "Born and raised in Tamil Nadu, I'm a curious person who loves learning new things, exploring ideas, and trying different experiences.",
  "I think a lot, dream big, and enjoy finding happiness in small things. I believe everyone has their own journey in life, and there's no need to compare ourselves with others.",
  "I'm just here to keep learning, growing, and becoming a better version of myself.",
];

const LANGUAGES = {
  label: "Languages",
  lines: ["Tamil (native)", "English (fluent)", "Malayalam (learning)"],
};

/* JOURNEY — newest first. Add your work roles at the top:
   { title: "UX Designer", org: "Company", period: "Month YYYY — Present" } */
const JOURNEY = [
  { title: "jr Product Designer", org: "Neuronest AI pvt Ltd, Coimbatore", period: "Jun 2025 - Dec 2025" },
  { title: "UI/UX Design Intern", org: "CoderOne, Remote", period: "Dec 2024 - Jan 2025" },
  { title: "Frontend Developer Intern", org: "TechForge, Salem", period: "2 Months" },
  { title: "B.Tech, Information Technology", org: "KSRIET · with CGPA 7.52", period: "2021 - 2025" },
];

/* HOW I WORK — bento grid.
   kind "step":  a text card. tone: "dark" | "accent" | "light",
                 wide: true makes it span two columns.
   kind "image": a photo tile. Import an image at the top and set
                 `image: yourImport`. `null` shows an empty tile. */
const PROCESS = [
  {
    kind: "step",
    no: "01",
    title: "Understand",
    tone: "dark",
    text: "I start with the people and the problem: who this is for, and what they are trying to get done.",
  },
  { kind: "image", image: bento1, alt: "" }, /* image: bento1 */
  {
    kind: "step",
    no: "02",
    title: "Define",
    tone: "accent",
    text: "I turn what I learn into a clear problem statement, so everyone agrees on what to solve.",
  },
  { kind: "image", image: bento2, alt: "" }, /* image: bento2 */
  {
    kind: "step",
    no: "03",
    title: "Design",
    tone: "light",
    wide: true,
    text: "I sketch, wireframe and prototype in Figma, trying several ideas before I commit to one.",
  },
  {
    kind: "step",
    no: "04",
    title: "Test",
    tone: "dark",
    wide: true,
    text: "I test with real users, fix what confuses them, and repeat until the flow feels easy.",
  },
  { kind: "image", image: bento3, alt: "" }, /* image: bento3 */
];

/* TECH STACK
   Each tool has an `icon` field (imported at the top).
   `null` shows an empty square placeholder. */
  
const STACK_INTRO =
  "I pick tools for the job, not the trend. Figma for interface work, Photoshop for visual exploration, Miro for thinking together, Maze to test, and Claude to move faster. Each one supports how I think and design.";

const STACK_MAIN = [
  {
    name: "Figma",
    tag: "Design",
    icon: figmaIcon,
    text: "My home for wireframes, design systems and prototypes, with Dev Mode for clean handoff.",
  },
  {
    name: "Photoshop",
    tag: "Design",
    icon: photoshopIcon,
    text: "Image editing and visual exploration when an idea needs more than a layout.",
  },
  {
    name: "Miro",
    tag: "Collaboration",
    icon: miroIcon,
    text: "Journey maps, workshops and affinity mapping, so ideas evolve through shared thinking.",
  },
  {
    name: "Maze",
    tag: "Research and testing",
    icon: mazeIcon,
    text: "Quick usability tests on prototypes, so decisions rest on real behaviour.",
  },
  {
    name: "After Effects",
    tag: "Motion designs and reels",
    icon: afterEffectsIcon,
    text: "Motion graphics and animations to bring ideas to life, and create engaging reels for social media.",
  },
];

/* Scrolling row. After Effects is already in the main list. */
const STACK_MORE = [
  { name: "Canva",          icon: canvaIcon },
  { name: "Sketch",         icon: sketchIcon },
  { name: "Hotjar",         icon: hotjarIcon },
  { name: "UserBrain",      icon: userbrainIcon },
  { name: "Notion",         icon: notionIcon },
  { name: "Figma Dev Mode", icon: figmaIcon },
  { name: "Git",            icon: gitIcon },
  { name: "ChatGPT",        icon: chatgptIcon },
  { name: "Perplexity",     icon: perplexityIcon },
  { name: "Visual Studio",  icon: vscodeIcon },
];


/* Logo for a tool; an empty square if no icon is set yet */
function ToolIcon({ src, large }) {
  const cls = "about-icon" + (large ? " about-icon--lg" : "");

  return src ? (
    <img className={cls} src={src} alt="" aria-hidden="true" />
  ) : (
    <span className={cls + " about-icon--empty"} aria-hidden="true" />
  );
}


/* ============================================================
   MOTION PRESETS
============================================================ */

const BASE = {
  effect: "blur",
  direction: "bottom",
  staggerFrom: "start",
  trigger: "view",
  stepDuration: 0.3,
  blur: 8,
  distance: 16,
  threshold: 0.25,
};

const MARKER = { ...BASE, animateBy: "letters", delay: 22, distance: 8 };
const WORDS = { ...BASE, animateBy: "words", delay: 45 };
const LINE = { ...BASE, animateBy: "words", delay: 30 };

const NUMBER = {
  ...BASE,
  animateBy: "letters",
  delay: 110,
  distance: 48,
  blur: 14,
  stepDuration: 0.4,
  threshold: 0.3,
};


/* ============================================================
   SMALL PIECES
============================================================ */

function Marker({ children }) {
  return (
    <h2 className="about-marker">
      <BlurText as="span" text={children} {...MARKER} />
    </h2>
  );
}

function Fact({ label, lines }) {
  return (
    <div className="about-fact">
      <dt>
        <BlurText as="span" text={label} {...LINE} />
      </dt>

      <dd>
        {lines.map((line) => (
          <BlurText key={line} as="span" text={line} {...LINE} />
        ))}
      </dd>
    </div>
  );
}

/* Section: eyebrow on top, title under it (20px gap), then content. */
function Section({ marker, title, label, children }) {
  return (
    <section className="about-section" aria-label={label || title}>
      <header className="about-section__head">
        <Marker>{marker}</Marker>

        {title && (
          <h3 className="about-title">
            <BlurText as="span" text={title} {...WORDS} />
          </h3>
        )}
      </header>

      <div className="about-section__body">{children}</div>
    </section>
  );
}


/* CTA with a light rim that follows the cursor (pure CSS + a tiny
   pointer tracker, no WebGL). */
function GlowLink({ href, text, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const REACH = 320; /* px around the button where the light reacts */
    const REST = 0.35; /* idle brightness */
    let angle = 225;

    const aim = (x, y) => {
      const r = el.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const out = Math.hypot(
        Math.max(Math.abs(dx) - r.width / 2, 0),
        Math.max(Math.abs(dy) - r.height / 2, 0)
      );
      const t = Math.min(1, Math.max(0, 1 - out / REACH));
      const raw = (Math.atan2(dx, -dy) * 180) / Math.PI;

      if (t > 0) {
        /* keep the angle continuous so it never spins the long way round */
        angle += ((((raw - angle) % 360) + 540) % 360) - 180;
        el.style.setProperty("--glow-a", angle + "deg");
      }
      el.style.setProperty("--glow-n", String(REST + (1 - REST) * t * t * (3 - 2 * t)));
    };

    const onMove = (e) => aim(e.clientX, e.clientY);
    const onDown = () => el.style.setProperty("--glow-n", "1");
    const onLeave = () => el.style.setProperty("--glow-n", String(REST));

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <a ref={ref} className="about-cta" href={href} data-sound="both">
      <span className="about-cta__label">
        <HoverText text={text} />
        {children}
      </span>
    </a>
  );
}


/* ============================================================
   ABOUT PAGE
============================================================ */

export default function About({ musicPlayer }) {
  useScrollTriggerRefresh();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SiteFooter>
      <div className="about-page">

        {/* TOP BAR — same nav as Hero */}
        <header className="about-nav">
          <a className="about-nav__brand" href="/" aria-label="Home" data-sound="both">
            <img className="about-nav__logo" src={brandLogo} alt="Muhil" />
          </a>

          <button type="button" className="tech-button" aria-label="Open menu" data-sound="both" onClick={() => setMenuOpen(true)}>
            <span className="tech-button__corner tech-button__corner--tl" />
            <span className="tech-button__corner tech-button__corner--tr" />
            <span className="tech-button__corner tech-button__corner--bl" />
            <span className="tech-button__corner tech-button__corner--br" />

            <span className="tech-button__label">
              <HoverText text="MENU" />
            </span>
            <img className="hero__menu-icon" src={menuIcon} alt="" aria-hidden="true" />
          </button>
        </header>


        <main className="about-main">

          {/* HERO */}
          <section id="about" className="about-hero" aria-label="About">
            <ScrollReveal
              as="h1"
              mode="enter"
              effect="rise"
              baseRotation={0}
              enableBlur={false}
              duration={1.4}
              containerClassName="about-hero__title"
              textClassName="about-reveal-text"
            >
              <span className="about-quote-sans">The quiet kid with</span>
              <span className="about-quote-serif">
                The loudest imagination.
              </span>
            </ScrollReveal>

            <div className="about-hero__cols">
              <div className="about-bio-list">
                {BIO.map((text) => (
                  <ScrollReveal
                    key={text}
                    as="p"
                    baseRotation={0}
                    baseOpacity={0.2}
                    enableBlur={false}
                    stagger={0.04}
                    smoothing={0.8}
                    wordAnimationEnd="bottom 60%"
                    containerClassName="about-bio"
                    textClassName="about-reveal-text"
                  >
                    {text}
                  </ScrollReveal>
                ))}
              </div>

              <aside className="about-hero__aside">
                <div className="about-name">
                  <p className="about-name__hello">
                    <BlurText as="span" text="Hello, my name is" {...WORDS} />
                  </p>
                  <p className="about-name__name">
                    <BlurText as="span" text={NAME} {...WORDS} />
                  </p>
                  <p className="about-name__pron">
                    <BlurText as="span" text={PRONUNCIATION} {...WORDS} />
                  </p>
                </div>

                <dl>
                  <Fact {...LANGUAGES} />
                </dl>
              </aside>
            </div>
          </section>


          {/* PHILOSOPHY — the one bold moment */}
          <section
            className="about-philosophy"
            aria-label="Design philosophy"
          >
            <div className="about-numbers">
              <BlurText
                text="51"
                className="about-num about-num--ux"
                {...NUMBER}
              />
              <BlurText
                text="49"
                className="about-num about-num--ui"
                {...NUMBER}
              />
            </div>

            <div className="about-note">
              <Marker>[ PHILOSOPHY ]</Marker>

              <BlurText
                text="UX over UI."
                className="about-note__title"
                {...WORDS}
              />

              <BlurText
                text="Function first, form right behind it."
                className="about-note__text"
                {...WORDS}
              />
            </div>
          </section>


          {/* JOURNEY */}
          <Section
            marker="[ JOURNEY ]"
            title="Discover my journey in design"
          >
            <ul className="about-journey">
              {JOURNEY.map((item) => (
                <li className="about-journey__row" key={item.title}>
                  <h4 className="about-journey__title">
                    <BlurText as="span" text={item.title} {...LINE} />
                  </h4>

                  <p className="about-journey__meta">
                    <BlurText as="span" text={item.org} {...LINE} />
                    <BlurText as="span" text={item.period} {...LINE} />
                  </p>
                </li>
              ))}
            </ul>
          </Section>


          {/* HOW I WORK — bento grid */}
          <Section marker="[ HOW I WORK ]" title="From problem to tested solution">
            <ul className="about-bento">
              {PROCESS.map((item, i) =>
                item.kind === "image" ? (
                  <li
                    key={i}
                    className={
                      "about-bento__tile about-bento__image" +
                      (item.image ? "" : " about-bento__image--empty")
                    }
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.alt || ""} />
                    ) : (
                      <span className="about-bento__ph">[ IMAGE ]</span>
                    )}
                  </li>
                ) : (
                  <li
                    key={item.no}
                    className={
                      "about-bento__tile about-bento__card about-bento__card--" +
                      item.tone +
                      (item.wide ? " about-bento__card--wide" : "")
                    }
                  >
                    <span className="about-bento__no">{item.no}</span>

                    <div className="about-bento__copy">
                      <h4 className="about-bento__title">{item.title}</h4>
                      <p className="about-bento__text">{item.text}</p>
                    </div>
                  </li>
                )
              )}
            </ul>
          </Section>


          {/* TECH STACK — static main list + scrolling extras */}
          <Section marker="[ TECH STACK ]" title="My tech stack">
            <p className="about-stack-intro">
              <BlurText as="span" text={STACK_INTRO} {...WORDS} />
            </p>

            <ul className="about-stack-main">
              {STACK_MAIN.map((tool) => (
                <li className="about-stack-row" key={tool.name}>
                  <ToolIcon src={tool.icon} large />

                  <div className="about-stack-row__body">
                    <h4 className="about-stack-row__name">{tool.name}</h4>
                    <p className="about-stack-row__text">{tool.text}</p>
                  </div>

                  <span className="about-stack-row__tag">{tool.tag}</span>
                </li>
              ))}
            </ul>

            <div className="about-more">
              <h3 className="about-label">Also in my toolkit</h3>

              <div className="about-marquee">
                <ul className="about-marquee__track">
                  {[...STACK_MORE, ...STACK_MORE].map((tool, i) => (
                    <li
                      className="about-marquee__item"
                      key={tool.name + i}
                      aria-hidden={i >= STACK_MORE.length ? "true" : undefined}
                    >
                      <ToolIcon src={tool.icon} />
                      {tool.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <GlowLink href={WORKS_HREF} text="VIEW MY WORK">
              <img
                className="about-cta__icon"
                src={openLinkIcon}
                alt=""
                aria-hidden="true"
              />
            </GlowLink>
          </Section>

        </main>

        {/* MENU OVERLAY — portaled to <body> so About styles can't affect it */}
        {createPortal(
          <MenuOverlay
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            musicPlayer={musicPlayer}
          />,
          document.body
        )}

      </div>
    </SiteFooter>
  );
}