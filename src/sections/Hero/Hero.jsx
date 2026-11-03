
import "./Hero.css";
import portrait from "../../assets/profile-pic.png";

const Hero = () => {
  return (
    <section className="hero" id="top">
      {/* GRID */}
      <div className="hero__grid" aria-hidden="true">
        <span className="hero__grid-v hero__grid-v--1" />
        <span className="hero__grid-v hero__grid-v--2" />
        <span className="hero__grid-v hero__grid-v--3" />
        <span className="hero__grid-h hero__grid-h--1" />
        <span className="hero__grid-h hero__grid-h--2" />
      </div>

      {/* LEFT ROLE */}
      <div className="hero__role">
        <span className="hero__micro">
          01 / INTRODUCTION
        </span>

        <div className="hero__role-chip">
          <span>PRODUCT</span>
          <span>DESIGNER</span>
        </div>
      </div>

      {/* QUOTE */}
      <div className="hero__statement">


        <h1 className="hero__statement-main">
          <span className="hero__quote-display">
            Between logic and
            <br />
            instinct,
          </span>

          <span className="hero__quote-hard">
            I DESIGN.
          </span>
        </h1>
      </div>

      {/* DESCRIPTION */}
      <p className="hero__statement-description">
        Turning complex ideas into intuitive digital experiences
        with clarity, character and intent.
      </p>

      {/* GIANT TYPE */}
      <div className="hero__name" aria-hidden="true">
        <span className="hero__name-line">
          MUHIL
        </span>

        <span className="hero__name-line hero__name-line--outline">
          ARASAN
        </span>
      </div>



      {/* PORTRAIT */}
      <figure className="hero__portrait">
        <img
          src={portrait}
          alt="Muhil, product designer"
          draggable="false"
        />
      </figure>



      
    </section>
  );
};

export default Hero;
