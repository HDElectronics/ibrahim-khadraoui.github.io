import Link from 'next/link';

import { WPArticle } from '@/types';

import styles from '@/styles/WPArticleCard.module.css';

interface WPArticleCardProps {
  article: WPArticle;
}

const WPArticleCard = ({ article }: WPArticleCardProps) => (
  <Link href={`/articles/${article.slug}`} className={styles.card}>
    <span className={styles.date}>
      {new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </span>
    <h2 className={styles.title}>{article.title}</h2>
    <p className={styles.excerpt}>{article.excerpt}</p>
  </Link>
);

export default WPArticleCard;
