import { About } from '@/types';

export const about: About = {
  bioParagraphs: [
    'I’m an ML systems engineer who takes research models all the way to production hardware. I own the full path — architecture port, quantization, compiler work, serving layer, and the robot or edge device it finally runs on.',
    'Eight years of engineering across embedded systems, UAV and streaming platforms, and for the last two years large language and vision-language-action models at the Technology Innovation Institute, where I have brought model inference down from seconds to milliseconds while holding numerical parity against the reference implementation.',
    'What I enjoy most is using models to build real applications — taking something that works only in a research notebook and turning it into a system a person or a robot can actually use. That is why my work tends to end at a working device rather than at a benchmark table.',
  ],
  skillGroups: [
    {
      label: 'Inference optimization',
      items: ['TensorRT', 'MLX', 'ggml / GGUF', 'llama.cpp', 'ONNX Runtime', 'RKNN'],
    },
    {
      label: 'LLM / VLM serving',
      items: [
        'vLLM',
        'SGLang',
        'TensorRT-LLM',
        'TTFT & throughput benchmarking',
        'Whisper (ASR)',
        'Piper (TTS)',
      ],
    },
    {
      label: 'Model adaptation',
      items: ['LoRA fine-tuning', 'Object detection fine-tuning', 'YOLOv5', 'VLM / VLA'],
    },
    {
      label: 'Robotics & control',
      items: [
        'ROS 1',
        'ROS 2',
        'MoveIt',
        'Nav2',
        'SLAM Toolbox',
        'Inverse kinematics',
        'Mobile ALOHA',
      ],
    },
    {
      label: 'Drones / UAV',
      items: ['PX4', 'MAVLink', 'MAVSDK', 'Frame assembly', 'Firmware flashing', 'PID tuning'],
    },
    {
      label: 'Video & media',
      items: ['H.264 / H.265', 'WebRTC', 'RTMP / RTSP', 'FFmpeg', 'GStreamer'],
    },
    {
      label: 'Communication protocols',
      items: ['MQTT', 'AMQP / RabbitMQ', 'ZeroMQ', 'HTTP / REST', 'WebSocket', 'Bluetooth BLE'],
    },
    {
      label: 'Systems & infrastructure',
      items: ['Linux internals', 'Docker / Compose', 'systemd / udev', 'FastAPI'],
    },
    {
      label: 'Hardware',
      items: [
        'KiCad',
        'EasyEDA',
        'Schematic capture',
        'PCB layout',
        'STM32',
        'ESP32',
        'ATmega328P',
      ],
    },
    {
      label: 'Languages',
      items: ['Python (expert)', 'C++ / C (strong, low-level)'],
    },
  ],
  hobbies: [
    {
      title: 'FPV Drone Flying',
      text: 'I fly FPV using a real FPV drone controller, mostly through FPV drone simulator games for now.',
    },
    {
      title: 'DCS World',
      text: 'Combat flight simulation with a joystick and a VR headset. I know how to pilot the Su-25T.',
      media: [{ type: 'img', src: '/about/dcs.jpg' }],
    },
    {
      title: 'PCB Design',
      text: 'Now that I work in AI day to day, PCB design has become more of a hobby — I still take on the occasional board.',
    },
  ],
  languages: ['Arabic (native)', 'French (fluent)', 'English (professional)'],
};
