# AGENTS.md — Guidance for AI coding agents

Purpose
- Provide concise, actionable instructions for AI coding agents working on the CelikSense UI, with a focus on the **AI Settings** tab.

What to look at first
- Settings UI: [starter-code/settings.html](starter-code/settings.html) — the AI tab markup and client-side handlers.
- Shared runtime: [starter-code/shared.js](starter-code/shared.js) — the global `CS` object (language, accessibility, TTS, Groq client, user/profile, analytics).
- Project overview and local run hints: [README.md](README.md)

Key concepts an agent should know (AI tab)
- API key handling: the UI stores Groq keys in localStorage under `cs_groq_key`. Do not commit secrets to source control.
- Groq client: use `CS.groq` methods (e.g. `CS.groq.summarise`, `CS.groq.testConnection`) — implementation lives in `shared.js`.
- Preferences: AI feature toggles are saved to localStorage as `cs_prefs` via helper functions (see `savePref` in `settings.html`).
- Text/translation: UI strings are defined in `CS_LANG` inside `shared.js` — modify there for copy or new translation keys.
- No backend: the app is client-only; persistent state uses `localStorage` keys: `cs_groq_key`, `cs_user`, `cs_a11y`, `cs_analytics`, `cs_lang`, `cs_prefs`.

Guidance for edits and tests
- When changing the AI tab UI, update both `settings.html` and any `CS` helpers in `shared.js` (search for `groq`, `user`, `a11y`, `analytics`).
- Respect privacy: keep API keys client-only and avoid adding code that transmits keys to external servers.
- Local testing: run a static file server and open `starter-code/settings.html`. A minimal command:

  - `python -m http.server 8000` (in the repository root) — then open `http://localhost:8000/starter-code/settings.html`.

- Use browser devtools to inspect `localStorage` when writing tests for preference saving and `CS.groq.testConnection()` behaviour.

Common patterns and pitfalls
- UI uses masked API key preview pattern: input shows `••••` + last 4 chars; `saveKey()` validates prefix used in the placeholder.
- Many functions assume `CS` helpers exist — add new helper methods to `shared.js` rather than scattering logic across pages.
- Translation keys live in `CS_LANG` — new UI labels should add keys there, then call `CS.lang.t('key')` in templates.

When to create or update more customization files
- If the repo gains a backend or build system, add a `.github/copilot-instructions.md` with CI commands and environment secrets handling.
- For larger subsystems (e.g., TTS or analytics), create focused `AGENTS-tts.md` or skills in `prompts/` documenting expected behaviours and test fixtures.

Files added/modified by this change
| File | Why it helps an AI agent |
|---|---|
| [AGENTS.md](AGENTS.md) | Quick, focused guide to the AI Settings tab, `CS` helpers, storage keys, and testing notes.

Next steps for you
- Tell me if you want this content moved to `.github/copilot-instructions.md` instead, or if you want additional focused agent instructions (TTS, Groq client, analytics).
