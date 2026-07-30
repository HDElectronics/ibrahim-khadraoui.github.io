'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Container from '@/components/Container';
import ThemeToggle from '@/components/ThemeToggle';

import styles from '@/styles/SiteHeader.module.css';

const NAV = [
  { href: '/projects', label: 'projects' },
  { href: '/experience', label: 'experience' },
  { href: '/articles', label: 'articles' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
];

const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.wordmark}>
          Ibrahim<span className={styles.caret}>|</span>
        </Link>

        <nav className={styles.nav}>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? `${styles.link} ${styles.active}` : styles.link}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
};

export default SiteHeader;
