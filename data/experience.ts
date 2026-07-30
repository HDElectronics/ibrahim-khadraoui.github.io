import { Experience } from '@/types';

export const experience: Experience[] = [
  {
    company: 'Technology Innovation Institute (TII)',
    location: 'Abu Dhabi, UAE',
    period: 'Mar 2022 – Present',
    roles: [
      { title: 'Senior AI Engineer', period: 'Nov 2025 – Present' },
      { title: 'AI Engineer', period: 'Jul 2024 – Nov 2025' },
      { title: 'Research Engineer', period: 'Mar 2022 – Jul 2024' },
    ],
    focuses: [
      {
        label: 'Edge AI & Embodied Intelligence',
        period: '2024 – Present',
        bullets: [
          'Own the inference and deployment path for FalconVLA, TII’s 8B vision-language-action model family, from PyTorch research checkpoint to a running policy on physical bimanual robot hardware.',
          'Optimized a model’s TensorRT path to run 1.72× faster than PyTorch (101.4 ms vs 174 ms per query) at identical action accuracy.',
          'Authored the upstream Falcon-H1 implementation in llama.cpp (merged PR ggml-org/llama.cpp#14534), and implemented Falcon3VLM support — vision tower, projector, tokenizer, and HF→GGUF converters.',
          'Ported the same models to MLX for native inference on Apple silicon.',
          'Built voice2action, a multi-service conversational robot control platform — LangGraph agent with confirm-before-execute, VLM scene grounding, self-hosted ASR/TTS, three-camera WebRTC streaming, and 3D URDF visualisation.',
          'Fine-tuned large language models with LoRA and detection models for downstream deployment.',
          'Mentored new joiners and interns, and reviewed pull requests from BlueOC, an external vendor building a VLM + object-detection surveillance pipeline.',
        ],
      },
      {
        label: 'UAV, Immersive & Streaming Systems',
        period: '2022 – 2024',
        bullets: [
          'Engineered a VR-controlled UAV system operated remotely over 70 km on a 5G network, with live 360° video — airframe and electronics, cloud control pipeline, and haptic feedback conveying real-time telemetry. Demonstrated publicly at GITEX Dubai 2022 and featured by NAS Daily.',
          'Designed and built a smart glove from scratch — board layout, soldering, and firmware — used as the drone’s control interface.',
          'Collaborated with the Live in Five team on the A2RL autonomous racing competition: decoded the full EMM protocol and developed the camera-view switching algorithm used for the viewer experience.',
          'Built a VR application in A-Frame for visualising Gaussian splatting models produced at TII.',
          'Awarded the Nova Award for the quarter, in a research environment of senior scientists.',
        ],
      },
    ],
    tags: [
      'TensorRT',
      'llama.cpp',
      'ggml',
      'MLX',
      'vLLM',
      'ROS 2',
      'C++',
      'Python',
      'WebRTC',
      'MQTT',
    ],
  },
  {
    company: 'Freelance — PCB Design & Embedded C/C++',
    location: 'Remote',
    period: '2018 – 2022',
    roles: [{ title: 'PCB Design & Embedded Engineer', period: '2018 – 2022' }],
    focuses: [
      {
        label: 'Hardware and firmware for IoT products',
        bullets: [
          'Worked directly with companies to build smart IoT solutions end to end — schematic capture and PCB layout, through firmware, up to the platform running on top.',
          'Delivered complete hardware and firmware prototypes for universities, researchers, and startups, covering the full path from concept to a reliable working device.',
        ],
      },
    ],
    tags: ['KiCad', 'STM32', 'ATmega328P', 'Embedded C', 'IoT'],
  },
];
