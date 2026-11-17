# All My Work

> A comprehensive catalog of projects, scripts, tools, and frameworks created by **Harshvardhan Joshi** (GAM3RG33K).
> Twitter-sized descriptions: What, Why, How (with tech stack).
>
> **Legend:**
> - **[CREATED BY ME]** - Original work, 100% authored
> - **[CLIENT PROJECT]** - Built for a client (team collaboration)
>
> **Order:** AI Projects → AI Tools → AI Skills → Non-AI Recent Tools → Non-AI Recent Projects → Client Projects → Everything else (recent first).

---

## AI Projects

**pixel-press** | Project (Desktop app)
What: A local-first, offline-only desktop video compressor built with Tauri (Rust + React). Uses on-device LLM inference via llama.cpp (SmolLM2-360M GGUF) to translate plain-language intent into FFmpeg encode plans.
Why: Compress videos without uploading anything to the cloud — no subscription, no watermark, full privacy.
How: Rust backend with native FFmpeg and llama.cpp subprocesses, React + Tailwind + shadcn/ui frontend, Bun build pipeline, GitHub Actions CI releasing DMG and AppImage/.deb for macOS and Linux.
GitHub: https://github.com/GAM3RG33K/pixel-press

**mcp-harshjoshi-work** | Project (MCP server)
What: An MCP server that exposes my project catalog and professional profile as searchable tools.
Why: Demonstrates MCP server design, context/retrieval engineering, and tool-use for AI agents.
How: TypeScript + official MCP SDK + stdio transport; parses Markdown sources into a queryable catalog; includes a 6-case eval harness.
GitHub: https://github.com/GAM3RG33K/mcp-harshjoshi-work

**local-rag** | Project (notebook)
What: Local RAG system for PDF resume review and cover letter generation using LangChain + Ollama.
Why: Enables private, local document analysis without sending sensitive resume data to cloud APIs.
How: Built with Python, LangChain, Ollama (llama3), DocArrayInMemorySearch, Jupyter Notebook.

**local_webscraper** | Script
What: Streamlit AI-powered web scraper using ScrapeGraphAI + local Ollama models.
Why: Provides a simple interface to extract structured data from any URL using natural language prompts.
How: Built with Python, Streamlit, ScrapeGraphAI, Ollama.

**civit-ai-gallery** | Project
What: A Pinterest-style masonry image gallery that fetches and displays AI-generated art from the CivitAI public API.
Why: Provides a beautiful, responsive way to browse CivitAI's vast library of AI art with validated, type-safe metadata.
How: Built with Next.js, TypeScript, Zustand for state, Zod for validation, and Axios for API calls; deploys as a static export to GitHub Pages.

---

## AI Tools

**ai-cache-cleaner** | Tool
What: Zero-dependency Bash tool for cleaning AI coding tool caches on macOS/Linux/Windows.
Why: AI editors accumulate gigabytes of cache; this tool cleans them all in one go with interactive selection.
How: Pure Bash with ANSI TUI, supports 8+ AI tools including Cursor, Windsurf, Claude Code, OpenCode.

**ollama-optimizer.sh** | Tool
What: An interactive TUI that creates optimized Ollama model variants with custom context window sizes and names from any locally pulled model.
Why: Ollama's default context windows are often larger than needed, wasting VRAM.
How: Bash script with `ollama list` for model discovery, generates temporary `Modelfile` with `PARAMETER num_ctx`, runs `ollama create`.

**mac-quantizer** | Tool
What: A quantization toolkit for compressing ML models on Apple Silicon Macs, specifically optimized for DrawThings integration.
Why: Reduces model sizes by 50-70% (5-bit/8-bit) enabling large models to run on consumer Macs with limited RAM while maintaining quality.
How: Uses PyTorch (torch-ao), Metal Performance Shaders (MPS), safetensors format, and aria2c for fast downloads, with conda/venv environment management.

**ai-cache-cleaner.sh** | Tool
What: An interactive TUI tool that clears cache and chat history files from 8 AI dev tools with optional backup.
Why: AI editors and assistants accumulate gigabytes of cache and chat data that eat disk space.
How: Pure Bash with ANSI TUI (arrow-key navigation, braille spinners), `du`/`df` for size accounting, background `rm -rf` cleanup jobs.

---

## AI Skills

Reusable skills for AI coding agents.

**react-native-performance-analyzer** | Agent Skill
What: AI agent skill that analyzes, improves, and validates React Native app performance.
Why: Finds real bottlenecks, applies safe surgical fixes, and proves results in release mode.
How: Reusable skill workflow with analysis templates and report formats.
GitHub: https://github.com/GAM3RG33K/react-native-performance-analyzer

**omniframe** | Agent Skill
What: AI agent skill for video search and keyframe extraction from any local video.
Why: Helps agents find moments, scenes, objects, or visual details in screen recordings, reels, camera footage, or movies.
How: Pure prompt/skill file using standard FFmpeg/ffprobe commands; no dependencies.
GitHub: https://github.com/GAM3RG33K/omniframe

**git-what** | Agent Skill
What: AI agent skill that generates release notes, commit summaries, and verification checklists from git history.
Why: Turns git history into plain, paste-ready summaries for release management and personal work reports.
How: Pure prompt/skill file using standard git commands.
GitHub: https://github.com/GAM3RG33K/git-what

---

## Non-AI Recent Tools

**project-cleaner.sh** | Tool
What: An interactive TUI that batch-runs custom cleanup commands across multiple client project directories with admin privileges.
Why: Running clean scripts across four separate project directories manually is repetitive.
How: Bash script with tput-based arrow-key TUI, `sudo -v` for credential caching, parallel `eval` of per-project commands.

**dev-cleaner** | Tool
What: A one-click interactive cleanup utility that removes development junk files from Xcode, Flutter, Gradle, npm, Homebrew, and IDE caches to reclaim 50-100GB+ of disk space.
Why: Developers accumulate massive build artifacts and dependency caches across multiple ecosystems, and cleaning each one manually with different commands is time-consuming and easy to forget.
How: Bash script with an interactive menu (tput-based TUI), recursive `find` for Flutter projects (pubspec.yaml detection), `rm -rf` for cache directories, and Homebrew tap support for macOS/Linux installation.

**perfmon-lite** | Tool
What: A blistering-fast, terminal-based mobile profiler that monitors CPU, memory, and thread telemetry for Android and iOS apps in real time.
Why: Gives mobile developers instant, zero-setup performance visibility without heavy IDE tools -- just connect a device and see live btop-style charts in your terminal.
How: Written in Go using Bubble Tea for the TUI and Lipgloss for styling, with ADB for Android and xcrun for iOS; exports to JSON, Markdown, HTML, and PDF; ships as a single cross-platform binary.
GitHub: https://github.com/GAM3RG33K/perfmon-lite

**resume-generator** | Tool/Project
What: A headless PDF generation API server that fetches resume JSON data, renders it through configurable templates, and returns polished PDF binaries.
Why: Provides a fast, template-driven, API-only way to programmatically generate customized resume PDFs without a headless browser.
How: Built with Node.js, TypeScript, Fastify for HTTP, pdfmake for PDF rendering, in-memory content-hash caching, and deployed via Docker/CapRover.

**mac_htop.sh** | Tool
What: A zero-dependency, htop-style real-time macOS system monitor that displays live CPU, RAM, disk usage, and GPU/VRAM info as colored progress bars in the terminal.
Why: macOS lacks a built-in visual resource monitor and installing htop via Homebrew is overkill when you just need a quick glance at system health.
How: Pure Bash using `top -l 1` for CPU, `sysctl hw.memsize` + `vm_stat` for RAM, `df` for disk, `tput` for cursor control.

---

## Non-AI Recent Projects

**flutter_live_activities** | Framework/Plugin (Flutter)
What: Flutter plugin for iOS 16.1+ Live Activities and Dynamic Island features.
Why: Enables Flutter developers to implement real-time updates and Dynamic Island interactions on iOS devices.
How: Built with Flutter/Dart, integrates with Apple's ActivityKit API for live notifications.

**linkstack** | Project
What: Self-hosted "link in bio" tool with Vite + React + TailwindCSS.
Why: Provides a personal link aggregation page similar to LinkTree but self-hosted for full control.
How: Built with Vite, React, TailwindCSS, deployed to links.harshjoshi.dev.

**lite-wait** | Tool/Project
What: Lightweight waitlist management app with Python Flask and SQLite.
Why: Simple, self-hosted solution for managing email waitlists for product launches.
How: Built with Python Flask, SQLite, HTML/CSS templates.

---

## Client Projects

Built for clients or former employers.

**memed-app** | Project (Flutter monorepo)
What: Mobile content platform.
How: Built with Flutter (Dart) in a Melos monorepo sharing core logic via `solo_core`, using BLoC/Cubit state management, Socket.IO for real-time updates, Firebase, Sentry, and GoRouter.

**solo-app** | Project (Flutter monorepo)
What: Creator economy platform.
How: Flutter mobile app (BLoC/Cubit, GoRouter, Dio, Socket.IO) + React/TypeScript web dashboard (Vite, Tailwind, Radix/shadcn) + Node.js/Express API with Cashfree payments and AWS S3.

**VibeDiary** | Project (Full product suite)
What: Voice-first AI journaling companion.
How: Flutter mobile app (Riverpod, Dio, speech_to_text) + Node.js/Express backend with pluggable AI layer supporting Google Gemini, OpenAI GPT-4o-mini, and Anthropic Claude.

**haptic_youtube_poc** | Project (Flutter POC)
What: Flutter proof-of-concept for haptic feedback synced with YouTube video playback.
How: Built with Flutter using Method Channels for native haptic integration.

**ForTime Timer** | Project (Flutter App)
What: A simple, customizable workout timer for functional fitness enthusiasts supporting modes like For Time, EMOM, Tabata, and Fight Gone Bad.
How: Built with Flutter (Dart) using modular OOP architecture with stream-based state management.

**oddjobs** | Project (Full-stack web)
What: Job referral marketplace.
How: Next.js 15 (App Router, TypeScript) with React 19, TipTap editor, Radix UI, Tailwind CSS, MongoDB, Zustand, Twilio SMS.

**goreach-app** | Project (React Native)
What: Guided onboarding experience for a fintech wealth advisory product.
How: React Native 0.82 (TypeScript strict, React 19) with Zustand, React Navigation, Reanimated v4, Google OAuth.

**tatva-app** | Project (React Native)
What: News and article reading app with social features.
How: React Native 0.82 (TypeScript strict, React 19) with Zustand, React Navigation v7, Firebase Cloud Messaging, Notifee, Better Auth.

**nextp** | Project (Web app)
What: Enterprise web app for transfer pricing compliance workflows.
How: React + TypeScript with Vite, shadcn-ui, Tailwind CSS, TanStack Query, CKEditor, Firebase Hosting.

**goreach-mfd-customer-server** | Project (Backend)
What: Spring Boot backend for a mutual fund distribution platform.
How: Built with Java 25, Spring Boot 4, PostgreSQL, Flyway, Redis, Google OAuth, JWT auth.

---

## Everything Else

**art-flow-app** | Project (Flutter App)
What: A mobile app for discovering, browsing, and setting AI-generated wallpapers from Civitai as your device background.
Why: It makes it effortless to find stunning AI art and personalize your phone with one tap, with favorites stored locally for privacy.
How: Built with Flutter/Dart using Material Design 3, dio for API calls, cached_network_image, flutter_card_swiper, and native Method Channels for wallpaper setting.

**steps_ahead** | Project (Flutter App)
What: A personal footsteps and fitness tracker that counts steps, estimates calorie burn, and motivates users to reach daily activity goals.
Why: It keeps all health data local on-device for privacy while providing visual progress tracking and goal-setting to encourage consistent exercise.
How: Built with Flutter using the Pedometer API for step counting, local storage for data persistence, and a clean UI inspired by the Forest app.

**your_compass** | Project (Flutter App)
What: A digital companion for the YearCompass booklet, guiding users through reflecting on the past year and planning the next one.
Why: It makes the annual planning process more accessible and convenient by digitizing the YearCompass experience with offline capability and data privacy.
How: Built with Flutter using local storage for all user data, offering sections for life evaluation, goal setting, and action planning.

**basecamp-book-extractor** | Tool
What: Extracts content from Basecamp (specifically "Shape Up" book) via HTML TOC parsing.
Why: Convert Basecamp book content into cohesive, readable format.
How: Python scripts (`bookify.py`, `extract_toc.py`) for HTML parsing and PDF generation.

**ffmpeg wrappers** | Tool
What: Simple wrapper scripts for video to GIF/MP4 conversion.
Why: Quick one-liner commands for common video conversion tasks.
How: Bash scripts wrapping ffmpeg with sensible defaults.

### Scripts

| Name | Type | Summary |
|------|------|---------|
| **aab-certs.sh** | Script | Extracts signing certificate fingerprints from Android AAB files |
| **aab-to-apk.sh** | Script | Converts Android App Bundles to universal APK files using bundletool |
| **apk-certs.sh** | Script | Extracts signing certificate fingerprints from Android APK files |
| **de-bug.sh** | Script | Uninstalls Android debug apps from connected devices via ADB |
| **delete-stale-branches.py** | Script | Identifies and lists merged/stale Git branches, outputs to CSV |
| **delete-tag-remote.sh** | Script | Deletes a remote Git tag from origin |
| **executor.sh** | Script | Generic two-command sequential executor with interactive input |
| **git-summrizer.sh** | Script | Exports Git commit range to text file with messages and diffs |
| **mac-tools** | Tool | macOS utilities: Homebrew maintenance menu and architecture switcher |
| **md_xform** | Tool | Python Markdown converter to HTML, DOCX, PDF, or plain text |
| **mongodb-backup.sh** | Script | Dumps remote MongoDB and restores locally with rename/restore options |
| **project-utils** | Project | Go microservice orchestration scripts with per-service management |
| **reset-clean-flutter.sh** | Script | Kills Dart processes, clears caches, runs flutter clean/pub get |
| **reset-ios-pods.sh** | Script | Full Flutter CocoaPods reset and reinstall |
| **switch-arch.sh** | Script | Toggles Homebrew between Apple Silicon and Intel configurations |

---

## Summary Statistics

| Category | Count |
|----------|-------|
| AI Projects | 5 |
| AI Tools | 4 |
| AI Skills | 3 |
| Non-AI Recent Tools | 5 |
| Non-AI Recent Projects | 3 |
| Client Projects | 10 |
| Everything Else | 5 + 15 scripts |
| **Total** | **50** |

---

## Tech Stack Overview (My Projects Only)

- **AI / Agents:** MCP, LangChain, Ollama, OpenRouter, llama.cpp, RAG, prompt engineering
- **Mobile:** Flutter (14 projects), React Native (3 projects)
- **Web:** Next.js (5 projects), React (3 projects), Vite (2 projects)
- **Backend:** Node.js/TypeScript (3), Python (4), Go (2), Java/Spring Boot (1)
- **Database:** MongoDB (2), PostgreSQL (2), SQLite (2), Redis (1)
- **DevOps:** Docker (2), Firebase (3), AWS S3 (1), Supabase (1), GitHub Actions
- **Languages:** Dart/Flutter, TypeScript, JavaScript, Python, Go, Java, Bash

---

*Last updated: 2026-11-05*
*Authorship verified via git logs, remotes, and README analysis.*
*Projects marked as Created By Me are authored by Harshvardhan Joshi (GAM3RG33K).*
