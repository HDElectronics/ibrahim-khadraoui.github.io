'use client';

import { usePathname } from 'next/navigation';
import { VscChevronRight } from 'react-icons/vsc';

import { getFileInfo } from '@/lib/files';

import styles from '@/styles/Breadcrumbs.module.css';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const file = getFileInfo(pathname);

  const crumbs = ['portfolio', ...segments.slice(0, -1), file.name];

  return (
    <div className={styles.breadcrumbs}>
      {crumbs.map((crumb, index) => (
        <span key={index} className={styles.crumb}>
          {index > 0 && <VscChevronRight className={styles.chevron} />}
          {crumb}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
