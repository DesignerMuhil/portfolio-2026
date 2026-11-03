
import { useMemo, useState } from "react";
import InfiniteMenu from "../../components/InfiniteMenu/InfiniteMenu";
import backIcon from "../../assets/icons/back.svg";
import closeIcon from "../../assets/icons/close.svg";
import "./SocialCreatives.css";


const posterModules = import.meta.glob(
  "../../assets/social-creatives/*.{png,jpg,jpeg,webp,avif,gif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

export default function SocialCreatives() {
  const [selectedPoster, setSelectedPoster] = useState(null);

  const posters = useMemo(() => {
    return Object.entries(posterModules)
      .sort(([a], [b]) =>
        a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      )
      .map(([path, image], index) => ({
        image,
        title: `POSTER ${String(index + 1).padStart(2, "0")}`,
        description: path
          .split("/")
          .pop()
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]/g, " "),
      }));
  }, []);

  return (
    <main className="social-creatives-page">
      <header className="social-creatives-header">
        <a
          href="/#work"
          className="social-creatives-back"
          aria-label="Back to Work"
        >
          <img src={backIcon} alt="" />
          <span>BACK TO WORK</span>
        </a>

        <div className="social-creatives-heading">
          <span className="social-creatives-eyebrow">
            VISUAL DESIGN / GALLERY
          </span>
          <h1>SOCIAL CREATIVES</h1>
        </div>

        <span className="social-creatives-count">
          {String(posters.length).padStart(2, "0")} POSTERS
        </span>
      </header>

      <section
        className="social-creatives-gallery"
        aria-label="Social Creatives Interactive Gallery"
      >
        {posters.length > 0 ? (
          <InfiniteMenu
            items={posters}
            count={100}
            tileSize={0.7}
            roundness={0.12}
            zoom={1.5}
            pullBack={1.2}
            stretch={0.3}
            inertia={0.65}
            autoplay={0}
            grayscale={false}
            dim={0.25}
            intro={true}
            showInfo={false}
            theme="dark"
            accentColor="#a5a0ff"
            onItemClick={(item) => setSelectedPoster(item)}
          />
        ) : (
          <div className="social-creatives-empty">
            <h2>No posters found</h2>
            <p>Add images to src/assets/social-creatives/</p>
          </div>
        )}
      </section>

      <div className="social-creatives-hint">
        DRAG TO EXPLORE · CLICK TO VIEW POSTER
      </div>

      {selectedPoster && (
        <div
          className="social-creatives-lightbox"
          role="presentation"
          onClick={() => setSelectedPoster(null)}
        >
          <div
            className="social-creatives-lightbox-content"
            role="dialog"
            aria-modal="true"
            aria-label={selectedPoster.title}
            onClick={(event) => event.stopPropagation()}
          >
          <button
            type="button"
            className="social-creatives-lightbox-close"
            onClick={() => setSelectedPoster(null)}
            aria-label="Close poster"
          >
            <img src={closeIcon} alt="" />
          </button>
            <img
              src={selectedPoster.image}
              alt={selectedPoster.description}
            />
          </div>
        </div>
      )}
    </main>
  );
}
