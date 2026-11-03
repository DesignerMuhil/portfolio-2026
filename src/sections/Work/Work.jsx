import { useEffect, useRef, useState } from "react";
import "./Work.css";

import SiteFooter from "../../components/SiteFooter/SiteFooter";

import nextIcon from "../../assets/icons/next.svg";
import linkedinIcon from "../../assets/icons/linkedin.svg";
import instagramIcon from "../../assets/icons/instagram.svg";
import brandOSThumbnail from "../../assets/thumbnail/BrandOS.png";
import codingalThumbnail from "../../assets/thumbnail/Codingal.png";
import tripGenieThumbnail from "../../assets/thumbnail/TripGenie.png";
import dirttRiotThumbnail from "../../assets/thumbnail/DirtRiot.png";
import sdreamThumbnail from "../../assets/thumbnail/Sdream.png";
import SpendlyThumbnail from "../../assets/thumbnail/Spendly[V1].png";
import FlowpilotThumbnail from "../../assets/thumbnail/FlowPiolet.png";
import auraNestThumbnail from "../../assets/thumbnail/AuraNest.png";
import withLuvThumbnail from "../../assets/thumbnail/withLuv.png";
import portfolio2024Thumbnail from "../../assets/thumbnail/Portfolio(2024).png";
import SocialThumbnail from "../../assets/thumbnail/Socials.png";
import JuristbotThumbnail from "../../assets/thumbnail/Juristbot.png";
import DiginestThumbnail from "../../assets/thumbnail/Diginest.png";


/*
  EDIT YOUR PROJECTS HERE.

  Categories stay separate.
  Each category starts a fresh row.

  Add your actual image paths and links
  when you're ready.
*/

const projectGroups = [
  {
    id: "case-study",
    number: "01",
    label: "CASE STUDIES",
    projects: [
      {
        title: "BrandOS, A Decision-Driven AI Branding System",
        category: "CASE STUDY",
        image: brandOSThumbnail,
        href: "https://www.behance.net/gallery/246682941/BrandOS-A-Decision-Driven-AI-Branding-System",
      },
      {
        title: "Codingal, Interactive Learning Platform (Assessment)",
        category: "CASE STUDY",
        image: codingalThumbnail,
        href: "https://www.behance.net/gallery/255050169/Codingal-Hero-Section-Redesign-Design-Assessment",
      },
      {
        title: "TripGenie, Travel Partner App (AI Integration)",
        category: "CASE STUDY",
        image: tripGenieThumbnail,
        href: "https://www.behance.net/gallery/226218371/TripGenie-Travel-partner-app-ft-AI",
      },
    ],
  },
  {
    id: "in-employment",
    number: "02",
    label: "PROFESSIONAL WORK",
    projects: [
      {
        title: "JuristBot AI",
        category: "LEGALTECH / UX REDESIGN",
        image: JuristbotThumbnail,
        href: "/projects/juristbot",
      },
      {
        title: "Diginest 2.0",
        category: "SAAS / PRODUCT DESIGN",
        image: DiginestThumbnail,
        href: "/projects/diginest",
      },
    ],
  },
  {
    id: "ui-crafts",
    number: "03",
    label: "UI CRAFTS",
    projects: [
      {
        title: "DirtRiot, e-bike Landing Page",
        category: "AI / PRODUCT DESIGN",
        image: dirttRiotThumbnail,
        href: "https://www.behance.net/gallery/227597379/DirtRiot-e-bike",
      },
      {
        title: "Sdream, Streaming platform Landing Page",
        category: "AI / PRODUCT DESIGN",
        image: sdreamThumbnail,
        href: "https://www.behance.net/gallery/216527099/SDream-Static-Web-Design-for-a-Live-Streaming-Platform",
      },
      {
        title: "Spendly, Expense Tracking App",
        category: "FINANCIAL / PRODUCT DESIGN",
        image: SpendlyThumbnail,
        href: "https://www.behance.net/gallery/249557039/Spendly-AI-Powered-Financial-Behaviour-Tracker",
      },
      {
        title: "Flowpilot, Workflow Automation Tool",
        category: "SAAS / PRODUCT DESIGN",
        image: FlowpilotThumbnail,
        href: "https://www.behance.net/gallery/226678293/FlowPilot-Workflow-Automation-SaaS-Website-Design",
      },
      {
        title: "AuraNest, Emotion-Powered Lighting for Every Mood",
        category: "IOT / PRODUCT DESIGN",
        image: auraNestThumbnail,
        href: "https://www.behance.net/gallery/227462481/AURA-Emotion-Powered-Lighting-for-Every-Mood",
      },
      {
        title: "WithLuv, Online Giftshop App",
        category: "IOT / PRODUCT DESIGN",
        image: withLuvThumbnail,
        href: "https://www.behance.net/gallery/195688675/Mobile-application-for-online-giftshop",
      },
      {
        title: "Portfolio 2024",
        category: "VISUAL DESIGN / GALLERY",
        image: portfolio2024Thumbnail,
        href: "https://www.behance.net/gallery/195688859/DeZignerMuhil-Portfolio",
      },

    ],
  },
  {
    id: "social-creatives",
    number: "04",
    label: "SOCIAL CREATIVES",
    projects: [
      {
        title: "Social Creatives",
        category: "VISUAL DESIGN / GALLERY",
        image: SocialThumbnail,
        href: "/projects/social-creatives",
      },
    ],
  },
];

/* SVG ICON */

function WorkIcon({ src, className = "" }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
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

/* PROJECT CARD */

function ProjectCard({ project, index }) {
  const [imageFailed, setImageFailed] = useState(false);

  const content = (
    <>
      <div
        className="work-card__image-wrap work-project-target"
        data-cursor-label={
          project.href ? "VIEW PROJECT" : "VIEW"
        }
      >
        {project.image && !imageFailed ? (
          <img
            src={project.image}
            alt={`${project.title} project view`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="work-card__fallback">
            <span>
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong>{project.title}</strong>
          </div>
        )}

        

        <span className="work-card__corner work-card__corner--tl" />
        <span className="work-card__corner work-card__corner--tr" />
        <span className="work-card__corner work-card__corner--bl" />
        <span className="work-card__corner work-card__corner--br" />
      </div>

      <div className="work-card__info">
        <h3>{project.title}</h3>
      </div>
    </>
  );

  return (
    <article className="work-card">
      {project.href ? (
        <a
          className="work-card__link"
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title}`}
        >
          {content}
        </a>
      ) : (
        <div className="work-card__link work-card__link--static">
          {content}
        </div>
      )}
    </article>
  );
}

/* WORK PAGE */

export default function Work() {
  const groupRefs = useRef({});

  const [activeCategory, setActiveCategory] =
    useState("case-study");

  const scrollToCategory = (id) => {
    const target = groupRefs.current[id];

    const container = document.querySelector(
      ".horizontal-page__scene--work"
    );

    if (!target || !container) return;

    container.dispatchEvent(
      new Event("work-category-navigation")
    );

    const destination =
      container.scrollTop +
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      95;

    container.scrollTo({
      top: Math.max(0, destination),
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
    });

    setActiveCategory(id);
  };

  /* PERF FIX: highlight the active category using cached positions
     (no layout measuring on every scroll event). */
  useEffect(() => {
    const container = document.querySelector(
      ".horizontal-page__scene--work"
    );

    if (!container) return;

    let tops = [];
    let height = 0;
    let waiting = false;

    const measure = () => {
      const base =
        container.getBoundingClientRect().top -
        container.scrollTop;

      tops = projectGroups
        .map((group) => {
          const node = groupRefs.current[group.id];
          if (!node) return null;
          return {
            id: group.id,
            top: node.getBoundingClientRect().top - base,
          };
        })
        .filter(Boolean);

      height = container.clientHeight;
    };

    const update = () => {
      waiting = false;
      if (!tops.length) return;

      const line = container.scrollTop + height * 0.35;
      let current = tops[0].id;

      for (const item of tops) {
        if (item.top <= line) current = item.id;
      }

      setActiveCategory((previous) =>
        previous === current ? previous : current
      );
    };

    const onScroll = () => {
      if (waiting) return;
      waiting = true;
      requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      update();
    });

    resizeObserver.observe(container);
    if (container.firstElementChild) {
      resizeObserver.observe(container.firstElementChild);
    }

    container.addEventListener("scroll", onScroll, {
      passive: true,
    });

    measure();
    update();

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* PERF FIX: decode the thumbnails a moment after load,
     so they don't freeze the page when first scrolled into view. */
  useEffect(() => {
    const timer = setTimeout(() => {
      projectGroups
        .flatMap((group) => group.projects)
        .forEach((project) => {
          if (!project.image) return;
          const img = new Image();
          img.src = project.image;
          img.decode?.().catch(() => {});
        });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SiteFooter scrollContainer=".horizontal-page__scene--work">
    <section
      className="work"
      id="work"
      aria-label="Selected work"
    >
      {/* WORK GALLERY */}
      <div className="work__gallery">
        <div className="work__layout">
          {/* STICKY LEFT COLUMN */}
          <aside className="work__intro">
            <div className="work__intro-sticky">
              <span className="work__badge">
                PROUDEST WORKS
              </span>

              <h2>MY WORK</h2>

              <nav
                className="work__categories"
                aria-label="Project categories"
              >
                {projectGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    className={`work__category ${
                      activeCategory === group.id
                        ? "work__category--active"
                        : ""
                    }`}
                    onClick={() =>
                      scrollToCategory(group.id)
                    }
                  >
                    <span>{group.label}</span>

                    <span>
                      (
                      {String(
                        group.projects.length
                      ).padStart(2, "0")}
                      )
                    </span>
                  </button>
                ))}
              </nav>

              <p className="work__description">
                Selected projects, products and visual
                explorations.
              </p>
            </div>
          </aside>

          {/* PROJECT CONTENT */}
          <div className="work__content">
            {projectGroups.map((group) => (
              <section
                key={group.id}
                className="work__group"
                id={`work-${group.id}`}
                ref={(node) => {
                  if (node) {
                    groupRefs.current[group.id] = node;
                  }
                }}
                aria-label={group.label}
              >
                <header className="work__group-heading">
                  <div className="work__group-title">
                    <span className="work__group-number">
                      ({group.number})
                    </span>

                    <h3>{group.label}</h3>
                  </div>

                  <span className="work__group-count">
                    {String(
                      group.projects.length
                    ).padStart(2, "0")}{" "}
                    {group.projects.length === 1
                      ? "PROJECT"
                      : "PROJECTS"}
                  </span>
                </header>

                <div className="work__projects">
                  {group.projects.map(
                    (project, index) => (
                      <ProjectCard
                        key={`${group.id}-${index}`}
                        project={project}
                        index={index}
                      />
                    )
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
    </SiteFooter>
  );
}