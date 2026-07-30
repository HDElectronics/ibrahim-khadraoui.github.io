'use client';

import { useEffect, useState } from 'react';
import { VscColorMode } from 'react-icons/vsc';

import styles from '@/styles/ThemeToggle.module.css';

type Theme = 'dark' | 'light';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // storage blocked (private mode / cookie policy) — theme still applies for this page view
    }
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <VscColorMode size={16} />
    </button>
  );
};

export default ThemeToggle;
