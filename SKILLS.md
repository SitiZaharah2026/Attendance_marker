# SKILLS.md — CelikSense AI Claude Code Guide

## Project Identity
Project name: CelikSense AI: Agentic Multi-Sensory Learning Ecosystem
Tagline: Knowledge Without Barrier, Intelligence Without Limits.

## Main Goal
Build a bilingual, inclusive, Agentic AI web prototype for learners with disabilities and learning differences, especially:
- Blind learners
- Low-vision learners
- Deaf / hard-of-hearing learners
- ADHD learners
- Dyslexic learners

## Language Requirement
Every major page should support:
- English
- Bahasa Melayu

Use a language selector:
- English
- Bahasa Melayu

When language changes, update page titles, descriptions, button labels, agent names, and audio instruction text.

## Accessibility Requirements
Always include:
- Clear headings
- Large readable text
- High contrast
- Keyboard-friendly buttons
- Text-to-Speech support for blind users
- Adjustable reading support for dyslexia
- Focus support for ADHD
- Simple layout with reduced distractions

## Agentic AI Behavior Pattern
Each agent should follow:
Observe → Analyze → Decide → Recommend → Act → Monitor → Improve

For prototype mode, simulate the logic using HTML, CSS, and JavaScript.

## Required Pages
- index.html
- login.html
- signup.html
- dashboard.html
- ai-librarian.html
- reading-companion.html
- adhd-agent.html
- dyslexia-agent.html
- accessibility-agent.html

## ADHD Adaptive Reading Agent Features
Include:
- Reading Window Mode
- Micro-reading session timer: 5, 10, 15 minutes
- Text-to-Speech
- Focus break recommendation
- Multi-book reading strategy
- Hyperfocus interest detection
- Smart highlighting
- AI Note Builder
- ADHD intervention recommendations

## Dyslexia Adaptive Reading Agent Features
Include:
- Dyslexia-friendly font option
- Large text mode
- Adjustable line spacing
- Color overlay options: yellow, blue, green, grey, pink
- Text-to-Speech
- Audiobook companion mode
- Reading ruler / reading window
- Pre-reading skimming guide
- Visual mind map output
- Dyslexia intervention recommendations

## Blind Learner Audio Support
Include:
- Audio Guide button
- Read Text Aloud button
- Stop Audio button
- Use Web Speech API:
  - SpeechSynthesisUtterance
  - speechSynthesis.speak()
  - speechSynthesis.cancel()

## Coding Style
Use simple HTML, CSS, and JavaScript first.
Do not require a backend unless requested.
Keep pages easy to understand for beginners.
Use separate files when possible:
- style.css
- script.js

## Recommended Tools
VS Code extensions:
- Live Server
- Prettier
- HTML CSS Support
- Auto Rename Tag
- JavaScript ES6 snippets
- Code Spell Checker

Claude Code usage:
- Use slash commands from .claude/commands
- Build one feature at a time
- Test with Live Server after each change
