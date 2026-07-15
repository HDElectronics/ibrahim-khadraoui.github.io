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
                    <span className={styles.skillTag}>ESP32</span>
                    <span className={styles.skillTag}>STM32</span>
                    <span className={styles.skillTag}>Arduino</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>PCB Design</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>KiCad</span>
                    <span className={styles.skillTag}>EasyEDA</span>
                    <span className={styles.skillTag}>Schematic Capture</span>
                    <span className={styles.skillTag}>PCB Layout</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Robotics</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>ROS 1</span>
                    <span className={styles.skillTag}>ROS 2</span>
                    <span className={styles.skillTag}>MoveIt</span>
                    <span className={styles.skillTag}>Nav2</span>
                    <span className={styles.skillTag}>SLAM Toolbox</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Drones / UAV</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>PX4</span>
                    <span className={styles.skillTag}>MAVLink</span>
                    <span className={styles.skillTag}>Frame Assembly</span>
                    <span className={styles.skillTag}>Firmware Flashing</span>
                    <span className={styles.skillTag}>PID Tuning</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Communication Protocols</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>MQTT</span>
                    <span className={styles.skillTag}>AMQP / RabbitMQ</span>
                    <span className={styles.skillTag}>ZeroMQ</span>
                    <span className={styles.skillTag}>HTTP / REST API</span>
                    <span className={styles.skillTag}>WebSocket</span>
                    <span className={styles.skillTag}>Bluetooth BLE</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Video & Media</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>H.264 / H.265</span>
                    <span className={styles.skillTag}>WebRTC</span>
                    <span className={styles.skillTag}>RTMP / RTSP</span>
                    <span className={styles.skillTag}>FFmpeg</span>
                    <span className={styles.skillTag}>GStreamer</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>AI / Machine Learning</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>YOLOv5</span>
                    <span className={styles.skillTag}>VLM / VLA</span>
                    <span className={styles.skillTag}>LLM Inference</span>
                    <span className={styles.skillTag}>llama.cpp</span>
                    <span className={styles.skillTag}>TensorRT</span>
                    <span className={styles.skillTag}>ONNX Runtime</span>
                    <span className={styles.skillTag}>Whisper (ASR)</span>
                    <span className={styles.skillTag}>Piper (TTS)</span>
                    <span className={styles.skillTag}>MLX</span>
                  </div>
                </div>

                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Systems</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>Linux</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hobbies Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>03</span>
              <h2 className={styles.sectionTitle}>Hobbies</h2>
            </div>

            <div className={styles.sectionBody}>
              <div className={styles.hobbiesGrid}>
                <div className={styles.hobbyCard}>
                  <h4 className={styles.hobbyTitle}>FPV Drone Flying</h4>
                  <p className={styles.hobbyText}>
                    I fly FPV using a real FPV drone controller, mostly
                    through FPV drone simulator games for now.
                  </p>
                  <div className={styles.hobbyPlaceholder}>Photos coming soon</div>
                </div>

                <div className={styles.hobbyCard}>
                  <h4 className={styles.hobbyTitle}>DCS World</h4>
                  <p className={styles.hobbyText}>
                    Combat flight simulation with a joystick and a VR
                    headset. I know how to pilot the Su-25T.
                  </p>
                </div>

                <div className={styles.hobbyCard}>
                  <h4 className={styles.hobbyTitle}>PCB Design</h4>
                  <p className={styles.hobbyText}>
                    Now that I work in AI day to day, PCB design has become
                    more of a hobby — I still take on the occasional board.
                  </p>
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
