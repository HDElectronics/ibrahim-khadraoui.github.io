import Container from '@/components/Container';
import { profile } from '@/data/profile';

import styles from '@/styles/SiteFooter.module.css';

const SiteFooter = () => (
  <footer className={styles.footer}>
    <Container className={styles.inner}>
      <div className={styles.links}>
        {profile.socials.map((social) => (
          <a
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {social.label}
          </a>
        ))}
      </div>
      <p className={styles.colophon}>Built with Next.js. Deployed on Vercel.</p>
    </Container>
  </footer>
);

export default SiteFooter;
