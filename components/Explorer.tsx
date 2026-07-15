import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import { VscChevronRight } from 'react-icons/vsc';

import { PORTFOLIO_FILES } from '@/lib/files';

import styles from '@/styles/Explorer.module.css';

const DEFAULT_WIDTH = 220;
const MIN_WIDTH = 160;
const MAX_WIDTH = 480;
const SIDEBAR_WIDTH = 48;
const STORAGE_KEY = 'explorerWidth';

const Explorer = () => {
  const [portfolioOpen, setPortfolioOpen] = useState(true);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const isDragging = useRef(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (saved >= MIN_WIDTH && saved <= MAX_WIDTH) {
      setWidth(saved);
    }
  }, []);

  const handleResizeStart = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX - SIDEBAR_WIDTH));
      setWidth(next);
    };
    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setWidth((w) => {
        localStorage.setItem(STORAGE_KEY, String(w));
        return w;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className={styles.explorer} style={{ width }}>
      <p className={styles.title}>Explorer</p>
      <div>
        <input
          type="checkbox"
          className={styles.checkbox}
          id="portfolio-checkbox"
          checked={portfolioOpen}
          onChange={() => setPortfolioOpen(!portfolioOpen)}
        />
        <label htmlFor="portfolio-checkbox" className={styles.heading}>
          <VscChevronRight
            className={styles.chevron}
            style={portfolioOpen ? { transform: 'rotate(90deg)' } : {}}
          />
          Portfolio
        </label>
        <div
          className={styles.files}
          style={portfolioOpen ? { display: 'block' } : { display: 'none' }}
        >
          {PORTFOLIO_FILES.map((item) => (
            <Link href={item.path} key={item.name}>
              <div className={styles.file}>
                <Image src={item.icon} alt={item.name} height={18} width={18} />{' '}
                <p>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div
        className={styles.resizeHandle}
        onMouseDown={handleResizeStart}
        role="separator"
        aria-orientation="vertical"
      />
    </div>
  );
};

export default Explorer;
