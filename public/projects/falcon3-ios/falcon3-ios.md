# Falcon3 Multimodal Agent — iOS
### On-device conversational AI on iPhone

---

## Overview

A fully **on-device** voice conversational agent running on iPhone. The user speaks a question (optionally about what the camera sees) and gets a spoken answer back — no cloud, no API keys, everything runs locally on Apple Silicon.

The core is **Falcon3**, our vision-language model, which I **integrated on Apple's MLX framework** so it runs natively and efficiently on the iPhone's Neural Engine / GPU. Around it sits an ASR front-end (speech → text) and a TTS back-end (text → speech) to make a complete voice-in / voice-out loop.

---

## Pipeline

1. **ASR** — captures the user's speech and transcribes it to text.
2. **Falcon3 VLM (MLX)** — takes the transcribed question plus an optional image from the camera and generates a natural-language response, running entirely on-device via MLX.
3. **TTS** — synthesizes the response back into spoken audio.

See `architecture.mmd`.

---

## Why MLX

MLX is Apple's array framework built for Apple Silicon's unified memory. Porting Falcon3 to MLX lets the model share memory with the iPhone's GPU/Neural Engine and run inference locally within the phone's memory budget — giving a private, offline, low-latency assistant with no server round-trips.

---

## Highlights

- Fully **offline** — no cloud, no API calls
- **Falcon3** VLM integrated on **MLX** for native iPhone inference
- Real-time **speech-to-speech** with optional visual grounding
- Sibling to [Falcon](../falcon) (same multimodal idea, Jetson Orin edge platform)

---

*TII, Abu Dhabi. Demo video: `ios-app-demo.mp4`.*
