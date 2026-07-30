import Container from '@/components/Container';

import styles from '@/styles/SiteFooter.module.css';

const LINKS = [
  { href: 'https://github.com/HDElectronics', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/ibrahim-khadraoui/', label: 'LinkedIn' },
  { href: 'https://www.researchgate.net/profile/Ibrahim-Khadraoui', label: 'ResearchGate' },
  { href: 'mailto:khadraouiibrahim@gmail.com', label: 'Email' },
];

const SiteFooter = () => (
  <footer className={styles.footer}>
    <Container className={styles.inner}>
      <div className={styles.links}>
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className={styles.colophon}>Built with Next.js. Deployed on Vercel.</p>
    </Container>
  </footer>
);

export default SiteFooter;
