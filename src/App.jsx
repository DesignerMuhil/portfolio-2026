
import { useEffect, useState } from "react";

import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import HorizontalPage from "./components/HorizontalPage/HorizontalPage";

import Hero from "./sections/Hero/Hero";
import Work from "./sections/Work/Work";

import JuristBot from "./pages/JuristBot/JuristBot";
import Diginest from "./pages/Diginest/Diginest";
import SocialCreatives from "./pages/SocialCreatives/SocialCreatives";
import About from "./pages/About/About";

import useInterfaceSounds from "./hooks/useInterfaceSounds";
import useMusicPlayer from "./hooks/useMusicPlayer";

import useDocumentTitle from "./hooks/useDocumentTitle";
import TITLES from "./config/pageTitles";

const PROJECT_ROUTES = [
  "/projects/juristbot",
  "/projects/diginest",
  "/projects/social-creatives",
  "/about",
];

function App() {
  const [loading, setLoading] = useState(true);
  const [pathname, setPathname] = useState(
    () => window.location.pathname
  );

  useInterfaceSounds({
    enabled: true,
    hoverVolume: 0.12,
    clickVolume: 0.10,
  });

  const musicPlayer = useMusicPlayer();

  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  const isJuristBot = normalizedPath === "/projects/juristbot";
  const isDiginest = normalizedPath === "/projects/diginest";
  const isSocialCreatives = normalizedPath === "/projects/social-creatives";
  const isAbout = normalizedPath === "/about";
  const isProjectPage = isJuristBot || isDiginest|| isAbout;
  
    const routeTitle = isJuristBot
    ? TITLES.juristbot
    : isDiginest
      ? TITLES.diginest
      : isSocialCreatives
        ? TITLES.socialCreatives
        : isAbout
          ? TITLES.about
          : undefined;

  useDocumentTitle(routeTitle);

  const handleEnterPortfolio = () => {
    musicPlayer.startMusic();
  };

  useEffect(() => {
    const updateRoute = () => {
      setPathname(window.location.pathname);
    };

    const handleNavigation = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target.closest("a[href]");

      if (!link || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href, window.location.href);

      if (url.origin !== window.location.origin) return;

      const targetPath = url.pathname.replace(/\/$/, "") || "/";
      const currentPath =
        window.location.pathname.replace(/\/$/, "") || "/";

      const goingToProject = PROJECT_ROUTES.includes(targetPath);

      const returningToWork =
        PROJECT_ROUTES.includes(currentPath) &&
        targetPath === "/" &&
        url.hash === "#work";

      const returningHome =
        PROJECT_ROUTES.includes(currentPath) &&
        targetPath === "/";

      if (
        !goingToProject &&
        !returningToWork &&
        !returningHome
      ) {
        return;
      }

      event.preventDefault();

      window.history.pushState(
        null,
        "",
        `${url.pathname}${url.search}${url.hash}`
      );

      if (returningToWork || returningHome) {
        setLoading(false);
      }

      updateRoute();
    };

    document.addEventListener("click", handleNavigation);
    window.addEventListener("popstate", updateRoute);

    return () => {
      document.removeEventListener("click", handleNavigation);
      window.removeEventListener("popstate", updateRoute);
    };
  }, []);

  useEffect(() => {
    if (isProjectPage) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [normalizedPath, isProjectPage]);

  if (isJuristBot) {
    return <JuristBot />;
  }

  if (isDiginest) {
    return <Diginest />;
  }

  if (isSocialCreatives) {
  return <SocialCreatives />;
  }
   if (isAbout) {
     return <About musicPlayer={musicPlayer} />;
   }

  return (
    <>
      {loading && (
        <LoadingScreen
          onEnter={handleEnterPortfolio}
          onComplete={() => setLoading(false)}
        />
      )}

      <main>
        <HorizontalPage>
          <Hero musicPlayer={musicPlayer} />
          <Work />
        </HorizontalPage>
      </main>
    </>
  );
}

export default App;
