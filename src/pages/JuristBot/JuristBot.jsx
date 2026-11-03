import { useEffect } from "react";
import nextIcon from "../../assets/icons/back.svg";
import openLinkIcon from "../../assets/icons/open-link.svg";
import "./JuristBot.css";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import ScrollFloat from "../../components/ScrollFloat/ScrollFloat";
import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";
import useScrollTriggerRefresh from "../../hooks/useScrollTriggerRefresh";
import useTextReveal from "../../hooks/useTextReveal";
import {
  FLOAT_TITLE,
  REVEAL_BODY,
  REVEAL_HERO,
  REVEAL_HERO_BODY,
  JB_UNITS,
} from "../../components/ScrollText/scrollTextPresets";

const ASSET = "/projects/juristbot";

/*
  Y2K SVGs:
  src/assets/y2k/01.svg ... 55.svg

  Uses Vite's asset URL imports.
*/
const y2kFiles = import.meta.glob("/src/assets/y2k/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const auditItems = [
  {
    title: "Landing page",
    score: 2,
    text: "The product's value was difficult to understand quickly. Messaging, visual hierarchy and calls to action needed more clarity.",
  },
  {
    title: "Registration",
    score: 1,
    text: "Seven mandatory fields and email verification made getting started unnecessarily demanding.",
  },
  {
    title: "Chat experience",
    score: 2,
    text: "A five-step greeting journey stood between users and the legal AI tools they came to use.",
  },
  {
    title: "Pricing",
    score: 1,
    text: "Credit-based pricing and plan differences were difficult to understand at a glance.",
  },
  {
    title: "Testimonials & FAQ",
    score: 2,
    text: "The experience needed stronger credibility signals and clearer supporting information.",
  },
  {
    title: "Accessibility",
    score: 2,
    text: "Contrast, typography and readability needed attention, particularly for legal professionals aged 45–60.",
  },
];

const competitorFindings = [
  {
    number: "01",
    title: "Familiar onboarding",
    description: "Seven of the eight legal AI platforms reviewed offered Google OAuth.",
  },
  {
    number: "02",
    title: "Content-led discovery",
    description: "Blogs and legal guides helped users understand the product and discover its capabilities.",
  },
  {
    number: "03",
    title: "Visible credibility",
    description: "Trust signals helped competing products communicate reliability.",
  },
  {
    number: "04",
    title: "Direct feature access",
    description: "Core tools were easier to discover without an introductory conversation.",
  },
];

const principles = [
  {
    number: "01",
    title: "Clarity first",
    description: "Make the next action obvious and reduce unnecessary decisions.",
  },
  {
    number: "02",
    title: "Accessible by default",
    description: "Prioritise readable typography, contrast and familiar interactions.",
  },
  {
    number: "03",
    title: "Progressive disclosure",
    description: "Ask for information when it is needed, not all at once.",
  },
  {
    number: "04",
    title: "Familiar patterns",
    description: "Use established conventions for signup, navigation and chat.",
  },
];

const selectedScreens = [
  {
    number: "01",
    title: "Chat experience",
    description: "Making core legal AI features easier to discover.",
    before: `${ASSET}/chatbot-before.png`,
    after: `${ASSET}/chatbot-after.png`,
  },
  {
    number: "02",
    title: "Landing page",
    description: "Improving the first impression and explaining the product more clearly.",
    before: `${ASSET}/landing-before.png`,
    after: `${ASSET}/landing-after.png`,
  },
  {
    number: "03",
    title: "Registration",
    description: "Reducing the information required to get started.",
    before: `${ASSET}/signup-before.png`,
    after: `${ASSET}/signup-after.png`,
  },
];

const reflections = [
  {
    number: "01",
    title: "Structure before screens",
    description: "The product's information architecture needed attention before visual refinement could make a meaningful difference.",
  },
  {
    number: "02",
    title: "Accessibility is essential",
    description: "Designing for readability and lower technical confidence helped make the experience clearer.",
  },
  {
    number: "03",
    title: "Internal testing has limits",
    description: "Internal testers helped reveal usability problems, but testing with practising legal professionals would offer stronger validation.",
  },
  {
    number: "04",
    title: "Constraints sharpen priorities",
    description: "The three-week timeline made it important to focus on the journeys with the greatest friction.",
  },
];

function Decoration({ number, className = "" }) {
  const filename = String(number).padStart(2, "0");
  const src = y2kFiles[`/src/assets/y2k/${filename}.svg`];

  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`jb-decoration ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

function Eyebrow({ number, children, light = false }) {
  return (
    <div className={`jb-eyebrow ${light ? "jb-eyebrow--light" : ""}`}>
      <span className="jb-eyebrow__dot" />
      {number && <span>{number} /</span>}
      <span>{children}</span>
    </div>
  );
}

function SectionHeading({ number, label, title, description }) {
  return (
    <div className="jb-section-heading">
      <div>
        <Eyebrow number={number}>{label}</Eyebrow>

        <ScrollFloat
          containerClassName="jb-float"
          textClassName="jb-float-text"
          {...FLOAT_TITLE}
        >
          {title}
        </ScrollFloat>
      </div>

      {description && (
        <ScrollReveal
          as="p"
          textClassName="jb-reveal-text"
          {...REVEAL_BODY}
        >
          {description}
        </ScrollReveal>
      )}
    </div>
  );
}

function AuditBars({ score, inverted = false }) {
  const total = 36;
  const active = Math.round((score / 5) * total);

  return (
    <div
      className={`jb-audit-bars ${inverted ? "is-inverted" : ""}`}
      role="img"
      aria-label={`${score} out of 5`}
    >
      {Array.from({ length: total }, (_, index) => (
        <i key={index} className={index < active ? "is-active" : ""} />
      ))}
    </div>
  );
}

function ImagePreview({ src, alt }) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="jb-image-preview"
      aria-label={`Open full-size image: ${alt}`}
    >
      <img src={src} alt={alt} loading="lazy" />

      <span className="jb-image-preview__action">
        VIEW FULL SIZE
        <img src={openLinkIcon} alt="" aria-hidden="true" />
      </span>
    </a>
  );
}

function BackLink({ children = "BACK TO WORK" }) {
  return (
    <a href="/#work" className="jb-back">
      <img src={nextIcon} alt="" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}

export default function JuristBot() {
   useScrollTriggerRefresh();
     useTextReveal(".jb-page", JB_UNITS);
  
useEffect(() => {
  const previousTitle = document.title;

  document.title = "JuristBot AI — Product Design Case Study";

  // Always start this page at the top.
  const previousScrollRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = "manual";

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });

  return () => {
    document.title = previousTitle;
    window.history.scrollRestoration = previousScrollRestoration;
  };
}, []);


  return (
    <SiteFooter>
    <div className="jb-page">
      {/* NAVIGATION */}

      <div className="jb-topbar">

        <BackLink />
      </div>

      <main>
        {/* 00 — MINIMAL HERO */}

        <section className="jb-hero">
          <div className="jb-container">
            <div className="jb-hero__top">
              <Eyebrow>PRODUCT DESIGN / CASE STUDY</Eyebrow>
              <span>NEURONEST AI Pvt, Coimbatore</span>
            </div>

            <div className="jb-hero__main">
              <div className="jb-hero__title-wrap">
                <h1 className="jb-hero__title">
                  JURISTBOT <span>AI.</span>
                </h1>

                <Decoration
                  number="21"
                  className="jb-hero__y2k"
                />
              </div>

                            <div className="jb-hero__intro">
                <ScrollReveal
                  textClassName="jb-reveal-text"
                  {...REVEAL_HERO}
                >
                  From friction
                  <br />
                  <em>to confidence.</em>
                </ScrollReveal>

                <ScrollReveal
                  as="p"
                  textClassName="jb-reveal-text"
                  {...REVEAL_HERO_BODY}
                >
                  An end-to-end redesign of a legal AI product,
                  focused on simpler onboarding, accessibility
                  and faster access to core features.
                </ScrollReveal>
              </div>
            </div>

            <div className="jb-hero__bottom">
              <span>SOLO PRODUCT DESIGNER - 3 WEEKS</span>

              <span>
                FIGMA  ·  AFTER EFFECTS  ·  PHOTOSHOP  ·  MAZE AI
              </span>
            </div>
          </div>
        </section>

        {/* 01 — CHALLENGE */}

        <section className="jb-challenge" id="challenge">
          <div className="jb-container">
            <SectionHeading
              number="01"
              label="THE CHALLENGE"
              title={
                <>
                  Powerful features.
                  <br />
                  <em>Difficult journeys.</em>
                </>
              }
              description="JuristBot AI supported legal drafting, scenario solving and judgment search. But the experience made these features harder to reach and understand."
            />

            <div className="jb-challenge__statement">
              <span>THE CORE PROBLEM</span>

              <p>
                Users had to spend too much time figuring
                out the product before starting their
                actual legal work.
              </p>

              <Decoration
                number="48"
                className="jb-challenge__decoration"
              />
            </div>

            <div className="jb-problem-list">
              <article>
                <span>01 / REGISTRATION</span>
                <strong>07</strong>
                <h3>Mandatory fields</h3>
                <p>
                  A lengthy registration process created
                  friction before first access.
                </p>
              </article>

              <article>
                <span>02 / CHATBOT</span>
                <strong>05</strong>
                <h3>Steps to reach a feature</h3>
                <p>
                  Repeated greeting interactions delayed
                  the start of meaningful work.
                </p>
              </article>

              <article>
                <span>03 / ACCESSIBILITY</span>
                <strong>2/5</strong>
                <h3>Original audit score</h3>
                <p>
                  Readability and contrast problems affected
                  the clarity of the experience.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 02 — AUDIT */}

        <section className="jb-audit" id="audit">
          <div className="jb-container">
            <SectionHeading
              number="02"
              label="UX AUDIT"
              title={
                <>
                  Six areas.
                  <br />
                  <em>One recurring problem.</em>
                </>
              }
              description="I reviewed the existing experience across six areas to understand where usability, clarity and trust were breaking down."
            />

            <div className="jb-audit-grid">
              {auditItems.map((item, index) => {
                const featured = index === 2;

                return (
                  <article
                    key={item.title}
                    className={`jb-audit-card ${
                      featured ? "jb-audit-card--featured" : ""
                    }`}
                  >
                    <span className="jb-audit-card__label">
                      {String(index + 1).padStart(2, "0")} / AUDIT
                    </span>

                    <h3>{item.title}</h3>

                    <div className="jb-audit-card__score">
                      <strong>{item.score}</strong>
                      <span>/5</span>
                    </div>

                    <AuditBars
                      score={item.score}
                      inverted={featured}
                    />

                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>

            <p className="jb-audit__note" style={{ marginTop: "32px" }}>
              Scores are from the original UX audit.
              Accessibility issues were considered against
              WCAG 2.1 AA expectations; no formal certification
              was established.
            </p>
          </div>
        </section>

        {/* 03 — COMPETITOR RESEARCH */}

        <section className="jb-research" id="research">
          <div className="jb-container">
            <SectionHeading
              number="03"
              label="COMPETITOR RESEARCH"
              title={
                <>
                  Eight platforms.
                  <br />
                  <em>Four useful findings.</em>
                </>
              }
              description="I reviewed eight legal AI platforms to understand familiar patterns for onboarding, product discovery and trust."
            />

            <div className="jb-research-layout">
              <div className="jb-research-stat">
                <span>THE CLEAREST PATTERN</span>

                <strong>
                  7<span>/8</span>
                </strong>

                <p>
                  Competitors offered Google OAuth.
                </p>

                <Decoration
                  number="47"
                  className="jb-research-stat__decoration"
                />
              </div>

              <div className="jb-research-findings">
                {competitorFindings.map((finding) => (
                  <article key={finding.number}>
                    <span>{finding.number}</span>

                    <div>
                      <h3>{finding.title}</h3>
                      <p>{finding.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="jb-research-transition">
              <span>RESEARCH → DIRECTION</span>
              <p>
                These findings shaped four principles
                for the redesign.
              </p>
            </div>
          </div>
        </section>

        {/* 04 — PRINCIPLES */}

        <section className="jb-principles" id="principles">
          <div className="jb-container">
            <Eyebrow number="04" light>
              DESIGN PRINCIPLES
            </Eyebrow>

            <h2>
              Clear decisions.
              <br />
              <em>Consistent direction.</em>
            </h2>

            <div className="jb-principle-list">
              {principles.map((principle) => (
                <article key={principle.number}>
                  <span>{principle.number}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </article>
              ))}
            </div>
          </div>

          <Decoration
            number="12"
            className="jb-principles__decoration"
          />
        </section>

        {/* 05 — DESIGN DECISIONS */}

        <section className="jb-redesign" id="redesign">
          <div className="jb-container">
            <SectionHeading
              number="05"
              label="THE REDESIGN"
              title={
                <>
                  Removing friction.
                  <br />
                  <em>Where it mattered most.</em>
                </>
              }
              description="Two important journeys show how the research shaped the redesign: getting into the product and reaching the right legal tool."
            />

            {/* SIGNUP */}

            <article className="jb-decision">
              <span
                className="jb-decision__background-number"
                aria-hidden="true"
              >
                01
              </span>

              <div className="jb-decision__heading">
                <div>
                  <Eyebrow>SIGNUP EXPERIENCE</Eyebrow>

                  <h3>
                    Less information.
                    <br />
                    Less hesitation.
                  </h3>
                </div>

                <p>
                  The original registration required seven
                  mandatory fields. I restructured the journey
                  around Google OAuth, essential information
                  and optional personalisation.
                </p>
              </div>

              <div className="jb-signup-visual">
                <div className="jb-signup-visual__before">
                  <span>BEFORE / ALL AT ONCE</span>

                  <div className="jb-signup-visual__field-list">
                    {[
                      "Name",
                      "Password",
                      "Confirm password",
                      "Mobile",
                      "Role",
                      "Referral",
                      "Submit",
                    ].map((field) => (
                      <span key={field}>{field}</span>
                    ))}
                  </div>
                </div>

                <div className="jb-signup-visual__after">
                  <span>AFTER / PROGRESSIVE FLOW</span>

                  <ol>
                    <li>Google OAuth</li>
                    <li>Name + mobile</li>
                    <li>Optional role</li>
                    <li>Optional personalisation</li>
                  </ol>
                </div>
              </div>

              <div className="jb-decision__conclusion">
                <span>DESIGN DECISION</span>
                <p>
                  Ask for essential information first.
                  Keep personalisation available without
                  making it a barrier to entry.
                </p>
              </div>
            </article>

            {/* CHATBOT */}

            <article className="jb-decision jb-decision--chat">
              <span
                className="jb-decision__background-number"
                aria-hidden="true"
              >
                02
              </span>

              <div className="jb-decision__heading">
                <div>
                  <Eyebrow>CHATBOT EXPERIENCE</Eyebrow>

                  <h3>
                    Get to the tool.
                    <br />
                    Not another greeting.
                  </h3>
                </div>

                <p>
                  Users had to complete a five-step greeting
                  journey before reaching the features
                  they came to use.
                </p>
              </div>

              <div className="jb-chat-visual">
                <div className="jb-chat-visual__before">
                  <span>BEFORE / FIVE STEPS</span>

                  <ol>
                    <li>Open chatbot</li>
                    <li>Type a greeting</li>
                    <li>Wait for response</li>
                    <li>Read available options</li>
                    <li>Select a feature</li>
                  </ol>

                  <strong>~30 sec</strong>
                </div>

                <div className="jb-chat-visual__after">
                  <span>AFTER / DIRECT ENTRY</span>

                  <div className="jb-chat-visual__chips">
                    <span>Scenario solving</span>
                    <span>Legal drafting</span>
                    <span>Cross Q&amp;A</span>
                    <span>Relevant judgments</span>
                  </div>

                  <strong>~3 sec</strong>
                </div>
              </div>

              <div className="jb-decision__conclusion">
                <span>DESIGN DECISION</span>
                <p>
                  Replace the repeated greeting with direct
                  feature selection. The timing figures are
                  estimates from the original case study,
                  not production analytics.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* 06 — SELECTED SCREENS */}

        <section className="jb-screens" id="screens">
          <div className="jb-container">
            <SectionHeading
              number="06"
              label="SELECTED SCREENS"
              title={
                <>
                  A few views.
                  <br />
                  <em>From a wider redesign.</em>
                </>
              }
              description="These screens illustrate selected changes. The project also covered research, journey restructuring, accessibility, interface design and validation."
            />

            <div className="jb-screen-gallery">
              {selectedScreens.map((screen) => (
                <article
                  className="jb-screen-item"
                  key={screen.number}
                >
                  <div className="jb-screen-item__heading">
                    <span>{screen.number}</span>

                    <div>
                      <h3>{screen.title}</h3>
                      <p>{screen.description}</p>
                    </div>
                  </div>

                  <div className="jb-screen-item__pair">
                    <figure>
                      <figcaption>BEFORE / ORIGINAL</figcaption>

                      <ImagePreview
                        src={screen.before}
                        alt={`Original JuristBot AI ${screen.title}`}
                      />
                    </figure>

                    <figure>
                      <figcaption>AFTER / REDESIGNED</figcaption>

                      <ImagePreview
                        src={screen.after}
                        alt={`Redesigned JuristBot AI ${screen.title}`}
                      />
                    </figure>
                  </div>
                </article>
              ))}

              <article className="jb-screen-item jb-screen-item--profile">
                <div className="jb-screen-item__heading">
                  <span>04</span>

                  <div>
                    <h3>Profile settings</h3>
                    <p>
                      A selected view of the redesigned
                      account experience.
                    </p>
                  </div>
                </div>

                <figure>
                  <figcaption>AFTER / REDESIGNED</figcaption>

                  <ImagePreview
                    src={`${ASSET}/profile-after.png`}
                    alt="Redesigned JuristBot AI profile settings"
                  />
                </figure>
              </article>
            </div>
          </div>
        </section>

        {/* 07 — VALIDATION */}

        <section className="jb-testing" id="testing">
          <div className="jb-container">
            <SectionHeading
              number="07"
              label="MAZE AI TESTING"
              title={
                <>
                  What worked.
                  <br />
                  <em>What needed refinement.</em>
                </>
              }
              description="I evaluated the redesigned experience using Maze AI with twelve internal testers across eight user flows."
            />

            <div className="jb-testing__metrics">
              <div>
                <strong>12</strong>
                <span>INTERNAL TESTERS</span>
              </div>

              <div>
                <strong>08</strong>
                <span>USER FLOWS</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>SUCCESS ON 4 CRITICAL FLOWS</span>
              </div>
            </div>

            <div className="jb-testing__content">
              <div className="jb-testing__successful">
                <span>CRITICAL FLOWS COMPLETED</span>

                <p>Sign-in</p>
                <p>Registration</p>
                <p>Feature navigation</p>
                <p>Blog navigation</p>
              </div>

              <div className="jb-testing__issues">
                <span>ISSUES IDENTIFIED</span>

                <article>
                  <strong>33.3%</strong>

                  <div>
                    <h3>Chatbot interaction drop-off</h3>
                    <p>
                      An onboarding tooltip was introduced.
                    </p>
                  </div>
                </article>

                <article>
                  <strong>33%</strong>

                  <div>
                    <h3>Profile setup misclicks</h3>
                    <p>
                      Label placement was refined.
                    </p>
                  </div>
                </article>

                <article>
                  <strong>13.6%</strong>

                  <div>
                    <h3>Subscription upgrade misclicks</h3>
                    <p>
                      Static selection indicators were added.
                    </p>
                  </div>
                </article>
              </div>
            </div>

            <p className="jb-testing__limitation">
              Testing limitation: these were internal testers,
              not a representative sample of practising legal
              professionals. The findings identify usability
              issues but do not establish post-launch impact.
            </p>
          </div>
        </section>

        {/* 08 — OUTCOMES */}

        <section className="jb-outcomes" id="outcomes">
          <div className="jb-container">
            <SectionHeading
              number="08"
              label="PROJECT OUTCOMES"
              title={
                <>
                  Progress,
                  <br />
                  <em>with context.</em>
                </>
              }
              description="The original case study reported improvements in internal evaluation and key user journeys. These figures distinguish testing results from estimated flow improvements."
            />

            <div className="jb-outcomes__feature">
              <div>
                <span>REPORTED UX EVALUATION</span>

                <strong>
                  8.6<small>/10</small>
                </strong>

                <p>
                  The original audit score was 2/5.
                  Because the scales differ, these values
                  are not presented as a calculated
                  percentage improvement.
                </p>
              </div>

              <Decoration
                number="38"
                className="jb-outcomes__decoration"
              />
            </div>

            <div className="jb-outcomes__figures">
              <article>
                <span>FEATURE ACCESS</span>
                <strong>30s → 3s</strong>
                <p>
                  Estimated reduction in time needed
                  to reach a core feature.
                </p>
              </article>

              <article>
                <span>INITIAL SIGNUP</span>
                <strong>7 → 2</strong>
                <p>
                  Required initial inputs reduced,
                  with optional details moved later.
                </p>
              </article>

              <article>
                <span>INTERNAL TESTING</span>
                <strong>4 / 4</strong>
                <p>
                  Four critical flows achieved complete
                  task success in internal testing.
                </p>
              </article>
            </div>

            <div className="jb-stakeholders">
              <div>
                <Eyebrow>STAKEHOLDER FEEDBACK</Eyebrow>

                <h3>
                  Beyond the
                  <br />
                  interface.
                </h3>
              </div>

              <div className="jb-stakeholders__list">
                <article>
                  <span>ENGINEERING</span>
                  <p>
                    The reusable component approach
                    supported implementation.
                  </p>
                </article>

                <article>
                  <span>SALES</span>
                  <p>
                    The redesigned experience was
                    perceived as more premium.
                  </p>
                </article>

                <article>
                  <span>CUSTOMER SUCCESS</span>
                  <p>
                    The team anticipated fewer support
                    requests. This was feedback, not
                    a measured reduction.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* 09 — REFLECTION */}

        <section className="jb-reflection" id="reflection">
          <div className="jb-container">
            <SectionHeading
              number="09"
              label="REFLECTION"
              title={
                <>
                  What I learned
                  <br />
                  <em>in three weeks.</em>
                </>
              }
              description="Four lessons from redesigning a complex product under a tight timeline."
            />

            <div className="jb-reflection__list">
              {reflections.map((item) => (
                <article key={item.number}>
                  <span>{item.number}</span>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="jb-reflection__next">
              <span>WHAT I WOULD VALIDATE NEXT</span>

              <p>
                Test the redesigned journeys with practising
                legal professionals to understand how they
                perform beyond internal testing.
              </p>

              <Decoration
                number="12"
                className="jb-reflection__decoration"
              />
            </div>
          </div>
        </section>

        {/* PROJECT NOTE */}

        <div className="jb-project-note">
          <div className="jb-container">
            <span>PROJECT NOTE</span>

            <p>
              Selected product screenshots are approved
              for public display. Additional prototypes
              and business workflows are not included
              in this case study.
            </p>
          </div>
        </div>
      </main>
    </div>
    </SiteFooter>
  );
}