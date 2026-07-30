import { Metadata } from 'next';
import { VscGithub, VscMail, VscLinkExternal, VscAccount } from 'react-icons/vsc';

import Container from '@/components/Container';
import { profile } from '@/data/profile';
import { SocialIcon } from '@/types';

import styles from '@/styles/ContactPage.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Ibrahim Khadraoui.',
};

const ICONS: Record<SocialIcon, React.ComponentType<{ size?: number }>> = {
  github: VscGithub,
  linkedin: VscAccount,
  mail: VscMail,
  link: VscLinkExternal,
};

const ContactPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Contact</h1>
      <p className={styles.subtitle}>
        Open to new opportunities and collaborations. Email is the fastest way
        to reach me.
      </p>
    </header>

    <ul className={styles.list}>
      {profile.socials.map((social) => {
        const Icon = ICONS[social.icon];
        return (
          <li key={social.url}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.row}
            >
              <Icon size={16} />
              <span className={styles.label}>{social.label}</span>
              <span className={styles.value}>
                {social.url.replace(/^mailto:|^https?:\/\/(www\.)?/, '')}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  </Container>
);

export default ContactPage;
