import { Metadata } from 'next';
import { VscBook, VscLinkExternal, VscGlobe } from 'react-icons/vsc';

import WPArticleCard from '@/components/WPArticleCard';
import { articles } from '@/data/articles';

import styles from '@/styles/ArticlesPage.module.css';

export const metadata: Metadata = {
  title: 'Articles',
};

export default function ArticlesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <div className={styles.iconWrapper}>
              <VscBook className={styles.icon} size={24} />
            </div>

            <div className={styles.headerContent}>
              <div className={styles.headerTop}>
                <h1 className={styles.title}>Articles</h1>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <VscGlobe size={14} />
                    <span>{articles.length} posts</span>
                  </div>
                </div>
              </div>

              <p className={styles.subtitle}>
                Write-ups on the PCBs and embedded systems I build — schematic
                design, layout, manufacturing, and bring-up.
              </p>
            </div>
          </div>

          <a
            href="https://khadraouiibrahim.wordpress.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <span>WordPress</span>
            <VscLinkExternal size={14} />
          </a>
        </header>

        <div className={styles.articlesList}>
          {articles.map((article, index) => (
            <WPArticleCard
              key={article.slug}
              article={article}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
