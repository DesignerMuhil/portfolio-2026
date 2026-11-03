import { useEffect, useRef } from "react";

const HOVER_SELECTOR =
  '[data-sound="hover"], [data-sound="both"]';

const CLICK_SELECTOR =
  '[data-sound="click"], [data-sound="both"]';

const HOVER_COOLDOWN = 70;

const useInterfaceSounds = ({
  enabled = true,
  hoverVolume = 0.12,
  clickVolume = 0.18,
} = {}) => {
  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  const unlockedRef = useRef(false);
  const lastHoverTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const hoverAudio = new Audio(
      new URL(
        "../assets/audio/ui-hover.mp3",
        import.meta.url
      ).href
    );

    const clickAudio = new Audio(
      new URL(
        "../assets/audio/ui-click.mp3",
        import.meta.url
      ).href
    );

    hoverAudio.preload = "auto";
    clickAudio.preload = "auto";

    hoverAudio.volume = hoverVolume;
    clickAudio.volume = clickVolume;

    hoverAudioRef.current = hoverAudio;
    clickAudioRef.current = clickAudio;

    const unlockAudio = () => {
      unlockedRef.current = true;

      hoverAudio.load();
      clickAudio.load();
    };

    const playSound = (audio) => {
      if (!audio || !unlockedRef.current) return;

      try {
        audio.pause();
        audio.currentTime = 0;

        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } catch {
        // Prevent audio errors from affecting the interface.
      }
    };

    const handlePointerOver = (event) => {
      if (event.pointerType === "touch") return;

      const target = event.target.closest(HOVER_SELECTOR);

      if (!target) return;

      if (
        event.relatedTarget &&
        target.contains(event.relatedTarget)
      ) {
        return;
      }

      const now = performance.now();

      if (
        now - lastHoverTimeRef.current <
        HOVER_COOLDOWN
      ) {
        return;
      }

      lastHoverTimeRef.current = now;

      playSound(hoverAudioRef.current);
    };

    const handleClick = (event) => {
      /*
       * First click also unlocks audio.
       * This allows the first MENU click to make a sound.
       */
      if (!unlockedRef.current) {
        unlockAudio();
      }

      const target = event.target.closest(CLICK_SELECTOR);

      if (!target) return;

      playSound(clickAudioRef.current);
    };

    const handleKeyDown = () => {
      if (!unlockedRef.current) {
        unlockAudio();
      }
    };

    document.addEventListener(
      "pointerover",
      handlePointerOver
    );

    document.addEventListener(
      "click",
      handleClick
    );

    window.addEventListener(
      "pointerdown",
      unlockAudio,
      { once: true }
    );

    window.addEventListener(
      "keydown",
      handleKeyDown,
      { once: true }
    );

    return () => {
      document.removeEventListener(
        "pointerover",
        handlePointerOver
      );

      document.removeEventListener(
        "click",
        handleClick
      );

      window.removeEventListener(
        "pointerdown",
        unlockAudio
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      hoverAudio.pause();
      clickAudio.pause();

      hoverAudioRef.current = null;
      clickAudioRef.current = null;
    };
  }, [enabled, hoverVolume, clickVolume]);
};

export default useInterfaceSounds;