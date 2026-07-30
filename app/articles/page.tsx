import { Metadata } from 'next';

import Container from '@/components/Container';
import WPArticleCard from '@/components/WPArticleCard';
import { articles } from '@/data/articles';

import styles from '@/styles/ArticlesPage.module.css';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Write-ups by Ibrahim Khadraoui on edge AI inference, robotics, UAV systems, and embedded hardware.',
};

const ArticlesPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Articles</h1>
      <p className={styles.subtitle}>
        Write-ups on the systems I build — model inference on edge hardware,
        robotics, drones, and the boards underneath.
      </p>
    </header>

    <div className={styles.list}>
      {[...articles]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((article) => (
          <WPArticleCard key={article.slug} article={article} />
        ))}
    </div>
  </Container>
);

export default ArticlesPage;
