import { Metadata } from 'next';

import Container from '@/components/Container';
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { education } from '@/data/education';

import styles from '@/styles/ExperiencePage.module.css';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Career timeline of Ibrahim Khadraoui — AI / ML systems engineering at TII, UAV and streaming systems, and freelance embedded hardware.',
};

const ExperiencePage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Experience</h1>
      <p className={styles.subtitle}>A changelog from my journey.</p>
    </header>

    <ol className={styles.timeline}>
      {experience.map((entry) => (
        <li key={entry.company} className={styles.entry}>
          <div className={styles.entryHead}>
            <h2 className={styles.company}>{entry.company}</h2>
            <span className={styles.meta}>
              {entry.location} · {entry.period}
            </span>
          </div>

          <ul className={styles.roles}>
            {entry.roles.map((role) => (
              <li key={role.title} className={styles.role}>
                <span className={styles.roleTitle}>{role.title}</span>
                <span className={styles.rolePeriod}>{role.period}</span>
              </li>
            ))}
          </ul>

          {entry.focuses.map((focus) => (
            <section key={focus.label} className={styles.focus}>
              <h3 className={styles.focusLabel}>
                {focus.label}
                {focus.period && (
                  <span className={styles.focusPeriod}>{focus.period}</span>
                )}
              </h3>
              <ul className={styles.bullets}>
                {focus.bullets.map((bullet) => (
                  <li key={bullet} className={styles.bullet}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className={styles.tags}>
            {entry.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Education</h2>
      <ul className={styles.education}>
        {education.map((item) => (
          <li key={item.degree} className={styles.educationItem}>
            <span className={styles.degree}>{item.degree}</span>
            <span className={styles.meta}>
              {item.institution} · {item.date}
            </span>
            {item.detail && <p className={styles.detail}>{item.detail}</p>}
          </li>
        ))}
      </ul>
    </section>

    <a
      href={profile.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.resume}
    >
      View full resume (PDF) →
    </a>
  </Container>
);

export default ExperiencePage;
