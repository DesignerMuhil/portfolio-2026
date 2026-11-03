import "./MusicPlayer.css";

import playIcon from "../../assets/icons/play.svg";
import pauseIcon from "../../assets/icons/pause.svg";
import nextIcon from "../../assets/icons/next.svg";
import volumeIcon from "../../assets/icons/volume.svg";
import muteIcon from "../../assets/icons/mute.svg"; // change the file name if yours is different

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

const MusicPlayer = ({ player }) => {
  const {
    isMusicEnabled = true,

    currentTrack,
    trackIndex,
    trackCount,

    isPlaying,

    currentTime,
    duration,

    volume,
    isMuted,

    togglePlay,
    nextTrack,
    seek,
    setVolume,
    toggleMute,
  } = player;

  /* No music UI on mobile / tablet */
  if (!isMusicEnabled || !currentTrack) return null;

  const remainingTime =
    duration > 0 ? Math.max(duration - currentTime, 0) : 0;

  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const trackNumber = String(trackIndex + 1).padStart(2, "0");
  const totalTracks = String(trackCount).padStart(2, "0");

  // Show the mute icon when muted OR when the slider is dragged to 0.
  // Remove `|| Number(volume) === 0` if you only want it on the mute button.
  const soundIcon =
    isMuted || Number(volume) === 0 ? muteIcon : volumeIcon;

  return (
    <div className="music-player">
      {/* COVER */}

      <img
        className="music-player__cover"
        src={currentTrack.cover}
        alt=""
        draggable="false"
      />

      {/* IMAGE SHADING */}

      <div className="music-player__shade" />

      {/* TOP */}

      <div className="music-player__top">
        <div className="music-player__track-pill">
          <div className="music-player__mini-cover">
            <img src={currentTrack.cover} alt="" draggable="false" />
          </div>

          <div className="music-player__info">
            <span className="music-player__title">
              {currentTrack.title}
            </span>

            <span className="music-player__meta">
              {trackNumber} / {totalTracks}
            </span>
          </div>
        </div>

        <button
          className={`music-player__sound ${
            isMuted ? "music-player__sound--muted" : ""
          }`}
          type="button"
          onClick={toggleMute}
          data-sound="click"
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          <img src={soundIcon} alt="" aria-hidden="true" />
        </button>
      </div>

      {/* BOTTOM */}

      <div className="music-player__bottom">
        {/* TIME */}

        <div className="music-player__time">
          <span>{formatTime(currentTime)}</span>

          <span>-{formatTime(remainingTime)}</span>
        </div>

        {/* PROGRESS */}

        <div className="music-player__progress">
          <div className="music-player__progress-bg" />

          <div
            className="music-player__progress-fill"
            style={{ width: `${progress}%` }}
          />

          <input
            className="music-player__progress-input"
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => {
              seek(event.target.value);
            }}
            aria-label="Track position"
          />
        </div>

        {/* CONTROLS */}

        <div className="music-player__controls">
          <div className="music-player__volume">
            <button
              className="music-player__volume-button"
              type="button"
              onClick={toggleMute}
              data-sound="click"
              aria-label={isMuted ? "Unmute music" : "Mute music"}
            >
              <img src={soundIcon} alt="" aria-hidden="true" />
            </button>

            <div className="music-player__volume-slider">
              <div className="music-player__volume-bg" />

              <div
                className="music-player__volume-fill"
                style={{
                  width: `${isMuted ? 0 : volume * 100}%`,
                }}
              />

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => {
                  setVolume(event.target.value);
                }}
                aria-label="Music volume"
              />
            </div>
          </div>

          <button
            className="music-player__play"
            type="button"
            onClick={togglePlay}
            data-sound="click"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            <img
              src={isPlaying ? pauseIcon : playIcon}
              alt=""
              aria-hidden="true"
            />
          </button>

          <button
            className="music-player__next"
            type="button"
            onClick={nextTrack}
            data-sound="click"
            aria-label="Next track"
          >
            <img src={nextIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;