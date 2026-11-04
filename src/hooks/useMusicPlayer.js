import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import playlist from "../data/playlist";

/* Default volume: 3% on mobile, 5% on larger screens */
const MOBILE_VOLUME = 0.00;
const DESKTOP_VOLUME = 0.01;

/* Music is desktop-only: disabled on tablets and phones (<= 1024px) */
const NO_MUSIC_QUERY = "(max-width: 1024px)";

const getMusicDisabled = () =>
  typeof window !== "undefined" &&
  window.matchMedia(NO_MUSIC_QUERY).matches;

const INITIAL_VOLUME =
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 768px)").matches
    ? MOBILE_VOLUME
    : DESKTOP_VOLUME;

const useMusicPlayer = () => {
  const audioRef = useRef(null);
  const shouldContinuePlayingRef = useRef(false);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolumeState] =
    useState(INITIAL_VOLUME);

  const [isMuted, setIsMuted] = useState(false);

  const [musicDisabled, setMusicDisabled] =
    useState(getMusicDisabled);

  /* =====================================================
     WATCH SCREEN SIZE (rotate / resize)
  ===================================================== */

  useEffect(() => {
    const media = window.matchMedia(NO_MUSIC_QUERY);

    const handleChange = () => {
      setMusicDisabled(media.matches);
    };

    handleChange();

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  /* =====================================================
     CREATE AUDIO  (skipped entirely on mobile / tablet)
  ===================================================== */

  useEffect(() => {
    if (musicDisabled) {
      shouldContinuePlayingRef.current = false;
      setIsPlaying(false);
      return undefined;
    }

    const audio = new Audio();

    audio.preload = "metadata";
    audio.volume = INITIAL_VOLUME;
    audio.muted = false;

    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0
      );
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      shouldContinuePlayingRef.current = true;

      setTrackIndex((index) => {
        return (index + 1) % playlist.length;
      });
    };

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "loadedmetadata",
      handleMetadata
    );

    audio.addEventListener(
      "durationchange",
      handleMetadata
    );

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.pause();

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "loadedmetadata",
        handleMetadata
      );

      audio.removeEventListener(
        "durationchange",
        handleMetadata
      );

      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audioRef.current = null;
    };
  }, [musicDisabled]);

  /* =====================================================
     LOAD CURRENT TRACK
  ===================================================== */

  useEffect(() => {
    const audio = audioRef.current;
    const track = playlist[trackIndex];

    if (musicDisabled || !audio || !track) {
      return;
    }

    const shouldPlay =
      shouldContinuePlayingRef.current;

    audio.pause();

    audio.src = track.src;
    audio.load();

    setCurrentTime(0);
    setDuration(0);

    if (shouldPlay) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [trackIndex, musicDisabled]);

  /* =====================================================
     VOLUME
  ===================================================== */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  /* =====================================================
     MUTE
  ===================================================== */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.muted = isMuted;
  }, [isMuted]);

  /* =====================================================
     START MUSIC

     Call from a real user interaction.
  ===================================================== */

  const startMusic = useCallback(() => {
    const audio = audioRef.current;

    if (musicDisabled || !audio) return;

    shouldContinuePlayingRef.current = true;

    audio.volume = INITIAL_VOLUME;

    setVolumeState(INITIAL_VOLUME);
    setIsMuted(false);

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        /*
         * Browser blocked playback.
         * Normal play button remains available.
         */
        shouldContinuePlayingRef.current = false;
        setIsPlaying(false);
      });
  }, [musicDisabled]);

  /* =====================================================
     PLAY / PAUSE
  ===================================================== */

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      shouldContinuePlayingRef.current = true;

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          shouldContinuePlayingRef.current = false;
          setIsPlaying(false);
        });

      return;
    }

    shouldContinuePlayingRef.current = false;

    audio.pause();

    setIsPlaying(false);
  }, []);

  /* =====================================================
     NEXT
  ===================================================== */

  const nextTrack = useCallback(() => {
    const audio = audioRef.current;

    shouldContinuePlayingRef.current =
      audio ? !audio.paused : false;

    setTrackIndex((index) => {
      return (index + 1) % playlist.length;
    });
  }, []);

  /* =====================================================
     SEEK
  ===================================================== */

  const seek = useCallback((value) => {
    const audio = audioRef.current;

    if (!audio) return;

    const nextTime = Number(value);

    if (!Number.isFinite(nextTime)) return;

    audio.currentTime = nextTime;

    setCurrentTime(nextTime);
  }, []);

  /* =====================================================
     SET VOLUME
  ===================================================== */

  const setVolume = useCallback((value) => {
    const nextVolume = Math.min(
      Math.max(Number(value), 0),
      1
    );

    if (!Number.isFinite(nextVolume)) return;

    setVolumeState(nextVolume);

    if (nextVolume > 0) {
      setIsMuted(false);
    }
  }, []);

  /* =====================================================
     MUTE
  ===================================================== */

  const toggleMute = useCallback(() => {
    setIsMuted((muted) => !muted);
  }, []);

  return {
    /* false on mobile / tablet: hide every music control */
    isMusicEnabled: !musicDisabled,

    currentTrack: playlist[trackIndex],

    trackIndex,
    trackCount: playlist.length,

    isPlaying,

    currentTime,
    duration,

    volume,
    isMuted,

    startMusic,
    togglePlay,
    nextTrack,
    seek,
    setVolume,
    toggleMute,
  };
};

export default useMusicPlayer;