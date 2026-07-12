import Image from 'next/image';
import Link from 'next/link';
import { VscCalendar } from 'react-icons/vsc';

import { WPArticle } from '@/types';

import styles from '@/styles/ArticleCard.module.css';

interface WPArticleCardProps {
  article: WPArticle;
  index: number;
}

const WPArticleCard = ({ article, index }: WPArticleCardProps) => {
  return (
    <Link href={`/articles/${article.slug}`} className={styles.card}>
      <div className={styles.number}>{String(index).padStart(2, '0')}</div>

      <div className={styles.imageWrapper}>
        <Image
          src={article.cover}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 200px"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.main}>
          <h3 className={styles.title}>{article.title}</h3>
          <p className={styles.description}>{article.excerpt}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <VscCalendar size={13} />
              <span>
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WPArticleCard;
