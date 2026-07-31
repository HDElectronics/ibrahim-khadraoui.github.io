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
    title: 'Insta360 Pro 2',
    date: 'Jul 2026',
    text: 'The Insta360 Pro 2 — the 360° camera behind the immersive video streams.',
    media: [{ type: 'video', src: '/stories/insta360/insta360-pro-2.mp4' }],
  },
  {
    title: 'Learning ROS and Nav2',
    date: 'Jul 2026',
    text: 'Working through ROS and the Nav2 stack — simulation first, robots later.',
    media: [{ type: 'video', src: '/stories/ros-nav2/ros-nav2.mp4' }],
  },
  {
    title: '4 years at TII',
    date: 'Mar 2026',
    text: 'Four years at TII. I have learned a lot — and time passes so fast.',
    media: [{ type: 'img', src: '/stories/tii/tii-4-years.jpg' }],
  },
  {
    title: 'WWRF Abu Dhabi',
    date: '2022',
    text: 'We presented the UAV-XR demo at the Wireless World Research Forum in Abu Dhabi.',
    media: [{ type: 'img', src: '/stories/wwrf/wwrf-w-hotel.jpg' }],
  },
  {
    title: 'Electronics repair workshop',
    date: '2021',
    text: 'Back in my student days — active in a workshop repairing electronics devices. Also on the bench: an RC controller repair.',
    media: [
      { type: 'img', src: '/stories/repair/belfort-repair.jpg' },
      { type: 'img', src: '/stories/repair/rc-controller-repair.jpg' },
    ],
  },
];
