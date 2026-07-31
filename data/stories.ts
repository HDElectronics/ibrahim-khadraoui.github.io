import { Story } from '@/types';

// Newest first. Add media files under public/stories/<something>/ and
// reference them with absolute paths, e.g.:
//
// {
//   title: 'My desk setup',
//   date: 'Jul 2026',
//   text: 'A short line or two about it.',
//   media: [
//     { type: 'img', src: '/stories/setup/desk.jpg' },
//     { type: 'video', src: '/stories/setup/tour.mp4' },
//   ],
// },
export const stories: Story[] = [
  {
    title: 'My setup',
    date: 'Jul 2026',
    text: 'The desk where everything gets built — PC, screens, and the bench that turns ideas into boards.',
    media: [
      { type: 'img', src: '/stories/setup/setup-01.jpg' },
      { type: 'video', src: '/stories/setup/setup-02.mp4' },
      { type: 'img', src: '/stories/setup/setup-03.jpg' },
      { type: 'img', src: '/stories/setup/setup-04.jpg' },
    ],
  },
  {
    title: 'Boards on my bench',
    date: 'Jul 2026',
    text: 'Some of the boards I tinker with: an Arduino Q, a camera board, a Jetson Orin AGX, and a Pironman-cased Raspberry Pi.',
    media: [
      { type: 'img', src: '/stories/boards/arduinoq.jpg' },
      { type: 'img', src: '/stories/boards/camera-board.jpg' },
      { type: 'img', src: '/stories/boards/jetson-orin-agx.jpg' },
      { type: 'img', src: '/stories/boards/pironman.jpg' },
    ],
  },
  {
    title: 'Decoding RF with a HackRF',
    date: 'Jul 2026',
    text: 'Playing with software-defined radio: sniffing an analog FPV camera signal and decoding the video straight off the air with a HackRF.',
    media: [
      { type: 'video', src: '/stories/rf/fpv-analog-camera.mp4' },
      { type: 'video', src: '/stories/rf/hackrf-decode-analog-video.mp4' },
    ],
  },
  {
    title: 'Testing the Unitree',
    date: 'Jul 2026',
    text: 'Taking the Unitree robot dog for a walk.',
    media: [{ type: 'video', src: '/stories/unitree/testing-unitree.mp4' }],
  },
  {
    title: '4 years at TII',
    date: 'Mar 2026',
    text: 'Four years at TII. I have learned a lot — and time passes so fast.',
    media: [{ type: 'img', src: '/stories/tii/tii-4-years.jpg' }],
  },
];
