'use client';

import { useCallback, useEffect, useRef } from 'react';
import { VscChevronLeft, VscChevronRight, VscClose } from 'react-icons/vsc';

import { MediaItem } from '@/types';

import styles from '@/styles/MediaLightbox.module.css';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, video, [tabindex]:not([tabindex="-1"])';

function videoMimeType(src: string): string {
  const ext = src.split('.').pop()?.toLowerCase();
  if (ext === 'webm') return 'video/webm';
  if (ext === 'ogg' || ext === 'ogv') return 'video/ogg';
  return 'video/mp4';
}

interface MediaLightboxProps {
  items: MediaItem[];
  alt: string;
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}

const MediaLightbox = ({
  items,
  alt,
  index,
  onIndexChange,
  onClose,
}: MediaLightboxProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (delta: number) => {
      const n = items.length;
      onIndexChange(((index + delta) % n + n) % n);
    },
    [index, items.length, onIndexChange]
  );

  // Lock body scroll for as long as the dialog is mounted.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Move focus in on open, and restore it on close. Runs exactly once per
  // mount so navigating between items never throws focus back to the trigger.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    return () => {
      trigger?.focus();
    };
  }, []);

  // Escape/Arrow handling and the Tab focus trap. Re-runs when `step`
  // changes identity, but only ever touches the keydown listener.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, step]);

  const item = items[index];

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — media viewer`}
      ref={dialogRef}
    >
      <button
        type="button"
        ref={closeRef}
        className={styles.close}
        onClick={onClose}
        aria-label="Close viewer"
      >
        <VscClose size={20} />
      </button>

      {items.length > 1 && (
        <button
          type="button"
          className={`${styles.nav} ${styles.prev}`}
          onClick={(event) => {
            event.stopPropagation();
            step(-1);
          }}
          aria-label="Previous item"
        >
          <VscChevronLeft size={24} />
        </button>
      )}

      <div className={styles.stage} onClick={(event) => event.stopPropagation()}>
        {item.type === 'video' ? (
          <video className={styles.media} controls autoPlay playsInline>
            <source src={item.src} type={videoMimeType(item.src)} />
          </video>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className={styles.media} src={item.src} alt={alt} />
        )}
        {items.length > 1 && (
          <p className={styles.counter}>
            {index + 1} / {items.length}
          </p>
        )}
      </div>

      {items.length > 1 && (
        <button
          type="button"
          className={`${styles.nav} ${styles.next}`}
          onClick={(event) => {
            event.stopPropagation();
            step(1);
          }}
          aria-label="Next item"
        >
          <VscChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default MediaLightbox;
