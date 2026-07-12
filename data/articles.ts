import { WPArticle } from '@/types';

export const articles: WPArticle[] = [
  {
    slug: 'testing-kicad6',
    title: 'Testing KiCad 6.0',
    date: '2022-01-02',
    excerpt:
      'Building a learning PCB with an STM32F103 using KiCad 6.0 — schematic, layout, manufacturing, and bring-up.',
    cover: '/articles/testing-kicad6/wp_story1641124827577_0-edited-2.jpg',
    images: [
      '/articles/testing-kicad6/wp_story1641124827577_0-edited-2.jpg',
      '/articles/testing-kicad6/wp_story1641124827489_1-edited.jpg',
      '/articles/testing-kicad6/wp_story1641124827591_4-edited-1.jpg',
      '/articles/testing-kicad6/wp_story1641124827161_3-edited.jpg',
      '/articles/testing-kicad6/wp_story1641124827096_2-edited.jpg',
    ],
    content: [
      { type: 'h2', text: 'Introduction' },
      {
        type: 'p',
        text: 'Creating a learning PCB is an excellent way to deepen your understanding of electronics and embedded systems. In this project, I designed a PCB based on the STM32F103 microcontroller using KiCad 6.0. This board features a USB to UART interface using the CH340 chip, a 5V input jack connector, and an ICSP connector for debugging and flashing.',
      },
      { type: 'h2', text: 'Tools and Components' },
      {
        type: 'p',
        text: 'Software: KiCad 6.0, an open-source EDA suite. Chosen for this project for its robust features and user-friendly interface, suitable for both beginners and experienced designers.',
      },
      {
        type: 'p',
        text: 'Microcontroller: STM32F103, popular for learning and prototyping thanks to its ARM Cortex-M3 core, abundant peripherals, and wide community support.',
      },
      {
        type: 'p',
        text: 'Additional components: a standard 6-pin ICSP connector for debugging/flashing, a CH340 USB-to-UART chip for easy communication with the microcontroller, and a jack connector for 5V input.',
      },
      { type: 'h2', text: 'Designing the PCB' },
      { type: 'h3', text: 'Step 1: Schematic Design' },
      {
        type: 'p',
        text: 'Add the STM32F103 microcontroller, place the CH340 chip and connect it to the UART pins, add the 5V input jack connector, and include the ICSP connector wired to the debug pins.',
      },
      { type: 'h3', text: 'Step 2: PCB Layout' },
      {
        type: 'p',
        text: 'Import the netlist from the schematic, place components considering signal flow, route critical signals (clock, power) with thicker traces, run a Design Rules Check, then generate Gerber files for manufacturing.',
      },
      { type: 'h2', text: 'Manufacturing, Assembly and Testing' },
      {
        type: 'p',
        text: 'After selecting a manufacturer and ordering the board, I inspected it for defects, soldered the CH340 and ICSP connector with a fine-tip iron, powered it up and checked for shorts, flashed the firmware via ICSP, and verified UART communication with a terminal program.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'This project provided a comprehensive overview of designing, manufacturing, and assembling a learning PCB using KiCad 6.0 and the STM32F103 microcontroller — a solid base for future custom PCB designs.',
      },
    ],
  },
  {
    slug: 'car-odometer-atmega328p',
    title: 'Building an Odometer for Cars Using ATmega328P-AU',
    date: '2021-12-28',
    excerpt:
      'Designing an odometer that interfaces with a car’s ABS encoder to retrieve speed and distance data — schematic and PCB design.',
    cover: '/articles/car-odometer-atmega328p/3d3.png',
    images: [
      '/articles/car-odometer-atmega328p/schematic_odometer-cttp-v2_2021-12-28.png',
      '/articles/car-odometer-atmega328p/3d3.png',
      '/articles/car-odometer-atmega328p/3d4.png',
      '/articles/car-odometer-atmega328p/pcb_pcb-odometer-cttp-v2_2021-12-28.png',
    ],
    content: [
      { type: 'h2', text: 'Introduction' },
      {
        type: 'p',
        text: 'In this project, I designed an odometer that can be installed in a car. The odometer interfaces with the car’s ABS encoder to retrieve speed and distance data. This article covers the schematic and PCB design.',
      },
      { type: 'h2', text: 'The Schematic' },
      {
        type: 'p',
        text: 'The heart of the odometer is an ATmega328P-AU (TQFP32). The power stage includes a DC/DC converter to step the car’s 12V supply down to a stable 5V. The board also features a USB-to-UART transceiver for serial communication and monitoring.',
      },
      { type: 'img', src: '/articles/car-odometer-atmega328p/schematic_odometer-cttp-v2_2021-12-28.png' },
      {
        type: 'p',
        text: 'The ABS encoder signal feeds into one of the ATmega328P’s input pins, letting the microcontroller process speed and distance data. Careful filtering keeps the power supply stable and low-noise.',
      },
      { type: 'h2', text: 'The PCB' },
      { type: 'img', src: '/articles/car-odometer-atmega328p/3d3.png' },
      { type: 'img', src: '/articles/car-odometer-atmega328p/3d4.png' },
      {
        type: 'p',
        text: 'A two-layer board measuring 41x82mm with four screw holes for secure mounting. The power section sits apart from the digital section (MCU + USB/UART) to isolate noise, with a continuous ground plane and careful routing of the ABS signal to minimize EMI.',
      },
      { type: 'h2', text: 'Assembly and Testing' },
      {
        type: 'p',
        text: 'After soldering and an initial power-up check, I flashed the firmware via an Arduino-compatible programmer, connected the ABS encoder signal, and verified data reception over serial monitoring.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'This project demonstrates the design and implementation of a car odometer using the ATmega328P-AU. Careful schematic and PCB layout — with attention to EMI and thermal management — produced a reliable, functional board.',
      },
    ],
  },
  {
    slug: 'wifi-based-device',
    title: 'Design of a WiFi Based Device',
    date: '2021-12-27',
    excerpt:
      'A 4-layer PCB design exercise, applying everything learned about hardware design so far — schematic, stack-up, and 3D renders.',
    cover: '/articles/wifi-based-device/3d1.png',
    images: [
      '/articles/wifi-based-device/schematic.png',
      '/articles/wifi-based-device/pcb_pcb-yahia_2021-12-27-2.png',
      '/articles/wifi-based-device/3d1.png',
      '/articles/wifi-based-device/3d2-1.png',
    ],
    content: [
      {
        type: 'p',
        text: 'In this post I present the design of a PCB I made. For my first 4-layer PCB, I tried to use everything I could learn about hardware design, thanks in large part to Robert Feranec’s YouTube channel.',
      },
      { type: 'h2', text: 'Presentation of the Schematic' },
      { type: 'img', src: '/articles/wifi-based-device/schematic.png' },
      {
        type: 'p',
        text: 'The schematic is split into four sections top to bottom: a power supply section using a cheap DC/DC converter to bring the 12V from the jack connector down to 3.3V; an SD card connector with an RGB LED and buzzer; and connectors for the remaining peripherals.',
      },
      { type: 'h2', text: 'The PCB' },
      { type: 'img', src: '/articles/wifi-based-device/pcb_pcb-yahia_2021-12-27-2.png' },
      {
        type: 'p',
        text: 'The board is 4 layers, 58x74mm. Top and bottom are signal layers, while the two inner layers are ground and power planes. The power section sits at the bottom, far from the MCU and other ICs, because of the high switching frequency of the DC/DC converter.',
      },
      { type: 'h2', text: 'Some 3D Pictures of the Board' },
      { type: 'img', src: '/articles/wifi-based-device/3d1.png' },
      { type: 'img', src: '/articles/wifi-based-device/3d2-1.png' },
    ],
  },
];
