import { ContentBlock } from '@/types';

import styles from '@/styles/ContentBlocks.module.css';

interface ContentBlocksProps {
  blocks: ContentBlock[];
  alt: string;
}

type Group =
  | { kind: 'list'; items: string[] }
  | { kind: 'block'; block: ContentBlock };

function groupBlocks(blocks: ContentBlock[]): Group[] {
  const groups: Group[] = [];

  for (const block of blocks) {
    if (block.type === 'li') {
      const last = groups[groups.length - 1];
      if (last && last.kind === 'list') {
        last.items.push(block.text ?? '');
      } else {
        groups.push({ kind: 'list', items: [block.text ?? ''] });
      }
    } else {
      groups.push({ kind: 'block', block });
    }
  }

  return groups;
}

const ContentBlocks = ({ blocks, alt }: ContentBlocksProps) => (
  <div className={styles.content}>
    {groupBlocks(blocks).map((group, index) => {
      if (group.kind === 'list') {
        return (
          <ul key={index} className={styles.list}>
            {group.items.map((item, itemIndex) => (
              <li key={itemIndex} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        );
      }

      const { block } = group;

      switch (block.type) {
        case 'h2':
          return (
            <h2 key={index} className={styles.h2}>
              {block.text}
            </h2>
          );
        case 'h3':
          return (
            <h3 key={index} className={styles.h3}>
              {block.text}
            </h3>
          );
        case 'h4':
          return (
            <h4 key={index} className={styles.h4}>
              {block.text}
            </h4>
          );
        case 'img':
          return block.src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={index} src={block.src} alt={alt} className={styles.media} />
          ) : null;
        case 'video':
          return block.src ? (
            <video
              key={index}
              className={styles.media}
              controls
              preload="metadata"
              playsInline
            >
              <source src={block.src} type="video/mp4" />
            </video>
          ) : null;
        case 'p':
        default:
          return (
            <p key={index} className={styles.p}>
              {block.text}
            </p>
          );
      }
    })}
  </div>
);

export default ContentBlocks;
