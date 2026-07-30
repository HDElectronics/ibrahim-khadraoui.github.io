'use client';

import { useState } from 'react';

import MediaLightbox from '@/components/MediaLightbox';
import { MediaItem } from '@/types';

import styles from '@/styles/MediaCarousel.module.css';

function videoMimeType(src: string): string {
  const ext = src.split('.').pop()?.toLowerCase();
  if (ext === 'webm') return 'video/webm';
  if (ext === 'ogg' || ext === 'ogv') return 'video/ogg';
  return 'video/mp4';
}

interface MediaCarouselProps {
  items: MediaItem[];
  alt: string;
}

const MediaCarousel = ({ items, alt }: MediaCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  const safeIndex = Math.min(index, items.length - 1);
  const current = items[safeIndex];

  const renderMedia = (item: MediaItem, className: string, withControls = true) =>
    item.type === 'video' ? (
      <video className={className} controls={withControls} preload="metadata" playsInline>
        <source src={item.src} type={videoMimeType(item.src)} />
      </video>
    ) : (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img className={className} src={item.src} alt={alt} />
    );

  // A lone item needs no carousel chrome — a bare video keeps its own controls.
  if (items.length === 1) {
    return <div className={styles.single}>{renderMedia(current, styles.media)}</div>;
  }

  const step = (delta: number) => {
    const n = items.length;
    setIndex(((safeIndex + delta) % n + n) % n);
  };

  return (
    <div
      className={styles.carousel}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          step(1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      <button
        type="button"
        className={styles.viewer}
        onClick={() => setOpen(true)}
        aria-label={`Expand ${alt} media ${safeIndex + 1} of ${items.length}`}
      >
        {renderMedia(current, styles.media, current.type !== 'video')}
        {current.type === 'video' && (
          <span className={styles.playBadge} aria-hidden="true">
            ▶
          </span>
        )}
      </button>

      <div className={styles.bar}>
        <p className={styles.counter}>
          {safeIndex + 1} / {items.length}
        </p>
      </div>

      <ul className={styles.thumbs}>
        {items.map((item, i) => (
          <li key={`${item.src}-${i}`}>
            <button
              type="button"
              className={i === safeIndex ? `${styles.thumb} ${styles.active}` : styles.thumb}
              onClick={() => setIndex(i)}
              aria-current={i === safeIndex ? 'true' : undefined}
              aria-label={`Show item ${i + 1}`}
            >
              {item.type === 'video' ? (
                <>
                  <video className={styles.thumbMedia} preload="metadata" muted playsInline>
                    <source src={item.src} type={videoMimeType(item.src)} />
                  </video>
                  <span className={styles.playBadge} aria-hidden="true">
                    ▶
                  </span>
                </>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className={styles.thumbMedia} src={item.src} alt="" />
              )}
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <MediaLightbox
          items={items}
          alt={alt}
          index={safeIndex}
          onIndexChange={setIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default MediaCarousel;
