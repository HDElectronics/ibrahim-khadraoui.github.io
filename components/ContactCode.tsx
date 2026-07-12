import styles from '@/styles/ContactCode.module.css';

const contactItems = [
  {
    social: 'website',
    link: 'khadraouiibrahim.wordpress.com',
    href: 'https://khadraouiibrahim.wordpress.com',
  },
  {
    social: 'email',
    link: 'khadraouiibrahim@gmail.com',
    href: 'mailto:khadraouiibrahim@gmail.com',
  },
  {
    social: 'github',
    link: 'HDElectronics',
    href: 'https://github.com/HDElectronics',
  },
  {
    social: 'linkedin',
    link: 'ibrahim-khadraoui',
    href: 'https://www.linkedin.com/in/ibrahim-khadraoui/',
  },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {contactItems.map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;{item.social}:{' '}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
          ;
        </p>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
