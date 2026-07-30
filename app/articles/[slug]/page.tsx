import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from '@/components/Container';
import ContentBlocks from '@/components/ContentBlocks';
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
  return {
    title: article?.title ?? 'Article',
    description: article?.excerpt,
  };
}

const ArticleDetailPage = async ({ params }: ArticleDetailPageProps) => {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const coverInContent = article.content.some(
    (block) => block.type === 'img' && block.src === article.cover,
  );

  return (
    <Container className={styles.page}>
      <Link href="/articles" className={styles.back}>
        ← Back to articles
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.meta}>
          {new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      {!coverInContent && article.cover && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={article.cover} alt={article.title} className={styles.cover} />
      )}

      <ContentBlocks blocks={article.content} alt={article.title} />
    </Container>
  );
};

export default ArticleDetailPage;
