import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/Container';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { articles } from '@/data/articles';
import { awards } from '@/data/awards';

import styles from '@/styles/HomePage.module.css';

export const metadata: Metadata = {
  description:
    'Ibrahim Khadraoui is an AI / ML systems engineer working on edge inference and embodied AI — taking research models to production on robots and edge devices.',
};

const HomePage = () => {
  const selected = projects.slice(0, 3);
  const latest = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);

  return (
    <Container className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.tagline}>{profile.tagline}</p>
          <p className={styles.bio}>{profile.shortBio}</p>
        </div>
        <Image
          src="/home/me-desert.jpg"
          alt="Ibrahim Khadraoui in the desert"
          width={240}
          height={180}
          priority
          className={styles.portrait}
        />
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
                {project.images?.[0] && (
                  <span className={styles.rowThumb}>
                    <Image
                      src={project.images[0]}
                      alt=""
                      width={96}
                      height={72}
                      className={styles.rowThumbImg}
                    />
                  </span>
                )}
                <span className={styles.rowBody}>
                  <span className={styles.rowTitle}>{project.title}</span>
                  <span className={styles.rowText}>
                    {project.hook ?? project.description}
                  </span>
                  <span className={styles.rowTags}>
                    {project.tags.slice(0, 4).join(' · ')}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Recognition</h2>
          <Link href="/about" className={styles.seeAll}>
            more →
          </Link>
        </div>

        <ul className={styles.list}>
          {awards.map((award) => (
            <li key={award.title}>
              <Link href="/about" className={styles.row}>
                {award.images[0] && (
                  <span className={styles.rowThumb}>
                    <Image
                      src={award.images[0]}
                      alt=""
                      width={96}
                      height={72}
                      className={styles.rowThumbImg}
                    />
                  </span>
                )}
                <span className={styles.rowBody}>
                  <span className={styles.rowTitle}>{award.title}</span>
                  <span className={styles.rowText}>
                    {award.organization} · {award.date}
                  </span>
                  <span className={styles.rowTags}>
                    awarded for UAV-XR — VR-based fleet control
                  </span>
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
                {article.cover && (
                  <span className={styles.rowThumb}>
                    <Image
                      src={article.cover}
                      alt=""
                      width={96}
                      height={72}
                      className={styles.rowThumbImg}
                    />
                  </span>
                )}
                <span className={styles.rowBody}>
                  <span className={styles.rowTitle}>{article.title}</span>
                  <span className={styles.rowTags}>
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
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
