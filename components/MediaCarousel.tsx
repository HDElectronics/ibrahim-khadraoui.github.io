'use client';

import { useState } from 'react';

import MediaLightbox from '@/components/MediaLightbox';
import { MediaItem } from '@/types';

import styles from '@/styles/MediaCarousel.module.css';

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

  const renderMedia = (item: MediaItem, className: string) =>
    item.type === 'video' ? (
      <video className={className} controls preload="metadata" playsInline>
        <source src={item.src} type="video/mp4" />
      </video>
    ) : (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img className={className} src={item.src} alt={alt} />
    );

  // A lone item needs no carousel chrome.
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
        {renderMedia(current, styles.media)}
      </button>

      <div className={styles.bar}>
        <p className={styles.counter}>
          {safeIndex + 1} / {items.length}
        </p>
      </div>

      <ul className={styles.thumbs}>
        {items.map((item, i) => (
          <li key={item.src}>
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
                    <source src={item.src} type="video/mp4" />
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
