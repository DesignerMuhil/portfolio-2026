
import { useEffect } from "react";
import backIcon from "../../assets/icons/back.svg";
import openIcon from "../../assets/icons/open-link.svg";
import "./Diginest.css";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import useTextReveal from "../../hooks/useTextReveal";

const IMAGE_PATH = "/projects/diginest";

import ScrollFloat from "../../components/ScrollFloat/ScrollFloat";
import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";
import useScrollTriggerRefresh from "../../hooks/useScrollTriggerRefresh";


import {
  FLOAT_TITLE,
  REVEAL_BODY,
  REVEAL_HERO,
  REVEAL_HERO_BODY,
  DG_UNITS,
} from "../../components/ScrollText/scrollTextPresets";

const problems = [
  {
    title: "Too much happening at once",
    description:
      "Dense screens and unclear hierarchy made everyday tasks harder to scan.",
  },
  {
    title: "Not enough feedback",
    description:
      "Users could not always tell whether an action had worked or what happened next.",
  },
  {
    title: "Long, difficult workflows",
    description:
      "Important tasks involved too many steps, with limited ways to save progress.",
  },
  {
    title: "Unclear money movement",
    description:
      "Wallet activity and fund allocation were difficult for users to understand.",
  },
];

const interviews = [
  {
    role: "Business Owner",
    age: 34,
    experience: "Low tech",
    quote: "I just want to know if my message actually reached people.",
  },
  {
    role: "Support Executive",
    age: 26,
    experience: "Medium tech",
    quote:
      "Every time I switch between chats and tickets I lose my place.",
  },
  {
    role: "Marketing Manager",
    age: 31,
    experience: "High tech",
    quote:
      "The broadcast builder has too many steps and I can't save drafts.",
  },
  {
    role: "Operations Manager",
    age: 38,
    experience: "Medium tech",
    quote:
      "I added money to the wallet but I have no idea where it went.",
  },
];

const findings = [
  {
    title: "Simplicity over density",
    detail:
      "Show essential information first and reveal advanced options when needed.",
  },
  {
    title: "Feedback builds trust",
    detail:
      "Users need clear confirmation, status and next-step guidance.",
  },
  {
    title: "Visuals beat long explanations",
    detail:
      "Simple visual hierarchy makes complex workflows easier to understand.",
  },
  {
    title: "Pricing needs transparency",
    detail:
      "Wallet balances and fund allocation should be easy to follow.",
  },
  {
    title: "Jargon creates friction",
    detail:
      "Use familiar language instead of technical product terminology.",
  },
  {
    title: "Recovery matters",
    detail:
      "Drafts, auto-save and confirmation help prevent costly mistakes.",
  },
];

const decisions = [
  {
    title: "Make wallet allocation visible",
    description:
      "Help users understand how funds are assigned and where their money goes.",
  },
  {
    title: "Break long forms into steps",
    description:
      "Turn complex workflows into smaller, easier-to-complete actions.",
  },
  {
    title: "Save progress automatically",
    description:
      "Auto-save work every 30 seconds so users can continue without starting over.",
  },
  {
    title: "Show feedback in context",
    description:
      "Use contextual toasts to confirm actions without interrupting the workflow.",
  },
  {
    title: "Bring AI into the task",
    description:
      "Place AI content generation inside the broadcast creation flow.",
  },
  {
    title: "Protect important actions",
    description:
      "Add confirmation before destructive actions to reduce accidental changes.",
  },
];

const features = [
  "Meta Ads Manager",
  "Wallet fund allocation",
  "AI content generation",
  "Auto-save every 30 seconds",
  "Contextual toasts",
  "Status indicators",
];

const comparisons = [
  {
    title: "Profile",
    before: "profile-before.png",
    after: "profile-after.png",
    note: "Making account information easier to find and understand.",
  },
  {
    title: "Product demo",
    before: "product-demo-before.png",
    after: "product-demo-after.png",
    note: "Giving the workflow a clearer structure and visual hierarchy.",
  },
  {
    title: "Broadcast",
    before: "broadcast-before.png",
    after: "broadcast-after.png",
    note: "Reducing friction in one of the product's most important workflows.",
  },
  {
    title: "Appointments",
    before: "appointment-before.png",
    after: "appointment-after.png",
    note: "Making appointment booking easier to follow.",
  },
  {
    title: "Webbot",
    before: "webbot-before.png",
    after: "webbot-after.png",
    note: "Organising controls so users can navigate the experience more easily.",
  },
  {
    title: "Wallet",
    before: "wallet-before.png",
    after: "wallet-after.png",
    note: "Improving clarity around balances and fund allocation.",
  },
];

const lessons = [
  {
    title: "Clarity matters more than adding features",
    description:
      "A powerful product is only useful when people can understand how to use it.",
  },
  {
    title: "Small feedback moments matter",
    description:
      "Clear status and confirmation can make a complex product feel more reliable.",
  },
  {
    title: "Design for different confidence levels",
    description:
      "Not every user is comfortable with technical language or advanced workflows.",
  },
  {
    title: "Consistency helps a product scale",
    description:
      "Reusable patterns make a large product easier to maintain and learn.",
  },
  {
    title: "Validation should shape decisions",
    description:
      "Testing real tasks helps identify what needs improvement beyond visual polish.",
  },
];

function SectionHead({ index, label, title, description }) {
  return (
    <div className="dg-section-head">
      <div className="dg-section-head__copy">
        <ScrollFloat
          containerClassName="dg-float"
          textClassName="dg-float-text"
          {...FLOAT_TITLE}
        >
          {title}
        </ScrollFloat>

        {description && (
          <ScrollReveal
            as="p"
            containerClassName="dg-reveal"
            textClassName="dg-reveal-text"
            {...REVEAL_BODY}
          >
            {description}
          </ScrollReveal>
        )}
      </div>

      <div className="dg-section-head__index">
        <span>{index}</span>
        <span>{label}</span>
      </div>
    </div>
  );
}

function Screenshot({ src, alt }) {
  return (
    <a
      className="dg-shot"
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open full-size image: ${alt}`}
    >
      <span className="dg-shot__viewport">
        <img src={src} alt={alt} loading="lazy" />
      </span>

      <span className="dg-shot__open">
        <span>VIEW FULL SIZE</span>
        <img src={openIcon} alt="" aria-hidden="true" />
      </span>
    </a>
  );
}

export default function Diginest() {
  useScrollTriggerRefresh();
  useTextReveal(".dg-page", DG_UNITS);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SiteFooter>
    <main className="dg-page">
      {/* NAVIGATION */}
      <nav className="dg-nav">

        <a className="dg-nav__back" href="/#work">
          <img src={backIcon} alt="" aria-hidden="true" />
          BACK TO WORK
        </a>
      </nav>

      {/* HERO */}
      <header className="dg-hero dg-wrap">

        <div className="dg-hero__title-block">
          <p className="dg-overline">WHATSAPP BUSINESS PLATFORM / AI AUTOMATION</p>

          <h1>
            DIGINEST <span className="dg-hero__version"> AI</span>
          </h1>

                    <div className="dg-hero__summary">
            <ScrollReveal
              textClassName="dg-reveal-text"
              {...REVEAL_HERO}
            >
              Making a complex product simpler to use.
            </ScrollReveal>

            <ScrollReveal
              as="p"
              textClassName="dg-reveal-text"
              {...REVEAL_HERO_BODY}
            >
              A redesign of a WhatsApp Business SaaS platform to make
              everyday workflows clearer, faster and more reliable for
              small and medium businesses.
            </ScrollReveal>
          </div>
        </div>

        <div className="dg-hero__meta">
          <div>
            <span>MY ROLE</span>
            <strong>Independent Product Designer</strong>
          </div>
          <div>
            <span>TOOLS</span>
            <strong>Figma, Miro, UserBrain</strong>
          </div>
          <div>
            <span>PLATFORM</span>
            <strong>Web SaaS</strong>
          </div>
        </div>
      </header>

      {/* CONTEXT */}
      <section className="dg-section dg-context">
        <div className="dg-wrap">
          <SectionHead
            index="01"
            label="CONTEXT"
            title="The product had grown. The experience hadn't kept up."
            description="Diginest brings messaging, automation and business workflows into one platform. As the product expanded, users needed a clearer way to get things done."
          />

          <div className="dg-context__layout">
            <div className="dg-context__statement">
              <span className="dg-small-label">THE CHALLENGE</span>
              <p>
                How might we make a feature-heavy platform feel
                <em> simpler, more predictable and easier to use?</em>
              </p>
            </div>

            <div className="dg-context__scope">
              <span className="dg-small-label">MY CONTRIBUTION</span>
              <p>
                I worked as the solo product designer, improving existing
                workflows, introducing new features and building reusable
                UI patterns across the platform.
              </p>
            </div>
          </div>

          <div className="dg-scope-strip">
            <div>
              <strong>14</strong>
              <span>MODULES</span>
            </div>
            <div>
              <strong>100+</strong>
              <span>SCREENS</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>COMPONENTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="dg-section dg-problem-section">
        <div className="dg-wrap">
          <SectionHead
            index="02"
            label="THE PROBLEM"
            title="Useful features. Difficult everyday tasks."
            description="The main issue wasn't a lack of functionality. It was how much effort users needed to complete common actions."
          />

          <div className="dg-problem-list">
            {problems.map((problem, index) => (
              <article className="dg-problem-row" key={problem.title}>
                <span className="dg-row-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section className="dg-section dg-research">
        <div className="dg-wrap">
          <SectionHead
            index="03"
            label="USER RESEARCH"
            title="I listened for where people got stuck."
            description="Four user interviews helped identify the moments that created confusion, hesitation and repeated effort."
          />

          <div className="dg-research__layout">
            <div className="dg-research__aside">
              <span className="dg-small-label">INTERVIEW NOTES</span>
              <p>
                Different roles. Different comfort levels.
                Similar problems with clarity and control.
              </p>
              <span className="dg-research__count">04 / INTERVIEWS</span>
            </div>

            <div className="dg-quote-list">
              {interviews.map((person, index) => (
                <blockquote className="dg-quote" key={person.role}>
                  <span className="dg-row-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <p>“{person.quote}”</p>
                    <footer>
                      {person.role} · Age {person.age} ·{" "}
                      {person.experience}
                    </footer>
                  </div>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINDINGS */}
      <section className="dg-section dg-insights">
        <div className="dg-wrap">
          <SectionHead
            index="04"
            label="SYNTHESIS"
            title="Six things kept showing up."
            description="These patterns became the principles behind the redesign."
          />

          <div className="dg-insights__list">
            {findings.map((finding, index) => (
              <article key={finding.title}>
                <span className="dg-row-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{finding.title}</h3>
                  <p>{finding.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DECISIONS */}
      <section className="dg-section dg-decisions-section">
        <div className="dg-wrap">
          <SectionHead
            index="05"
            label="DESIGN DECISIONS"
            title="Less friction. More confidence."
            description="I focused on practical changes that would make the product easier to understand and use."
          />

          <div className="dg-decisions__intro">
            <span>DESIGN APPROACH</span>
            <p>
              Reduce unnecessary steps, explain system behaviour and help
              users recover when something goes wrong.
            </p>
          </div>

          <div className="dg-decision-list">
            {decisions.map((decision, index) => (
              <article key={decision.title}>
                <span className="dg-row-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{decision.title}</h3>
                <p>{decision.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN SYSTEM */}
      <section className="dg-section dg-system">
        <div className="dg-wrap">
          <SectionHead
            index="06"
            label="DESIGN SYSTEM"
            title="One product. A more consistent language."
            description="With a large number of modules and screens, reusable components and shared patterns were essential."
          />

          <div className="dg-system__layout">
            <div className="dg-system__note">
              <span className="dg-small-label">BUILDING FOR SCALE</span>
              <p>
                The aim was to make repeated interactions feel familiar,
                while giving new features a consistent foundation.
              </p>

              <div className="dg-system__metric">
                <strong>50+</strong>
                <span>REUSABLE COMPONENTS</span>
              </div>
            </div>

            <div className="dg-feature-list">
              <span className="dg-small-label">
                SIX FEATURES INTRODUCED
              </span>

              {features.map((feature, index) => (
                <div key={feature}>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="dg-section dg-comparisons">
        <div className="dg-wrap">
          <SectionHead
            index="07"
            label="THE REDESIGN"
            title="What changed on screen."
            description="A closer look at six workflows and how their interfaces evolved."
          />

          <div className="dg-comparison-list">
            {comparisons.map((item, index) => (
              <article className="dg-comparison" key={item.title}>
                <div className="dg-comparison__header">
                  <div>
                    <span className="dg-row-number">
                      {String(index + 1).padStart(2, "0")}
                      {" / 06"}
                    </span>
                    <h3>{item.title}</h3>
                  </div>

                  <p>{item.note}</p>
                </div>

                <div className="dg-comparison__screens">
                  <figure>
                    <figcaption>BEFORE / ORIGINAL</figcaption>
                    <Screenshot
                      src={`${IMAGE_PATH}/${item.before}`}
                      alt={`${item.title} before redesign`}
                    />
                  </figure>

                  <figure>
                    <figcaption>AFTER / REDESIGN</figcaption>
                    <Screenshot
                      src={`${IMAGE_PATH}/${item.after}`}
                      alt={`${item.title} after redesign`}
                    />
                  </figure>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="dg-section dg-results">
        <div className="dg-wrap">
          <SectionHead
            index="08"
            label="VALIDATION"
            title="The changes made a measurable difference."
            description="Usability testing across five flows helped evaluate the redesigned experience."
          />

          <div className="dg-results__lead">
            <div>
              <span className="dg-small-label">TASK SUCCESS RATE</span>
              <div className="dg-success-rate">
                <span>74%</span>
                <span className="dg-success-rate__arrow">→</span>
                <strong>96%</strong>
              </div>
              <p>From version 1 to version 2</p>
            </div>

            <div className="dg-results__sus">
              <span className="dg-small-label">SYSTEM USABILITY SCALE</span>
              <strong>78.5</strong>
              <p>SUS score</p>
            </div>
          </div>

          <div className="dg-results__flows">
            <div className="dg-results__flow">
              <span>BROADCAST CREATION</span>
              <div>
                <strong>5.5 min</strong>
                <span>→</span>
                <strong>2.5 min</strong>
              </div>
            </div>

            <div className="dg-results__flow">
              <span>APPOINTMENT BOOKING</span>
              <div>
                <strong>3.2 min</strong>
                <span>→</span>
                <strong>1.8 min</strong>
              </div>
            </div>

            <div className="dg-results__flow">
              <span>OVERALL TASK COMPLETION</span>
              <div>
                <strong>30–40% faster</strong>
              </div>
            </div>
          </div>

          <p className="dg-results__footnote">
            Task success rates compare v1 and v2 across five tested flows.
          </p>
        </div>
      </section>

      {/* REFLECTION */}
      <section className="dg-section dg-reflection">
        <div className="dg-wrap">
          <SectionHead
            index="09"
            label="REFLECTION"
            title="What I took away."
            description="Redesigning a large product changed how I think about clarity, consistency and everyday usability."
          />

          <div className="dg-reflection__layout">
            <div className="dg-reflection__aside">
              <span className="dg-small-label">PERSONAL NOTES</span>
              <p>
                Good product design isn't only about adding capability.
                It's about helping people feel confident using it.
              </p>
            </div>

            <div className="dg-lesson-list">
              {lessons.map((lesson, index) => (
                <article key={lesson.title}>
                  <span className="dg-row-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT NOTE */}
      <aside className="dg-project-note">
        <div className="dg-wrap">
          <span>PROJECT NOTE</span>
          <p>
            This case study focuses on the product design process,
            selected interface improvements and usability outcomes.
          </p>
        </div>
      </aside>
    </main>
    </SiteFooter>
  );
}
