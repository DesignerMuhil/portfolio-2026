import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useScrollTriggerRefresh() {
  useEffect(() => {
    let timer;

    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(refresh)
        : null;

    observer?.observe(document.body);
    window.addEventListener("load", refresh);

    refresh();

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener("load", refresh);
    };
  }, []);
}