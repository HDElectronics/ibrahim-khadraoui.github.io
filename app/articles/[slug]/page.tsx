import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VscArrowLeft, VscCalendar } from 'react-icons/vsc';

import { articles } from '@/data/articles';

import styles from '@/styles/ArticleDetailPage.module.css';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return { title: article?.title ?? 'Article' };
}

const ArticleDetailPage = async ({ params }: ArticleDetailPageProps) => {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/articles" className={styles.back}>
          <VscArrowLeft size={14} />
          <span>Back to Articles</span>
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.meta}>
            <VscCalendar size={13} />
            <span>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        <div className={styles.coverWrapper}>
          <Image
            src={article.cover}
            alt={article.title}
            width={800}
            height={450}
            className={styles.cover}
            priority
          />
        </div>

        <div className={styles.content}>
          {article.content.map((block, index) => {
            switch (block.type) {
              case 'h2':
                return (
                  <h2 key={index} className={styles.blockH2}>
                    {block.text}
                  </h2>
                );
              case 'h3':
                return (
                  <h3 key={index} className={styles.blockH3}>
                    {block.text}
                  </h3>
                );
              case 'h4':
                return (
                  <h4 key={index} className={styles.blockH4}>
                    {block.text}
                  </h4>
                );
              case 'p':
                return (
                  <p key={index} className={styles.blockP}>
                    {block.text}
                  </p>
                );
              case 'img':
                return (
                  <div key={index} className={styles.blockImageWrapper}>
                    <Image
                      src={block.src!}
                      alt={article.title}
                      width={800}
                      height={450}
                      className={styles.blockImage}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
