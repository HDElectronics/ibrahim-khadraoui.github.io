'use client';

import { VscGithub, VscMail } from 'react-icons/vsc';
import Link from 'next/link';

import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.name}>Ibrahim Khadraoui</h1>
              <p className={styles.role}>Embedded Systems Engineer</p>
              <div className={styles.location}>
                <span className={styles.dot} />
                Bouzareah, Algiers, Algeria
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <a
              href="https://github.com/HDElectronics"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconButton}
            >
              <VscGithub size={20} />
            </a>
            <Link href="/contact" className={styles.iconButton}>
              <VscMail size={20} />
            </Link>
          </div>
        </header>

        <div className={styles.content}>
          {/* Bio Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>01</span>
              <h2 className={styles.sectionTitle}>About</h2>
            </div>

            <div className={styles.sectionBody}>
              <p className={styles.paragraph}>
                I&apos;m an embedded systems engineer who designs and builds
                custom PCBs, from schematic to layout to bring-up. Most of my
                work centers on ATmega328P and STM32-based boards — sensor
                interfacing, motor control, power design, and USB/serial
                communication.
              </p>

              <p className={styles.paragraph}>
                I use KiCad for schematic capture and PCB layout, and enjoy
                taking a project all the way from an idea to a soldered,
                working prototype.
              </p>
            </div>
          </section>

          {/* Skills Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>02</span>
              <h2 className={styles.sectionTitle}>Skills</h2>
            </div>

            <div className={styles.sectionBody}>
              <div className={styles.skillsGrid}>
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Microcontrollers</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>ATmega328P</span>
                    <span className={styles.skillTag}>STM32F103</span>
                    <span className={styles.skillTag}>Arduino</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>PCB Design</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>KiCad</span>
                    <span className={styles.skillTag}>Schematic Capture</span>
                    <span className={styles.skillTag}>PCB Layout</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Interfaces</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>USB HID</span>
                    <span className={styles.skillTag}>I2C / SPI / UART</span>
                    <span className={styles.skillTag}>LoRa / UWB</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Networking</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>Cisco (CCNA)</span>
                    <span className={styles.skillTag}>Robotics</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <Link href="/projects" className={styles.footerLink}>
            View my projects →
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
