import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { VscStarFull, VscArrowRight } from 'react-icons/vsc';

import { awards } from '@/data/awards';

import styles from '@/styles/AwardsPage.module.css';

export const metadata: Metadata = {
  title: 'Awards',
};

const AwardsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.iconWrapper}>
              <VscStarFull className={styles.icon} size={22} />
            </div>
            <span className={styles.count}>
              {awards.length} {awards.length === 1 ? 'Award' : 'Awards'}
            </span>
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Awards &amp; Achievements</h1>
            <p className={styles.subtitle}>
              Recognition earned along the way.
            </p>
          </div>
        </header>

        <div className={styles.list}>
          {awards.map((award) => (
            <article key={award.title} className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.awardTitle}>{award.title}</h2>
                <span className={styles.org}>{award.organization}</span>
                {award.date && <span className={styles.date}>{award.date}</span>}
              </div>

              <p className={styles.description}>{award.description}</p>

              {award.videos && award.videos.length > 0 && (
                <div className={styles.videos}>
                  {award.videos.map((src) => (
                    <video
                      key={src}
                      className={styles.video}
                      controls
                      preload="metadata"
                      playsInline
                    >
                      <source src={src} type="video/mp4" />
                    </video>
                  ))}
                </div>
              )}

              {award.images.length > 0 && (
                <div className={styles.gallery}>
                  {award.images.map((src) => (
                    <div key={src} className={styles.imageWrapper}>
                      <Image
                        src={src}
                        alt={award.title}
                        width={500}
                        height={375}
                        className={styles.image}
                      />
                    </div>
                  ))}
                </div>
              )}

              {award.project && (
                <Link
                  href={`/projects/${award.project}`}
                  className={styles.projectLink}
                >
                  View the project
                  <VscArrowRight size={12} />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwardsPage;
