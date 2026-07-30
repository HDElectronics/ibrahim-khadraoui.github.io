import { Metadata } from 'next';

import Container from '@/components/Container';
import GithubActivity from '@/components/GithubActivity';
import MediaCarousel from '@/components/MediaCarousel';
import { about } from '@/data/about';
import { publications } from '@/data/publications';
import { awards } from '@/data/awards';
import { profile } from '@/data/profile';
import { Award, MediaItem } from '@/types';

import styles from '@/styles/AboutPage.module.css';

const awardMedia = (award: Award): MediaItem[] => [
  ...(award.images ?? []).map((src) => ({ type: 'img' as const, src })),
  ...(award.videos ?? []).map((src) => ({ type: 'video' as const, src })),
];

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Ibrahim Khadraoui — AI / ML systems engineer working on edge inference and embodied AI, with a background in embedded hardware.',
};

const AboutPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>About</h1>
      <p className={styles.tagline}>{profile.tagline}</p>
    </header>

    <section className={styles.section}>
      {about.bioParagraphs.map((paragraph) => (
        <p key={paragraph} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Skills</h2>
      <dl className={styles.skills}>
        {about.skillGroups.map((group) => (
          <div key={group.label} className={styles.skillGroup}>
            <dt className={styles.skillLabel}>{group.label}</dt>
            <dd className={styles.skillItems}>{group.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Publications</h2>
      <ul className={styles.publications}>
        {publications.map((publication) => (
          <li key={publication.title} className={styles.publication}>
            {publication.url ? (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.publicationTitle}
              >
                {publication.title}
              </a>
            ) : (
              <span className={styles.publicationTitle}>{publication.title}</span>
            )}
            <span className={styles.publicationMeta}>
              {publication.venue} · {publication.date}
            </span>
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Recognition</h2>
      <ul className={styles.awards}>
        {awards.map((award) => (
          <li key={award.title} className={styles.award}>
            <span className={styles.awardTitle}>{award.title}</span>
            <span className={styles.awardMeta}>
              {award.organization} · {award.date}
            </span>
            <p className={styles.awardText}>{award.description}</p>
            {awardMedia(award).length > 0 && (
              <div className={styles.awardMedia}>
                <MediaCarousel items={awardMedia(award)} alt={award.title} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>GitHub activity</h2>
      <GithubActivity />
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Hobbies</h2>
      <ul className={styles.hobbies}>
        {about.hobbies.map((hobby) => (
          <li key={hobby.title} className={styles.hobby}>
            <span className={styles.hobbyTitle}>{hobby.title}</span>
            <p className={styles.hobbyText}>{hobby.text}</p>
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Languages</h2>
      <p className={styles.paragraph}>{about.languages.join(' · ')}</p>
    </section>
  </Container>
);

export default AboutPage;
