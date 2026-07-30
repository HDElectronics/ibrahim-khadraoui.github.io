'use client';

import GitHubCalendar from 'react-github-calendar';

import styles from '@/styles/GithubActivity.module.css';

const GithubActivity = () => (
  <div className={styles.calendar}>
    <GitHubCalendar
      username="HDElectronics"
      colorScheme="dark"
      blockSize={11}
      blockMargin={3}
      fontSize={12}
    />
  </div>
);

export default GithubActivity;
