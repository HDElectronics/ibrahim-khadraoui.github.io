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
  {
    slug: 'autonomous-person-following-drone-atc',
    title: 'Building an Autonomous Person-Following Drone: YOLOv5 on an NPU, ByteTrack, and PID Control',
    date: '2026-07-11',
    excerpt:
      'Making a drone detect, track, and follow a person entirely on its own — YOLOv5 quantized onto an RK3588 NPU, ByteTrack for identity, and a tuned PID controller driving PX4 over MAVSDK.',
    cover: '/projects/atc/architecture.svg',
    images: ['/projects/atc/architecture.svg'],
    content: [
      {
        type: 'p',
        text: 'ATC ("Aerial Traffic Control") is a hobby project: an end-to-end UAV system that makes a drone autonomously detect, track, and follow a person, with no pilot input. Unlike my PCB projects, this one is almost entirely software — a pipeline stretching from a camera frame to a flight-controller velocity command, and I wanted to write up the pieces that made it actually work.',
      },
      { type: 'h2', text: 'Detection: YOLOv5 on the RK3588 NPU' },
      {
        type: 'p',
        text: 'I trained YOLOv5 on the VisDrone dataset — aerial imagery with small, distant people and vehicles, which is a much harder detection problem than ground-level footage. The trained model is exported with a modified export path that strips post-processing from the graph (better for quantization) and converted to RKNN with rknn-toolkit2. The resulting .rknn model runs in a C++ inference binary spread across all three of the RK3588\'s NPU cores.',
      },
      { type: 'li', text: 'Anchor auto-detection: the binary reads the model filename and picks the right anchor table, head count, and class count automatically — no manual flags.' },
      { type: 'li', text: 'P6 support: a 4-head detection architecture at 1280×1280 input resolution, which matters a lot for spotting small targets from altitude.' },
      { type: 'h2', text: 'Multi-object tracking with ByteTrack' },
      {
        type: 'p',
        text: 'A detector alone has no memory — frame 100 and frame 101 are independent. ByteTrack fixes that by predicting each object\'s position with a Kalman filter, then matching predictions to new detections by IoU (intersection over union) overlap. The result is a persistent integer ID per tracked person that survives brief occlusions. Since ByteTrack\'s internal track objects don\'t carry a class name, I recover it by matching each track back to the raw detection with the highest IoU.',
      },
      { type: 'h2', text: 'Getting detections from C++ to Python: MQTT' },
      {
        type: 'p',
        text: 'The detection/tracking pipeline (C++, on-device) and the flight controller (Python, asyncio) are two completely decoupled processes that only speak MQTT. Every message carries a "version" field for schema safety, and there are two message shapes — plain detections, or tracked objects with persistent IDs when ByteTrack is enabled. Neither side needs to know how the other is implemented, which made it possible to develop and test them independently.',
      },
      { type: 'h2', text: 'Closing the loop: PID control' },
      {
        type: 'p',
        text: 'The controller runs two independent PID loops — one for yaw (keeping the target horizontally centred) and one for forward/backward velocity (keeping the target at a target size/position in frame) — and outputs a MAVSDK VelocityBodyYawspeed command to PX4 in offboard mode at 20 Hz.',
      },
      {
        type: 'p',
        text: 'The most interesting tuning discovery was the pitch setpoint. Instead of trying to hold the target at the vertical centre of the frame (err_y = 0), I hold it at the upper third (setpoint = −0.3). That means the drone starts retreating as soon as the target crosses the upper-third line, instead of waiting until they reach dead centre — buying roughly 30% more frame height as reaction margin before the target gets too close. A small setpoint offset, but it noticeably changed how "jumpy" the following felt.',
      },
      {
        type: 'p',
        text: 'A confirmation guard also protects against false positives: the controller ignores a new track ID until it has been seen for at least 3 consecutive frames (~150ms at 20fps) before commanding any movement, and forward/backward velocity limits are intentionally asymmetric — capped lower going forward than retreating, so the drone can always back away faster than it approached.',
      },
      { type: 'h2', text: 'Simulator / real-drone parity' },
      {
        type: 'p',
        text: 'Every service — broker, detection, tracker, controller — is designed to run identically against a PX4 SITL simulator and the real drone. Only the connection endpoint and camera source change (a UDP/RTSP simulator address vs. a real MAVSDK/RTSP-USB one), and the same docker-compose file brings up the full stack in both modes. Testing everything on the simulator first, then swapping two config values for the real flight, has saved a lot of drone crashes.',
      },
      { type: 'h2', text: 'What\'s next' },
      { type: 'li', text: 'A one-shot training pipeline: data prep → train → export → RKNN convert in a single Makefile.' },
      { type: 'li', text: 'Dataset-mixing tooling to combine VisDrone with other datasets into custom training sets.' },
      { type: 'li', text: 'Splitting the ByteTrack tracker out of the C++ detection binary into its own Python service, so other trackers become easy to swap in.' },
      { type: 'li', text: 'A web dashboard for configuration, control, and deployment.' },
    ],
  },
  {
    slug: 'esp32-round-tft-gc9a01-widgets',
    title: 'Driving a Round GC9A01 TFT with an ESP32: Analog Meters, Graphs, and Color Debugging',
    date: '2026-02-06',
    excerpt:
      'Wiring and driving a 240×240 round GC9A01 display from an ESP32 with PlatformIO — an animated analog gauge, a real-time multi-trace graph widget, and a color/inversion diagnostic tool.',
    cover: '/articles/esp32-round-tft-lcd/analog_meter.gif',
    images: [
      '/articles/esp32-round-tft-lcd/connections.png',
      '/articles/esp32-round-tft-lcd/analog_meter.gif',
      '/articles/esp32-round-tft-lcd/graph.gif',
      '/articles/esp32-round-tft-lcd/color_test.gif',
    ],
    content: [
      {
        type: 'p',
        text: 'A round 240×240 GC9A01 TFT display looks great for gauges and dashboards, but wiring it up and getting the colors right the first time always takes a bit of trial and error. This repo is three small PlatformIO demos built around the same ESP32 + GC9A01 wiring, using the TFT_eSPI and TFT_eWidget libraries.',
      },
      { type: 'h2', text: 'Wiring it up' },
      {
        type: 'p',
        text: 'The display talks SPI: MISO/MOSI/SCLK plus chip-select, data/command, and reset lines, powered from the ESP32\'s 3.3V rail.',
      },
      { type: 'img', src: '/articles/esp32-round-tft-lcd/connections.png' },
      { type: 'h2', text: 'Configuring TFT_eSPI without touching User_Setup.h' },
      {
        type: 'p',
        text: 'Normally TFT_eSPI needs you to hand-edit a User_Setup.h file buried in the library folder — annoying to keep track of across projects. Instead, every display setting (GC9A01 driver, 240×240 resolution, 40MHz SPI for writes / 20MHz for reads, font support) is passed as PlatformIO build flags in platformio.ini. Clone the repo, open it in PlatformIO, and it just builds.',
      },
      { type: 'h2', text: 'Demo 1 — Animated analog meter' },
      {
        type: 'p',
        text: 'An animated speedometer-style gauge using TFT_eWidget, with four color-coded zones (green/yellow/orange/red) across a simulated 0–2.0 m/s range. A sine wave drives the needle through the full range so you can see all four zones and the smooth animation, updating every 35ms.',
      },
      { type: 'img', src: '/articles/esp32-round-tft-lcd/analog_meter.gif' },
      { type: 'h2', text: 'Demo 2 — Real-time multi-trace graph' },
      {
        type: 'p',
        text: 'A 200×150 pixel scrolling graph with grid lines, plotting a live sawtooth wave in multiple colors. It resets and starts a new trace automatically once it reaches the right edge — useful as a starting point for plotting any live sensor value.',
      },
      { type: 'img', src: '/articles/esp32-round-tft-lcd/graph.gif' },
      { type: 'h2', text: 'Demo 3 — Color order and inversion diagnostics' },
      {
        type: 'p',
        text: 'The most useful demo when bringing up a new display: it cycles text colors and toggles display inversion so you can immediately spot a common problem — red and blue swapped because the panel uses BGR pixel order instead of RGB. The fix is either a one-line invertDisplay(true) call or adjusting the RGB order bit in the MADCTL register.',
      },
      { type: 'img', src: '/articles/esp32-round-tft-lcd/color_test.gif' },
      { type: 'h2', text: 'Pitfalls I hit' },
      { type: 'li', text: 'Colors swapped: almost always a BGR vs RGB order issue — try inverting the display first.' },
      { type: 'li', text: 'Flicker: lower the SPI frequency (from 40MHz to 20MHz), use shorter/better wires, and add a 10–100µF capacitor across VCC/GND near the display.' },
      { type: 'li', text: 'Nothing shows up: double-check the display is actually a GC9A01 (not an ILI9341) — the driver and command set are not interchangeable.' },
    ],
  },
  {
    slug: 'freertos-mutex-synchronization-esp32',
    title: 'FreeRTOS on ESP32: Synchronizing Two Tasks Fighting Over One LED with Mutexes',
    date: '2026-02-01',
    excerpt:
      'A hands-on FreeRTOS starter on ESP32 — two tasks blinking the same LED at different rates, and the mutexes that stop them from corrupting each other\'s output.',
    cover: '/articles/freertos-esp32-mutex-tasks/architecture.svg',
    images: ['/articles/freertos-esp32-mutex-tasks/architecture.svg'],
    content: [
      {
        type: 'p',
        text: 'This is a small FreeRTOS starter project on ESP32: two tasks — BlinkTask (1 second on/off) and BlinkFastTask (250ms on/off) — both want to control the same LED and print to the same serial port. Without protection, that collision is exactly the kind of bug that\'s obvious in hardware and confusing in the logs.',
      },
      { type: 'h2', text: 'The problem: two tasks, one LED' },
      {
        type: 'p',
        text: 'Run both tasks unsynchronized and you get garbled, interleaved serial output — "BlinkTask: LBlinkFastTask: LED ED ONON" instead of two clean lines — plus unpredictable LED behavior, because one task can switch the LED state mid-way through the other task\'s "on" phase.',
      },
      { type: 'h2', text: 'Mutexes: a key to a locked room' },
      {
        type: 'p',
        text: 'A mutex (mutual exclusion) guarantees only one task touches a shared resource at a time — xSemaphoreTake() blocks until the resource is free, xSemaphoreGive() releases it. This project uses two separate mutexes: one for the LED GPIO, one for the serial port, so a complete blink cycle and a complete print statement each happen atomically.',
      },
      { type: 'h2', text: 'Consistent lock ordering prevents deadlock' },
      {
        type: 'p',
        text: 'Both tasks always take ledMutex first, then serialMutex — and release them in reverse order. If one task acquired them in the opposite order, the two tasks could each end up holding one mutex while waiting forever for the other — a classic deadlock. The fix is simple in hindsight but easy to get wrong under pressure: always acquire shared locks in the same order, everywhere in the codebase.',
      },
      { type: 'h2', text: 'Pinning tasks to a core' },
      {
        type: 'p',
        text: 'xTaskCreatePinnedToCore() lets you pin a task to one of the ESP32\'s two cores. Core 0 typically runs the WiFi/Bluetooth stack, so both BlinkTask and BlinkFastTask are pinned to Core 1 to keep them isolated from radio work — even though on a single core they still need the mutexes, since FreeRTOS time-slices same-priority tasks on that core.',
      },
      { type: 'h2', text: 'What I\'d add next' },
      { type: 'li', text: 'Queues — pass data between tasks without a shared variable at all.' },
      { type: 'li', text: 'Semaphores — signal an event from one task to another rather than protecting a resource.' },
      { type: 'li', text: 'Event groups — wait on multiple conditions at once.' },
      { type: 'li', text: 'Direct-to-task notifications — a lighter-weight alternative to a full semaphore for simple signaling.' },
    ],
  },
];
