import Link from 'next/link';

import Container from '@/components/Container';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { articles } from '@/data/articles';

import styles from '@/styles/HomePage.module.css';

const HomePage = () => {
  const selected = projects.slice(0, 3);
  const latest = articles.slice(0, 2);

  return (
    <Container className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.tagline}>{profile.tagline}</p>
        <p className={styles.bio}>{profile.shortBio}</p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Selected work</h2>
          <Link href="/projects" className={styles.seeAll}>
            all projects →
          </Link>
        </div>

        <ul className={styles.list}>
          {selected.map((project) => (
            <li key={project.slug}>
              <Link href={project.link} className={styles.row}>
                <span className={styles.rowTitle}>{project.title}</span>
                <span className={styles.rowText}>
                  {project.hook ?? project.description}
                </span>
                <span className={styles.rowTags}>
                  {project.tags.slice(0, 4).join(' · ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Latest writing</h2>
          <Link href="/articles" className={styles.seeAll}>
            all articles →
          </Link>
        </div>

        <ul className={styles.list}>
          {latest.map((article) => (
            <li key={article.slug}>
              <Link href={`/articles/${article.slug}`} className={styles.row}>
                <span className={styles.rowTitle}>{article.title}</span>
                <span className={styles.rowTags}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <p className={styles.cta}>
          <Link href="/experience" className={styles.ctaLink}>
            See where I&apos;ve worked
          </Link>{' '}
          or{' '}
          <Link href="/contact" className={styles.ctaLink}>
            get in touch
          </Link>
          .
        </p>
      </section>
    </Container>
  );
};

export default HomePage;
