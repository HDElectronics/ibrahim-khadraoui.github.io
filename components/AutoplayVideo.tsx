'use client';

// Browsers only autoplay muted video, but React never serializes the `muted`
// attribute into markup, so the parser-created element fails Chrome's autoplay
// eligibility check. The ref mutes and starts playback imperatively instead.

interface AutoplayVideoProps {
  src: string;
  className?: string;
  controls?: boolean;
}

const AutoplayVideo = ({ src, className, controls = true }: AutoplayVideoProps) => (
  <video
    key={src}
    ref={(video) => {
      if (video) {
        video.muted = true;
        video.play().catch(() => {
          /* autoplay rejected (e.g. data saver) — controls remain usable */
        });
      }
    }}
    className={className}
    src={src}
    controls={controls}
    muted
    loop
    playsInline
    preload="metadata"
  />
);

export default AutoplayVideo;
