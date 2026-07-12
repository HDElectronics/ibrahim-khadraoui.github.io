'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Titlebar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import Explorer from '@/components/Explorer';
import Bottombar from '@/components/Bottombar';
import Tabsbar from '@/components/Tabsbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import Terminal from '@/components/Terminal';
import CommandPalette from '@/components/CommandPalette';
import { PORTFOLIO_FILES } from '@/lib/files';

import styles from '@/styles/Layout.module.css';

const DEFAULT_TABS = PORTFOLIO_FILES.map((file) => file.path);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [chordKey, setChordKey] = useState<string | null>(null);
  const [openTabs, setOpenTabs] = useState<string[]>(DEFAULT_TABS);
  const [tabsRestored, setTabsRestored] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('openTabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOpenTabs(parsed);
        }
      }
    } catch {
      // corrupt storage — keep defaults
    }
    setTabsRestored(true);
  }, []);

  useEffect(() => {
    setOpenTabs((prev) => (prev.includes(pathname) ? prev : [...prev, pathname]));
  }, [pathname]);

  useEffect(() => {
    if (tabsRestored) {
      sessionStorage.setItem('openTabs', JSON.stringify(openTabs));
    }
  }, [openTabs, tabsRestored]);

  const closeTab = useCallback(
    (path: string) => {
      const index = openTabs.indexOf(path);
      if (index === -1) return;
      const next = openTabs.filter((p) => p !== path);
      setOpenTabs(next);
      if (path === pathname) {
        router.push(next.length > 0 ? next[Math.min(index, next.length - 1)] : '/');
      }
    },
    [openTabs, pathname, router]
  );

  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen(prev => !prev);
  }, []);

  const openCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
  }, []);

  useEffect(() => {
    const main = document.getElementById('main-editor');
    if (main) {
      main.scrollTop = 0;
    }
  }, [pathname]);

  useEffect(() => {
    const navigationRoutes: Record<string, string> = {
      'h': '/',
      'a': '/about',
      'p': '/projects',
      'r': '/articles',
      'c': '/contact',
      'g': '/github',
      's': '/settings',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommandPaletteOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        toggleTerminal();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openCommandPalette();
        return;
      }

      const key = e.key.toLowerCase();

      if (chordKey === 'g' && navigationRoutes[key]) {
        e.preventDefault();
        router.push(navigationRoutes[key]);
        setChordKey(null);
        return;
      }

      if (chordKey === 'k' && key === 't') {
        e.preventDefault();
        openCommandPalette();
        setChordKey(null);
        return;
      }

      if ((key === 'g' || key === 'k') && !(e.target instanceof Element && e.target.closest('input, textarea'))) {
        e.preventDefault();
        setChordKey(key);
        setTimeout(() => setChordKey(null), 2000);
        return;
      }

      if (chordKey && key !== chordKey) {
        setChordKey(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTerminal, openCommandPalette, chordKey, router, isCommandPaletteOpen]);

  return (
    <div className={styles.layout}>
      <Titlebar onOpenCommandPalette={openCommandPalette} />
      <div className={styles.main}>
        <Sidebar />
        <Explorer />
        <div className={styles.editorContainer}>
          <Tabsbar openTabs={openTabs} onCloseTab={closeTab} />
          <Breadcrumbs />
          <div className={styles.editorWithTerminal}>
            <main id="main-editor" className={styles.content}>
              {children}
            </main>
            {isTerminalOpen && <Terminal onToggle={toggleTerminal} />}
          </div>
        </div>
      </div>
      <Bottombar onTerminalToggle={toggleTerminal} isTerminalOpen={isTerminalOpen} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closeCommandPalette}
        onToggleTerminal={toggleTerminal}
        isTerminalOpen={isTerminalOpen}
      />
    </div>
  );
};

export default Layout;
