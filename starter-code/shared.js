/**
 * ============================================================
 * CelikSense AI — Shared JavaScript Library
 * File: js/shared.js
 *
 * PURPOSE:
 * This file contains ALL shared functions used across every
 * page in the CelikSense AI project. Instead of copying the
 * same code into every HTML file, each page just links to
 * this one file with:
 *   <script src="js/shared.js"></script>
 *
 * WHAT IS INSIDE:
 *   1. Language System  — bilingual English / Bahasa Melayu
 *   2. Accessibility    — font, contrast, overlay, zoom
 *   3. TTS Engine       — Text-to-Speech with correct voice
 *   4. Voice Engine     — Speech Recognition (voice commands)
 *   5. Gemini AI Client — connect to Google Gemini API (gemini-2.0-flash)
 *   6. User Profile     — save / load learner settings
 *   7. Analytics        — track sessions and focus score
 *   8. Toast Messages   — small pop-up notifications
 *   9. Navigation       — mark active nav link
 *
 * HOW TO USE IN ANY HTML PAGE:
 *   1. Add before </body>:
 *        <script src="js/shared.js"></script>
 *   2. Then your page script can call:
 *        CS.tts.speak("Hello")
 *        CS.gemini.summarise(text)
 *        CS.user.getProfile()
 *        CS.lang.t('welcome')
 * ============================================================
 */

/* ============================================================
   SECTION 1 — LANGUAGE SYSTEM
   Stores all text in English and Bahasa Melayu.
   Call CS.lang.t('key') to get the right text automatically.
   Call CS.lang.set('ms') or CS.lang.set('en') to switch.
============================================================ */
const CS_LANG = {
  en: {
    /* Navigation */
    nav_home:        'Home',
    nav_dashboard:   'Dashboard',
    nav_profile:     'My Profile',
    nav_settings:    'Settings',
    nav_lang_switch: 'BM',

    /* Common actions */
    loading:      'Loading...',
    save:         'Save',
    cancel:       'Cancel',
    close:        'Close',
    back:         'Back',
    next:         'Next',
    done:         'Done',
    retry:        'Try again',
    start:        'Start',
    stop:         'Stop',
    pause:        'Pause',
    resume:       'Resume',
    clear:        'Clear',
    read_aloud:   'Read aloud',
    stop_audio:   'Stop audio',
    upload:       'Upload',
    capture:      'Capture',
    copy:         'Copy',
    copied:       'Copied!',
    generate:     'Generate',
    settings:     'Settings',

    /* Accessibility panel */
    a11y_title:         'Accessibility Settings',
    a11y_font_size:     'Text size',
    a11y_font_style:    'Font style',
    a11y_contrast:      'Contrast mode',
    a11y_overlay:       'Colour overlay',
    a11y_tts:           'Text-to-speech',
    a11y_tts_speed:     'Speech speed',
    a11y_captions:      'Show captions',
    a11y_ruler:         'Reading ruler',
    a11y_window:        'Reading window',
    a11y_voice_cmd:     'Voice commands',
    a11y_reset:         'Reset to defaults',
    a11y_font_system:   'System',
    a11y_font_dyslexic: 'OpenDyslexic',
    a11y_font_arial:    'Arial',
    a11y_contrast_normal:   'Normal',
    a11y_contrast_high:     'High contrast',
    a11y_contrast_inverted: 'Inverted',
    a11y_overlay_none:   'None',
    a11y_overlay_yellow: 'Yellow',
    a11y_overlay_blue:   'Blue',
    a11y_overlay_green:  'Green',
    a11y_overlay_grey:   'Grey',
    a11y_overlay_pink:   'Pink',

    /* OCR Agent */
    ocr_title:       'OCR Scanner',
    ocr_upload:      'Upload Image',
    ocr_camera:      'Take Photo',
    ocr_capture:     'Capture Image',
    ocr_retake:      'Retake Photo',
    ocr_extract:     'Extract Text',
    ocr_extracting:  'Extracting text...',
    ocr_read:        'Read Aloud',
    ocr_stop:        'Stop Audio',
    ocr_confidence:  'OCR Confidence',
    ocr_empty:       'Upload or photograph a page to begin.',
    ocr_success:     'Text extracted successfully.',
    ocr_error:       'OCR failed. Please try again.',
    ocr_low_conf:    'Low confidence. Try better lighting.',
    ocr_guide:       'Voice guide activated. Press 2 to upload, 3 to take photo.',

    /* Reading Companion */
    rc_title:        'Reading Companion',
    rc_paste_hint:   'Paste or type your text here...',
    rc_summarise:    'Summarise',
    rc_quiz:         'Generate Quiz',
    rc_simplify:     'Simplify',
    rc_summary_title:'AI Summary',
    rc_quiz_title:   'Comprehension Quiz',
    rc_score:        'Your score',
    rc_correct:      'Correct!',
    rc_wrong:        'Not quite.',
    rc_generating:   'Generating with AI...',
    rc_empty:        'Enter text to get started.',
    rc_level:        'Reading level',
    rc_easy:         'Simple',
    rc_normal:       'Standard',
    rc_deep:         'In depth',

    /* ADHD Agent */
    adhd_title:      'ADHD Focus Agent',
    adhd_timer:      'Focus timer',
    adhd_start:      'Start session',
    adhd_break:      'Take a break',
    adhd_break_msg:  'Great work! Time for a 5-minute break.',
    adhd_resume:     'Resume session',
    adhd_focus:      'Focus score',
    adhd_done:       'Session complete!',
    adhd_distracted: 'Focus seems low. Take a short break?',
    adhd_tip:        'Tip: Read one paragraph at a time.',

    /* Dyslexia Agent */
    dys_title:       'Dyslexia Support',
    dys_font:        'Reading font',
    dys_spacing:     'Letter spacing',
    dys_line_h:      'Line height',
    dys_overlay:     'Colour overlay',
    dys_ruler:       'Reading ruler',
    dys_syllables:   'Syllable split',
    dys_highlight:   'Word highlight',
    dys_sample:      'Sample text',
    dys_hint:        'Adjust settings until reading feels comfortable.',

    /* Blind Audio Agent */
    blind_title:     'Blind Audio Agent',
    blind_activate:  'Activate voice guide',
    blind_test_mic:  'Test microphone',
    blind_commands:  'Voice commands',
    blind_listening: 'Listening...',
    blind_not_heard: 'Not recognised. Please try again.',
    blind_mic_ok:    'Microphone is working.',
    blind_mic_fail:  'Microphone not found. Check browser permissions.',
    blind_intro:     'Welcome to Blind Audio Agent. Say "start guide" for help.',

    /* Early Warning */
    ew_title:        'Learning Health Monitor',
    ew_risk_score:   'Risk score',
    ew_risk_low:     'Low risk',
    ew_risk_moderate:'Moderate risk',
    ew_risk_high:    'High risk',
    ew_risk_critical:'Critical — seek support',
    ew_sessions:     'Sessions this week',
    ew_avg_quiz:     'Avg quiz score',
    ew_avg_focus:    'Avg focus score',
    ew_no_data:      'No data yet. Complete sessions to see your score.',
    ew_recalculate:  'Recalculate',

    /* Intervention */
    int_title:       'Intervention Planner',
    int_generate:    'Generate plan',
    int_generating:  'Creating your personalised plan...',
    int_no_data:     'No risk data found. Use the Early Warning Agent first.',
    int_step:        'Step',
    int_days:        'days',
    int_read_plan:   'Read plan aloud',

    /* AI Librarian */
    lib_title:       'AI Librarian',
    lib_interests:   'Your interests',
    lib_search:      'Find books',
    lib_searching:   'Searching...',
    lib_results:     'Recommended for you',
    lib_no_results:  'No results. Try different interests.',
    lib_read:        'Read recommendation',

    /* Voice */
    voice_start:        'Start listening',
    voice_stop:         'Stop listening',
    voice_denied:       'Microphone permission denied.',
    voice_network_err:  'Network error. Check your connection.',
    voice_not_supported:'Voice commands not supported in this browser.',

    /* Gemini */
    gemini_error:  'AI service unavailable. Using basic mode.',
    gemini_quota:  'Daily AI limit reached. Try again tomorrow.',
    gemini_no_key: 'No Gemini API key set. Add it in Settings.',

    /* Errors */
    err_generic:   'Something went wrong. Please try again.',
    err_offline:   'You are offline. Some features may be limited.',
    err_camera:    'Camera not available. Check browser permissions.',

    /* Homepage / Navigation extras */
    tagline:        'Agentic Multi-Sensory Learning',
    nav_agents:     'Agents ▾',
    nav_signup:     'Sign Up',

    /* Hero section */
    hero_badge:     '8 AI Agents · Inclusive Learning',
    hero_title:     'CelikSense AI',
    hero_subtitle:  'Multi-Sensory Learning Ecosystem',
    hero_tagline:   'Knowledge Without Barrier, Intelligence Without Limits',
    hero_cta1:      'Get Started',

    /* Agents section */
    agents_title:   '8 Agents, One Ecosystem',
    agents_desc:    'Each agent is purpose-built for a specific learning need. Together they form a personalised, adaptive learning system.',

    /* Learner profiles */
    learners_title:   'Supporting Every Learner',
    learner_blind:    'Blind & Low Vision',
    learner_deaf:     'Deaf & Hard of Hearing',
    learner_adhd:     'ADHD',
    learner_dyslexia: 'Dyslexia',
    learner_general:  'All Learners',
    learners_section_desc: 'Inclusive AI tools designed from the ground up for diverse learning needs in Malaysian classrooms and homes.',
    learner_blind_desc:    'Full audio navigation, keyboard shortcuts, and TTS for independent learning.',
    learner_deaf_desc:     'Deaf-friendly reading support with large captions, visual keywords, mind map and fingerspelling guide.',
    learner_adhd_desc:     'Micro-sessions, focus timers, reading windows, and interest-driven engagement.',
    learner_dyslexia_desc: 'Friendly fonts, colour overlays, reading rulers, and mind map visualisation.',
    learner_general_desc:  'AI Librarian, Reading Companion, and Intervention Agent serve every student.',
    learner_blind_agent:   'Blind Audio Agent',
    learner_deaf_agent:    'Visual Communication Agent',
    learner_adhd_agent:    'ADHD Agent',
    learner_dyslexia_agent:'Dyslexia Agent',
    learner_general_agent: 'All 8 Agents',
    /* Stat labels */
    stat_agents:'AI Agents', stat_learner_types:'Learner Types', stat_languages:'Languages', stat_accessible:'Accessible',
    /* Orb tags */
    orb_discover:'DISCOVER', orb_read:'READ', orb_focus:'FOCUS', orb_read_easier:'READ EASIER',
    orb_listen:'LISTEN', orb_sign:'DEAF SUPPORT', orb_monitor:'MONITOR', orb_plan:'PLAN',
    /* How It Works */
    how_title:'How It Works',
    how_desc:'Three steps from signup to a fully personalised, accessible learning experience.',
    how_step1_title:'Set Your Profile', how_step1_desc:'Tell CelikSense about your learning needs, language preference, and interests. Takes under two minutes.', how_step1_btn:'Go to Profile',
    how_step2_title:'AI Adapts for You', how_step2_desc:'The 8 agents automatically configure fonts, audio, overlays, session length, and language to match your profile.', how_step2_btn:'Open Dashboard',
    how_step3_title:'Learn Without Barriers', how_step3_desc:'Read, listen, sign, and explore. The Early Warning Agent monitors your progress and suggests interventions when needed.', how_step3_btn:'Start Reading',
    /* Why */
    why_title:'Why CelikSense AI?', why_desc:'Designed from the ground up for inclusive, accessible, bilingual learning.',
    why1_title:'Truly Agentic AI', why1_desc:'8 specialised agents that communicate and co-ordinate to personalise every session, not just a single chatbot.',
    why2_title:'Bilingual Throughout', why2_desc:'Complete English and Bahasa Melayu support across every agent, every label, and every audio instruction.',
    why3_title:'Built for Access', why3_desc:'Keyboard navigation, ARIA labels, TTS, high-contrast mode, and screen-reader support are first-class features, not add-ons.',
    why4_title:'Adaptive by Default', why4_desc:'Learns your preferences, adjusts fonts, colours, session lengths, and content difficulty automatically session by session.',
    why5_title:'Early Warning System', why5_desc:'Proactively identifies learners at risk and generates personalised, prioritised intervention plans for educators.',
    why6_title:'Multi-Sensory Learning', why6_desc:'Visual, audio, tactile, and sign-language modes mean every learner finds a path that works for their brain.',
    /* CTA */
    cta_badge:'Ready to start?', cta_headline:'Learning that adapts to you',
    cta_sub:'Join educators and learners across Malaysia using CelikSense AI to make reading, comprehension, and communication genuinely accessible.',
    cta_btn1:'Open Dashboard →', cta_btn2:'Create Profile',
    /* Footer */
    footer_tagline1:'Agentic Multi-Sensory Learning Ecosystem for inclusive education in Malaysia and beyond.',
    footer_tagline2:'Knowledge Without Barrier, Intelligence Without Limits.',
    footer_col_core:'Core Agents', footer_col_more:'More Agents', footer_col_platform:'Platform',
    btn_explore_agents:'✨ Explore Agents', btn_view_all_agents:'View All Agents in Dashboard →',

    /* Agent cards */
    a1_name: 'AI Librarian',
    a1_desc: 'Smart book recommendations based on learner profile and accessibility needs.',
    a2_name: 'Reading Companion',
    a2_desc: 'Personal reading guide with comprehension support, vocabulary, and audio navigation.',
    a3_name: 'ADHD Agent',
    a3_desc: 'Focus windows, micro-sessions, smart highlighting, and note builder for ADHD learners.',
    a4_name: 'Dyslexia Agent',
    a4_desc: 'Dyslexia-friendly fonts, colour overlays, reading ruler, and visual mind maps.',
    a5_name: 'Blind Audio Agent',
    a5_desc: 'Full audio navigation and text-to-speech for blind and low-vision learners.',
    a6_name: 'Visual Communication Agent',
    a6_desc: 'Deaf-friendly reading support with large captions, visual keywords, mind map and comic sequence.',
    a7_name: 'Early Warning Agent',
    a7_desc: 'Performance monitoring that flags at-risk learners and triggers timely educator alerts.',
    a8_name: 'Intervention Agent',
    a8_desc: 'AI-generated personalised strategies, action plans, and curated resource library.',

    /* Settings page */
    set_title:               'Settings',
    set_subtitle:            'Customise CelikSense AI for your learning needs.',
    set_tab_ai:              'AI Settings',
    set_tab_a11y:            'Accessibility',
    set_tab_profile:         'Profile',
    set_tab_lang:            'Language',
    set_tab_data:            'Data & Privacy',
    set_gemini_title:        'Gemini AI',
    set_gemini_desc:         'Enter your Gemini API key to enable AI summaries, quizzes, and intervention plans.',
    set_api_none:            'No key set',
    set_api_saved:           'Key saved — click Test to verify',
    set_api_ok:              'Connected — Gemini AI is working',
    set_save_key:            'Save Key',
    set_test:                'Test',
    set_clear_key:           'Clear Key',
    set_get_key:             'Get free key ↗',
    set_key_privacy:         'Your API key is saved only in your browser (localStorage). It is never sent to any server.',
    set_key_saved:           'API key saved!',
    set_ai_prefs:            'AI Preferences',
    set_ai_prefs_desc:       'Control how AI features behave.',
    set_ai_summaries:        'AI Summaries',
    set_ai_summaries_sub:    'Auto-summarise long texts in Reading Companion',
    set_ai_quiz:             'AI Quizzes',
    set_ai_quiz_sub:         'Generate comprehension questions after reading',
    set_ai_intervention:     'AI Intervention Plans',
    set_ai_intervention_sub: 'Generate personalised learning strategies',
    set_font_title:          'Text & Font',
    set_font_desc:           'Adjust how text appears across all pages.',
    set_font_sub:            'OpenDyslexic helps some readers',
    set_contrast_desc:       'Choose a display mode that is easiest for your eyes.',
    set_overlay_sub:         'Helps with visual stress and dyslexia',
    set_tts_desc:            'Customise how text is read aloud.',
    set_voice_sub:           'Say commands to control the app hands-free',
    set_ruler_sub:           'A highlight band that follows your cursor',
    set_window_sub:          'Blur content outside a focus band (ADHD mode)',
    set_profile_title:       'Learner Profile',
    set_profile_desc:        'Your profile helps agents personalise their support.',
    set_name:                'Display name',
    set_disability:          'Accessibility need',
    set_grade:               'Year / Grade',
    set_lang_title:          'Display Language',
    set_lang_desc:           'Choose the language for all text in the app.',
    set_analytics_title:     'Learning Analytics',
    set_analytics_desc:      'Data is stored only in your browser — never uploaded to any server.',
    set_clear_analytics:     'Clear all learning data',
    set_danger_title:        'Danger Zone',
    set_danger_desc:         'These actions cannot be undone.',
    set_clear_profile:       'Reset learner profile',
    set_clear_profile_sub:   'Removes name, grade, and disability type',
    set_clear_all:           'Reset everything',
    set_clear_all_sub:       'Clears all data including API key and accessibility settings',
    set_reset:               'Reset',

    /* Dashboard */
    dash_welcome:       'Welcome back,',
    dash_name:          'Learner',
    dash_subtitle:      'Your personalised learning dashboard',
    dash_progress:      'Reading Progress',
    dash_focus:         'Focus Score',
    dash_mode:          'Accessibility Mode',
    dash_intervention:  'Recommended',
    dash_agents_title:  'AI Agents',
    dash_select_desc:   'Select an agent to start your personalised session',
    dash_start_reading: '▶ Start Reading',
    dash_view_report:   '📊 View Report',
    dash_view_plan:     'View Plan',
    dash_chapters_of:   'of',
    dash_chapters_done: 'chapters complete',
    dash_above_avg:     'Above average ↑',
    dash_average:       'Average',
    dash_below_avg:     'Below average ↓',
    dash_reading_window:'Reading window active',
    dash_no_mode:       'No active mode',
    dash_overlay_lbl:   'Overlay:',
    dash_focus_mode:    'Focus Mode On',
    dash_health_alert:  'Learning health alert:',
    dash_view_warning:  'View Early Warning Agent →',
    dash_recent_act:    'Recent Activity',
    dash_done_badge:    'Done',
    dash_just_now:      'Just now',
    dash_h_ago:         'h ago',
    dash_d_ago:         'd ago',
    agent_active:       'Active',
    agent_new:          'New',
    agent_open:         'Open',
    agent_lib:          'AI Librarian',
    agent_lib_desc:     'Find and recommend books tailored to your learning profile and accessibility needs.',
    agent_read:         'Reading Companion',
    agent_read_desc:    'Read with AI assistance – comprehension questions, vocabulary, and audio support.',
    agent_adhd:         'ADHD Agent',
    agent_adhd_desc:    'Micro-reading sessions with focus timers, reading window, and note builder.',
    agent_dys:          'Dyslexia Agent',
    agent_dys_desc:     'Colour overlays, dyslexia-friendly fonts, reading ruler, and mind map support.',
    agent_blind:        'Blind Audio Agent',
    agent_blind_desc:   'Full audio navigation with TTS, keyboard shortcuts, and voice instructions.',
    agent_sign:         'Sign Language Agent',
    agent_sign_desc:    'Malaysian Sign Language cards, alphabet guide, and common phrases.',
    agent_warn:         'Early Warning Agent',
    agent_warn_desc:    'Learner risk assessment, performance monitoring, and educator alerts.',
    agent_inter:        'Intervention Agent',
    agent_inter_desc:   'Personalised strategies, action plans, and curated resources for every need.',
    agent_ocr:          'OCR Reading Agent',
    agent_ocr_desc:     'Upload book images to extract text with Tesseract.js, then read aloud with full TTS support.',
    sign_start: '▶ Start Sign', sign_pause: '⏸ Pause', sign_stop: '⏹ Stop',
    sign_next: '⏭ Next', sign_prev: '⏮ Previous', sign_repeat: '🔁 Repeat',
    sign_slow: '🐢 Slow', sign_normal: '⚡ Normal Speed',
    sign_deaf_mode: 'Deaf Learner Mode', sign_bim_support: 'BIM Reading Support',
    sign_original: 'Original', sign_simplified: 'Simplified',
    sign_keywords: 'Keywords', sign_visual_meaning: 'Visual Meaning',
    sign_status_ready: 'Ready', sign_status_signing: 'Signing',
    sign_status_paused: 'Paused', sign_status_stopped: 'Stopped',
    sign_load_ocr: 'Load OCR Text', sign_clear: 'Clear Text',
    sign_prototype_note: 'Prototype mode: The avatar simulates sign language movement. Future versions will integrate real BIM avatar datasets.',
    rc_btn_sign: '🤟 Convert to Sign Language',
    ocr_btn_sign: '🤟 Open in Sign Language Agent',
    braille_toggle: '⠃ Braille Mode',
    braille_output: 'Braille Output',
    braille_copy: 'Copy Braille',
    braille_original: 'Original text',
    braille_preview: 'Braille preview',
    braille_device_title: 'Using with a Braille Display',
    braille_device_en: 'To read this content using a refreshable Braille display, connect your Braille device to your computer or mobile phone and enable your screen reader Braille output. CelikSense AI provides screen-reader-friendly text that can be sent to your device.',
    braille_prototype: 'Prototype mode: This converter uses basic Grade 1 Braille. Future versions will integrate full Malay Braille and contracted Braille support.',
    braille_agent_title: '⠃ Braille Output Agent',
    braille_agent_desc: 'Provides Braille-ready text for refreshable Braille display users.',
    braille_open: '⠃ Open Braille Mode',
    braille_reading: 'Reading Companion',
    braille_ocr: 'OCR to Braille',
    rc_btn_braille: '⠃ Convert to Braille',
    ocr_btn_braille: '⠃ Convert OCR Text to Braille',
    ps_agent_title: 'AI Personalisation Agent',
    ps_agent_desc: 'Learns your reading style and recommends the best experience.',
    ps_badge: 'Adaptive AI',
    ps_today: 'Recommended for you today',
    ps_profile_summary: '📊 Learning Profile Summary',
    ps_preferred_mode_label: 'Preferred Mode: ',
    ps_view_full: '🧠 View Full Learning Profile',
    ps_adaptive_title: '🧠 Personalised Suggestions',
    ps_ocr_suggest_title: '🧠 Based on your usage pattern',
    ps_privacy: 'Your learning preferences are stored locally in this browser for prototype purposes.',
    ps_page_title: 'AI Learning Personalisation Agent',
    ps_page_subtitle: 'Adaptive AI that learns your reading style',
    ps_section_profile: 'Learning Profile',
    ps_section_insights: 'AI Insights',
    ps_section_recs: 'Personalised Recommendations',
    ps_section_behaviour: 'Reading Behaviour',
    ps_section_teacher: 'Teacher & Parent Insights',
    ps_section_accessibility: 'Accessibility Profile',
    ps_reset_btn: 'Reset Learning Data',
    ps_reset_confirm: 'Are you sure? This will clear all your learning data.',
    ps_sessions: 'Sessions',
    ps_reading_time: 'Reading Time',
    ps_streak: 'Streak',
    ps_completion: 'Completion',
    ps_best_time: 'Best Time to Read',
    ps_most_used: 'Most Used Agent',
    teacher_agent_title: 'AI Teacher Agent',
    teacher_agent_desc: 'Explains books, generates quizzes, answers questions, creates mind maps, and motivates learners.',
    teacher_agent_badge: 'Virtual Teacher',
    teacher_title: 'AI Teacher Agent',
    teacher_subtitle: 'Your virtual teacher — explains, quizzes, answers questions, creates diagrams and mind maps, and motivates you.',
    teacher_badge1: '🤖 Gemini AI',
    teacher_badge2: '📚 Quiz Generator',
    teacher_badge3: '🗺️ Mind Map',
    teacher_badge4: '💪 Motivation',
    teacher_api_notice: 'Gemini API key required for AI features. Set key in Settings → Prototype mode is active if no key is set.',
    teacher_input_title: '📄 Reading Text Input',
    teacher_ask_title: '💬 Ask the Teacher',
    teacher_motivation_title: '💪 Motivation Corner',
    teacher_explain_title: '📖 Explanation',
    teacher_quiz_title: '📝 Quiz Generator',
    teacher_diagram_title: '🗺️ Diagram & Mind Map',
    teacher_inclusive_title: '♿ Inclusive Support',
    teacher_blind_mode: '🎙️ Blind Mode',
    teacher_deaf_mode: '🖐️ Deaf Mode',
    teacher_adhd_mode: '⚡ ADHD Mode',
    teacher_dyslexia_mode: '📖 Dyslexia Mode',
    teacher_tts: '🔊 Auto TTS',
    teacher_open_btn: '👩‍🏫 Ask AI Teacher',
    teacher_footer_note: 'AI Teacher Agent · Prototype',
    avatar_agent_title: 'AI Personal Sign Language Avatar',
    avatar_agent_desc: 'Your own AI avatar translates books and learning materials into Malaysian Sign Language (BIM).',
    avatar_badge: 'My Avatar',
    avatar_profile_section: '👤 My Sign Language Avatar',
    avatar_profile_ready: 'Avatar ready for signing',
    avatar_go_sign: '🤟 Start Signing',
    avatar_update: '📷 Update Avatar',
    avatar_delete: '🗑️ Delete',
    avatar_no_avatar: 'No avatar created yet.',
    avatar_create_now: '📷 Create My Avatar',
    avatar_create_title: '📷 Create My Avatar',
    avatar_step1: 'Step 1: Take Photo',
    avatar_step2: 'Step 2: Customise',
    avatar_step3: 'Step 3: Done!',
    avatar_use_webcam: '📷 Use Webcam',
    avatar_upload: '📁 Upload Photo',
    avatar_capture: '✅ Capture Photo',
    avatar_hairstyle: 'Choose Hairstyle',
    avatar_name_label: 'What should I call you?',
    avatar_speed_label: 'Signing Speed',
    avatar_start_signing: '🤟 Start Signing',
    avatar_ready: '🎉 Your avatar is ready!',
    avatar_prototype_note: 'Prototype: SVG avatar based on your photo colours. Future versions will use 3D avatar technology.',

    /* Book Discovery Agent */
    bd_title:           'AI Book Discovery Agent',
    bd_subtitle:        'Find legal reading materials and send them to any CelikSense accessibility tool.',
    bd_search_hint:     'Search by title, subject, level, author or interest…',
    bd_search_btn:      'Search',
    bd_sources_title:   'Choose a Book Source',
    bd_results_title:   'Search Results',
    bd_my_library:      'My Library',
    bd_send_to:         'Send to Tools',
    bd_send_teacher:    'Read with AI Teacher',
    bd_send_companion:  'Open in Reading Companion',
    bd_send_audio:      'Convert to Audio',
    bd_send_braille:    'Convert to Braille',
    bd_send_bim:        'Translate to BIM Sign Language',
    bd_send_adhd:       'Apply ADHD Mode',
    bd_send_dyslexia:   'Apply Dyslexia Mode',
    bd_save_lib:        'Save to My Library',
    bd_badge_owned:     'User Owned',
    bd_badge_public:    'Public Domain',
    bd_badge_preview:   'Preview Only',
    bd_badge_library:   'Library Access',
    bd_badge_ocr:       'OCR Required',
    bd_badge_learning:  'Learning Material',
    bd_src_upload_pdf:  'Upload PDF',
    bd_src_scan:        'Scan Physical Book',
    bd_src_gutenberg:   'Project Gutenberg',
    bd_src_openlibrary: 'Open Library',
    bd_src_gbooks:      'Google Books Preview',
    bd_src_school:      'School Library',
    bd_src_uni:         'University Library',
    bd_src_gdrive:      'Google Drive',
    bd_src_onedrive:    'OneDrive',
    bd_src_community:   'Community Materials',
    bd_opac_title:      'Library OPAC Connector',
    bd_opac_note:       'OPAC integration requires permission from the school or university library.',
    bd_opac_name:       'Library Name',
    bd_opac_url:        'OPAC URL',
    bd_opac_keyword:    'Search Keyword',
    bd_opac_id:         'Library User ID (optional)',
    bd_opac_search:     'Search Library',
    bd_community_title: 'Community Learning Materials',
    bd_community_note:  'Share summaries, notes, mind maps, and quizzes — not full copyrighted books.',
    bd_community_share: 'Share a Learning Material',
    bd_copyright_notice:'CelikSense AI helps users access and transform legally available reading materials into accessible formats. It does not host or redistribute copyrighted books without permission.',
    bd_read_btn:        'Open with CelikSense',
    bd_no_results:      'No results found. Try a different search term.',
    bd_loading:         'Searching…',
    bd_agent_desc:      'Find legal reading materials from public domain books, personal files, library systems and approved previews.',
    bd_agent_badge:     'Book Discovery',
    bd_avail_gutenberg: 'Available from Project Gutenberg',
    bd_avail_preview:   'Available as preview',
    bd_avail_upload:    'Upload your own copy',
    bd_avail_library:   'Ask your library for access',
    bd_saved_ok:        'Saved to My Library.',
    bd_sent_ok:         'Content sent. Opening agent…',

    /* Offline Intelligent Mode */
    offline_banner:         'Offline Mode Activated — Learning Without Internet Barrier.',
    offline_banner_sub:     'Downloaded content, tools and settings remain available.',
    offline_sync_banner:    'Synchronising your learning progress…',
    offline_sync_done:      'Sync complete. All progress saved.',
    offline_download_btn:   'Download for Offline',
    offline_remove_btn:     'Remove Offline Copy',
    offline_saved:          'Saved for offline reading.',
    offline_removed:        'Offline copy removed.',
    offline_ai_fallback:    'Offline Mode: Showing cached AI learning resources.',
    offline_no_ai:          'AI features require an internet connection.',
    offline_lib_title:      'Offline Library',
    offline_lib_subtitle:   'Your downloaded books, OCR scans, notes and cached content.',
    offline_tab_downloads:  'Downloaded Books',
    offline_tab_ocr:        'OCR Cache',
    offline_tab_notes:      'Notes & Quizzes',
    offline_tab_ai:         'AI Cache',
    offline_tab_storage:    'Storage',
    offline_empty:          'Nothing here yet. Download content while online to read it offline.',
    offline_storage_title:  'Storage Usage',
    offline_storage_used:   'Used',
    offline_storage_free:   'Available',
    offline_storage_total:  'Total',
    offline_demo:           'Offline Demonstration — All core features active without internet.',
    offline_search_hint:    'Search downloaded content…',
    offline_open_btn:       'Open',
    offline_delete_btn:     'Delete',
    offline_size:           'Size',
    offline_source:         'Source',
    offline_status_online:  'Online',
    offline_status_offline: 'Offline',
    offline_pending_sync:   'Pending sync items',
    offline_last_sync:      'Last synced',
    offline_never_synced:   'Not yet synced',
    offline_sync_now:       'Sync Now',
    offline_last_sync_label:'Last sync:',
    /* Offline Library — additional keys */
    offline_books_saved:    'books saved',
    offline_find_more:      '+ Find More Books',
    offline_clear_all:      'Clear All',
    offline_go_discover:    'Browse Books',
    offline_new_scan:       'New Scan',
    offline_clear_ocr:      'Clear Cache',
    offline_go_ocr:         'Open OCR Agent',
    offline_clear_ai:       'Clear AI Cache',
    offline_ai_cache_info:  'AI answers are cached automatically when online. Offline, the Teacher Agent replays saved answers.',
    offline_go_ai:          'Open AI Teacher',
    offline_notes_label:    'Notes',
    offline_bookmarks_label:'Bookmarks',
    offline_highlights_label:'Highlights',
    offline_quiz_label:     'Quiz History',
    offline_notes_info:     'Notes, bookmarks, highlights and quiz results are saved locally and available offline.',
    offline_open_reading:   'Open Reading Companion',
    offline_open_adhd:      'Open ADHD Agent',
    offline_open_teacher:   'Open AI Teacher',
    offline_stat_books:     'books',
    offline_stat_scans:     'scans',
    offline_stat_responses: 'responses',
    offline_stat_items:     'items',
    offline_sync_title:     'Sync & Backup',
    offline_sw_title:       'Service Worker Status',
    offline_clear_all_data: 'Clear All Data',
    offline_read_btn:       'Read Now',
    offline_teach_btn:      'Ask AI Teacher',
    offline_already_saved:  '✅ Saved',
    offline_cleared:        'Cleared.',
    offline_empty_downloads:'No downloads yet',
    offline_empty_downloads_sub: 'Books you save offline will appear here. Tap "Download for Offline" on any book.',
    offline_empty_ocr:      'No OCR scans cached',
    offline_empty_ocr_sub:  'Text extracted from images is saved here for offline access.',
    offline_empty_ai:       'No AI responses cached',
    offline_empty_ai_sub:   'Use AI Teacher or AI Librarian while online and answers will be saved here.',
    offline_confirm_clear_downloads: 'Remove all downloaded books from offline storage?',
    offline_confirm_clear_ocr:       'Clear all cached OCR scans?',
    offline_confirm_clear_ai:        'Clear all cached AI responses?',
    offline_confirm_clear_all:       'Clear ALL offline data? This cannot be undone.',
  },

  ms: {
    /* Navigation */
    nav_home:        'Laman Utama',
    nav_dashboard:   'Papan Pemuka',
    nav_profile:     'Profil Saya',
    nav_settings:    'Tetapan',
    nav_lang_switch: 'EN',

    /* Common actions */
    loading:      'Memuatkan...',
    save:         'Simpan',
    cancel:       'Batal',
    close:        'Tutup',
    back:         'Kembali',
    next:         'Seterusnya',
    done:         'Selesai',
    retry:        'Cuba lagi',
    start:        'Mula',
    stop:         'Henti',
    pause:        'Jeda',
    resume:       'Teruskan',
    clear:        'Kosongkan',
    read_aloud:   'Baca kuat',
    stop_audio:   'Henti audio',
    upload:       'Muat naik',
    capture:      'Tangkap',
    copy:         'Salin',
    copied:       'Disalin!',
    generate:     'Jana',
    settings:     'Tetapan',

    /* Accessibility panel */
    a11y_title:         'Tetapan Aksesibiliti',
    a11y_font_size:     'Saiz teks',
    a11y_font_style:    'Gaya fon',
    a11y_contrast:      'Mod kontras',
    a11y_overlay:       'Lapisan warna',
    a11y_tts:           'Teks-ke-suara',
    a11y_tts_speed:     'Kelajuan bacaan',
    a11y_captions:      'Tunjuk kapsyen',
    a11y_ruler:         'Pembaris bacaan',
    a11y_window:        'Tetingkap bacaan',
    a11y_voice_cmd:     'Arahan suara',
    a11y_reset:         'Tetapkan semula',
    a11y_font_system:   'Sistem',
    a11y_font_dyslexic: 'OpenDyslexic',
    a11y_font_arial:    'Arial',
    a11y_contrast_normal:   'Normal',
    a11y_contrast_high:     'Kontras tinggi',
    a11y_contrast_inverted: 'Terbalik',
    a11y_overlay_none:   'Tiada',
    a11y_overlay_yellow: 'Kuning',
    a11y_overlay_blue:   'Biru',
    a11y_overlay_green:  'Hijau',
    a11y_overlay_grey:   'Kelabu',
    a11y_overlay_pink:   'Merah jambu',

    /* OCR Agent */
    ocr_title:       'Pengimbas OCR',
    ocr_upload:      'Muat Naik Imej',
    ocr_camera:      'Ambil Gambar',
    ocr_capture:     'Tangkap Imej',
    ocr_retake:      'Ambil Semula',
    ocr_extract:     'Ekstrak Teks',
    ocr_extracting:  'Mengekstrak teks...',
    ocr_read:        'Baca Kuat',
    ocr_stop:        'Henti Audio',
    ocr_confidence:  'Keyakinan OCR',
    ocr_empty:       'Muat naik atau gambar halaman untuk bermula.',
    ocr_success:     'Teks berjaya diekstrak.',
    ocr_error:       'OCR gagal. Sila cuba lagi.',
    ocr_low_conf:    'Keyakinan rendah. Cuba pencahayaan lebih baik.',
    ocr_guide:       'Panduan suara aktif. Tekan 2 untuk muat naik, 3 untuk ambil gambar.',

    /* Reading Companion */
    rc_title:        'Rakan Bacaan',
    rc_paste_hint:   'Tampal atau taip teks anda di sini...',
    rc_summarise:    'Ringkaskan',
    rc_quiz:         'Jana Kuiz',
    rc_simplify:     'Permudahkan',
    rc_summary_title:'Ringkasan AI',
    rc_quiz_title:   'Kuiz Pemahaman',
    rc_score:        'Markah anda',
    rc_correct:      'Betul!',
    rc_wrong:        'Tidak tepat.',
    rc_generating:   'Menjana dengan AI...',
    rc_empty:        'Masukkan teks untuk bermula.',
    rc_level:        'Tahap bacaan',
    rc_easy:         'Mudah',
    rc_normal:       'Standard',
    rc_deep:         'Mendalam',

    /* ADHD Agent */
    adhd_title:      'Ejen Fokus ADHD',
    adhd_timer:      'Pemasa fokus',
    adhd_start:      'Mulakan sesi',
    adhd_break:      'Rehat',
    adhd_break_msg:  'Bagus! Masa untuk rehat 5 minit.',
    adhd_resume:     'Teruskan sesi',
    adhd_focus:      'Skor fokus',
    adhd_done:       'Sesi selesai!',
    adhd_distracted: 'Fokus rendah. Ambil rehat pendek?',
    adhd_tip:        'Petua: Baca satu perenggan sahaja.',

    /* Dyslexia Agent */
    dys_title:       'Sokongan Disleksia',
    dys_font:        'Fon bacaan',
    dys_spacing:     'Jarak huruf',
    dys_line_h:      'Tinggi baris',
    dys_overlay:     'Lapisan warna',
    dys_ruler:       'Pembaris bacaan',
    dys_syllables:   'Pecah suku kata',
    dys_highlight:   'Sorot patah kata',
    dys_sample:      'Teks contoh',
    dys_hint:        'Laraskan tetapan sehingga bacaan terasa selesa.',

    /* Blind Audio Agent */
    blind_title:     'Ejen Audio Buta',
    blind_activate:  'Aktifkan panduan suara',
    blind_test_mic:  'Uji mikrofon',
    blind_commands:  'Arahan suara',
    blind_listening: 'Mendengar...',
    blind_not_heard: 'Tidak dikenali. Sila cuba lagi.',
    blind_mic_ok:    'Mikrofon berfungsi.',
    blind_mic_fail:  'Mikrofon tidak dijumpai. Semak kebenaran pelayar.',
    blind_intro:     'Selamat datang ke Ejen Audio Buta. Sebut "mulakan panduan" untuk bantuan.',

    /* Early Warning */
    ew_title:        'Monitor Kesihatan Pembelajaran',
    ew_risk_score:   'Skor risiko',
    ew_risk_low:     'Risiko rendah',
    ew_risk_moderate:'Risiko sederhana',
    ew_risk_high:    'Risiko tinggi',
    ew_risk_critical:'Kritikal — dapatkan sokongan',
    ew_sessions:     'Sesi minggu ini',
    ew_avg_quiz:     'Purata skor kuiz',
    ew_avg_focus:    'Purata skor fokus',
    ew_no_data:      'Tiada data lagi. Lengkapkan sesi untuk melihat skor anda.',
    ew_recalculate:  'Kira semula',

    /* Intervention */
    int_title:       'Perancang Intervensi',
    int_generate:    'Jana pelan',
    int_generating:  'Mencipta pelan peribadi anda...',
    int_no_data:     'Tiada data risiko. Gunakan Ejen Amaran Awal dahulu.',
    int_step:        'Langkah',
    int_days:        'hari',
    int_read_plan:   'Baca pelan kuat',

    /* AI Librarian */
    lib_title:       'Pustakawan AI',
    lib_interests:   'Minat anda',
    lib_search:      'Cari buku',
    lib_searching:   'Mencari...',
    lib_results:     'Disyorkan untuk anda',
    lib_no_results:  'Tiada hasil. Cuba minat yang berbeza.',
    lib_read:        'Baca cadangan',

    /* Voice */
    voice_start:        'Mula mendengar',
    voice_stop:         'Henti mendengar',
    voice_denied:       'Kebenaran mikrofon ditolak.',
    voice_network_err:  'Ralat rangkaian. Semak sambungan anda.',
    voice_not_supported:'Arahan suara tidak disokong dalam pelayar ini.',

    /* Gemini */
    gemini_error:  'Perkhidmatan AI tidak tersedia. Menggunakan mod asas.',
    gemini_quota:  'Had AI harian dicapai. Cuba lagi esok.',
    gemini_no_key: 'Tiada kunci Gemini API. Tambah dalam Tetapan.',

    /* Errors */
    err_generic:   'Sesuatu telah berlaku. Sila cuba lagi.',
    err_offline:   'Anda di luar talian. Sesetengah ciri mungkin terhad.',
    err_camera:    'Kamera tidak tersedia. Semak kebenaran pelayar.',

    /* Laman Utama / Navigasi tambahan */
    tagline:        'Pembelajaran Multi-Deria Beragensi',
    nav_agents:     'Ejen ▾',
    nav_signup:     'Daftar',

    /* Bahagian Hero */
    hero_badge:     '8 Ejen AI · Pembelajaran Inklusif',
    hero_title:     'CelikSense AI',
    hero_subtitle:  'Ekosistem Pembelajaran Multi-Deria',
    hero_tagline:   'Ilmu Tanpa Sempadan, Kecerdasan Tanpa Had',
    hero_cta1:      'Mulakan',

    /* Bahagian Ejen */
    agents_title:   '8 Ejen, Satu Ekosistem',
    agents_desc:    'Setiap ejen dibina khusus untuk keperluan pembelajaran tertentu. Bersama-sama mereka membentuk sistem pembelajaran peribadi yang adaptif.',

    /* Profil pelajar */
    learners_title:   'Menyokong Setiap Pelajar',
    learner_blind:    'Buta & Penglihatan Terhad',
    learner_deaf:     'Pekak & Pendengaran Terhad',
    learner_adhd:     'ADHD',
    learner_dyslexia: 'Disleksia',
    learner_general:  'Semua Pelajar',
    learners_section_desc: 'Alat AI inklusif yang direka khas untuk kepelbagaian keperluan pembelajaran di bilik darjah dan rumah di Malaysia.',
    learner_blind_desc:    'Navigasi audio penuh, pintasan papan kekunci, dan TTS untuk pembelajaran berdikari.',
    learner_deaf_desc:     'Sokongan bacaan mesra OKU pendengaran dengan kapsyen besar, kata kunci visual, peta minda dan panduan ejaan jari.',
    learner_adhd_desc:     'Sesi mikro, pemasa fokus, tetingkap bacaan, dan penglibatan berasaskan minat.',
    learner_dyslexia_desc: 'Fon mesra disleksia, lapisan warna, pembaris bacaan, dan peta minda visual.',
    learner_general_desc:  'Pustakawan AI, Rakan Membaca, dan Ejen Intervensi melayani setiap pelajar.',
    learner_blind_agent:   'Ejen Audio Buta',
    learner_deaf_agent:    'Agen Komunikasi Visual',
    learner_adhd_agent:    'Ejen ADHD',
    learner_dyslexia_agent:'Ejen Disleksia',
    learner_general_agent: 'Semua 8 Ejen',
    /* Label statistik */
    stat_agents:'Ejen AI', stat_learner_types:'Jenis Pelajar', stat_languages:'Bahasa', stat_accessible:'Aksesibel',
    /* Tag orb */
    orb_discover:'TEMUI', orb_read:'BACA', orb_focus:'FOKUS', orb_read_easier:'BACA MUDAH',
    orb_listen:'DENGAR', orb_sign:'SOKONG OKU', orb_monitor:'PANTAU', orb_plan:'RANCANG',
    /* Cara Ia Berfungsi */
    how_title:'Cara Ia Berfungsi',
    how_desc:'Tiga langkah dari pendaftaran hingga pengalaman pembelajaran peribadi yang aksesibel sepenuhnya.',
    how_step1_title:'Tetapkan Profil Anda', how_step1_desc:'Beritahu CelikSense tentang keperluan pembelajaran, pilihan bahasa, dan minat anda. Mengambil masa kurang dua minit.', how_step1_btn:'Ke Profil',
    how_step2_title:'AI Sesuai Untuk Anda', how_step2_desc:'8 ejen secara automatik mengkonfigurasi fon, audio, lapisan, tempoh sesi, dan bahasa mengikut profil anda.', how_step2_btn:'Buka Papan Pemuka',
    how_step3_title:'Belajar Tanpa Sempadan', how_step3_desc:'Baca, dengar, isyarat, dan terokai. Ejen Amaran Awal memantau kemajuan anda dan mencadangkan intervensi bila perlu.', how_step3_btn:'Mula Membaca',
    /* Kenapa */
    why_title:'Kenapa CelikSense AI?', why_desc:'Direka dari asas untuk pembelajaran inklusif, aksesibel, dan dwibahasa.',
    why1_title:'AI Benar-Benar Agentik', why1_desc:'8 ejen khusus yang berkomunikasi dan berkoordinasi untuk memperibadikan setiap sesi, bukan sekadar chatbot biasa.',
    why2_title:'Dwibahasa Sepenuhnya', why2_desc:'Sokongan penuh Bahasa Inggeris dan Bahasa Melayu merentas setiap ejen, setiap label, dan setiap arahan audio.',
    why3_title:'Dibina untuk Aksesibiliti', why3_desc:'Navigasi papan kekunci, label ARIA, TTS, mod kontras tinggi, dan sokongan pembaca skrin adalah ciri utama, bukan tambahan.',
    why4_title:'Adaptif secara Lalai', why4_desc:'Mempelajari pilihan anda, menyesuaikan fon, warna, tempoh sesi, dan kesukaran kandungan secara automatik setiap sesi.',
    why5_title:'Sistem Amaran Awal', why5_desc:'Mengenal pasti pelajar yang berisiko secara proaktif dan menghasilkan pelan intervensi yang diperibadikan untuk pendidik.',
    why6_title:'Pembelajaran Multi-Deria', why6_desc:'Mod visual, audio, sentuhan, dan bahasa isyarat bermakna setiap pelajar menemui jalan yang sesuai untuk otak mereka.',
    /* CTA */
    cta_badge:'Bersedia untuk bermula?', cta_headline:'Pembelajaran yang menyesuaikan diri dengan anda',
    cta_sub:'Sertai pendidik dan pelajar di seluruh Malaysia yang menggunakan CelikSense AI untuk menjadikan bacaan, kefahaman, dan komunikasi benar-benar aksesibel.',
    cta_btn1:'Buka Papan Pemuka →', cta_btn2:'Cipta Profil',
    /* Footer */
    footer_tagline1:'Ekosistem Pembelajaran Multi-Deria Agentik untuk pendidikan inklusif di Malaysia dan seluruh dunia.',
    footer_tagline2:'Ilmu Tanpa Sempadan, Kecerdasan Tanpa Had.',
    footer_col_core:'Ejen Utama', footer_col_more:'Ejen Lain', footer_col_platform:'Platform',
    btn_explore_agents:'✨ Terokai Ejen', btn_view_all_agents:'Lihat Semua Ejen di Papan Pemuka →',

    /* Kad ejen */
    a1_name: 'Pustakawan AI',
    a1_desc: 'Cadangan buku pintar berdasarkan profil pelajar dan keperluan aksesibiliti.',
    a2_name: 'Rakan Bacaan',
    a2_desc: 'Panduan bacaan peribadi dengan sokongan pemahaman, kosa kata, dan navigasi audio.',
    a3_name: 'Ejen ADHD',
    a3_desc: 'Tetingkap fokus, sesi mikro, penyerlahan pintar, dan pembina nota untuk pelajar ADHD.',
    a4_name: 'Ejen Disleksia',
    a4_desc: 'Fon mesra disleksia, lapisan warna, pembaris bacaan, dan peta minda visual.',
    a5_name: 'Ejen Audio Buta',
    a5_desc: 'Navigasi audio penuh dan teks-ke-suara untuk pelajar buta dan penglihatan terhad.',
    a6_name: 'Agen Komunikasi Visual',
    a6_desc: 'Sokongan bacaan mesra OKU pendengaran dengan kapsyen besar, kata kunci visual, peta minda dan jujukan komik.',
    a7_name: 'Ejen Amaran Awal',
    a7_desc: 'Pemantauan prestasi yang mengenal pasti pelajar berisiko dan mencetuskan amaran tepat waktu.',
    a8_name: 'Ejen Intervensi',
    a8_desc: 'Strategi peribadi jana AI, pelan tindakan, dan perpustakaan sumber yang dikurasi.',

    /* Halaman Tetapan */
    set_title:               'Tetapan',
    set_subtitle:            'Sesuaikan CelikSense AI untuk keperluan pembelajaran anda.',
    set_tab_ai:              'Tetapan AI',
    set_tab_a11y:            'Aksesibiliti',
    set_tab_profile:         'Profil',
    set_tab_lang:            'Bahasa',
    set_tab_data:            'Data & Privasi',
    set_gemini_title:        'Gemini AI',
    set_gemini_desc:         'Masukkan kunci Gemini API anda untuk mengaktifkan ringkasan AI, kuiz, dan pelan intervensi.',
    set_api_none:            'Tiada kunci ditetapkan',
    set_api_saved:           'Kunci disimpan — klik Uji untuk mengesahkan',
    set_api_ok:              'Bersambung — Gemini AI berfungsi',
    set_save_key:            'Simpan Kunci',
    set_test:                'Uji',
    set_clear_key:           'Padam Kunci',
    set_get_key:             'Dapatkan kunci percuma ↗',
    set_key_privacy:         'Kunci API anda disimpan hanya dalam pelayar anda (localStorage). Ia tidak pernah dihantar ke mana-mana pelayan.',
    set_key_saved:           'Kunci API disimpan!',
    set_ai_prefs:            'Pilihan AI',
    set_ai_prefs_desc:       'Kawal cara ciri AI berfungsi.',
    set_ai_summaries:        'Ringkasan AI',
    set_ai_summaries_sub:    'Ringkaskan teks panjang secara automatik dalam Rakan Bacaan',
    set_ai_quiz:             'Kuiz AI',
    set_ai_quiz_sub:         'Jana soalan pemahaman selepas membaca',
    set_ai_intervention:     'Pelan Intervensi AI',
    set_ai_intervention_sub: 'Jana strategi pembelajaran peribadi',
    set_font_title:          'Teks & Fon',
    set_font_desc:           'Laraskan cara teks dipaparkan di semua halaman.',
    set_font_sub:            'OpenDyslexic membantu sesetengah pembaca',
    set_contrast_desc:       'Pilih mod paparan yang paling mudah untuk mata anda.',
    set_overlay_sub:         'Membantu dengan tekanan visual dan disleksia',
    set_tts_desc:            'Sesuaikan cara teks dibaca dengan kuat.',
    set_voice_sub:           'Sebut arahan untuk mengawal aplikasi tanpa tangan',
    set_ruler_sub:           'Jalur serlahan yang mengikut kursor anda',
    set_window_sub:          'Kaburkan kandungan di luar jalur fokus (mod ADHD)',
    set_profile_title:       'Profil Pelajar',
    set_profile_desc:        'Profil anda membantu ejen menyesuaikan sokongan mereka.',
    set_name:                'Nama paparan',
    set_disability:          'Keperluan aksesibiliti',
    set_grade:               'Tahun / Tingkatan',
    set_lang_title:          'Bahasa Paparan',
    set_lang_desc:           'Pilih bahasa untuk semua teks dalam aplikasi.',
    set_analytics_title:     'Analitik Pembelajaran',
    set_analytics_desc:      'Data disimpan hanya dalam pelayar anda — tidak pernah dimuat naik ke mana-mana pelayan.',
    set_clear_analytics:     'Padam semua data pembelajaran',
    set_danger_title:        'Zon Bahaya',
    set_danger_desc:         'Tindakan ini tidak boleh dibatalkan.',
    set_clear_profile:       'Set semula profil pelajar',
    set_clear_profile_sub:   'Mengalih keluar nama, tahun, dan jenis kecacatan',
    set_clear_all:           'Set semula semua',
    set_clear_all_sub:       'Memadamkan semua data termasuk kunci API dan tetapan aksesibiliti',
    set_reset:               'Set Semula',

    /* Papan Pemuka */
    dash_welcome:       'Selamat kembali,',
    dash_name:          'Pelajar',
    dash_subtitle:      'Papan pemuka pembelajaran peribadi anda',
    dash_progress:      'Kemajuan Bacaan',
    dash_focus:         'Skor Fokus',
    dash_mode:          'Mod Aksesibiliti',
    dash_intervention:  'Disyorkan',
    dash_agents_title:  'Ejen AI',
    dash_select_desc:   'Pilih ejen untuk memulakan sesi peribadi anda',
    dash_start_reading: '▶ Mula Membaca',
    dash_view_report:   '📊 Lihat Laporan',
    dash_view_plan:     'Lihat Pelan',
    dash_chapters_of:   'daripada',
    dash_chapters_done: 'bab selesai',
    dash_above_avg:     'Lebih tinggi dari purata ↑',
    dash_average:       'Purata',
    dash_below_avg:     'Kurang dari purata ↓',
    dash_reading_window:'Tetingkap bacaan aktif',
    dash_no_mode:       'Tiada mod aktif',
    dash_overlay_lbl:   'Hamparan:',
    dash_focus_mode:    'Mod Fokus Aktif',
    dash_health_alert:  'Amaran kesihatan pembelajaran:',
    dash_view_warning:  'Lihat Ejen Amaran Awal →',
    dash_recent_act:    'Aktiviti Terkini',
    dash_done_badge:    'Selesai',
    dash_just_now:      'Baru sahaja',
    dash_h_ago:         'j lepas',
    dash_d_ago:         'h lepas',
    agent_active:       'Aktif',
    agent_new:          'Baharu',
    agent_open:         'Buka',
    agent_lib:          'Pustakawan AI',
    agent_lib_desc:     'Cari dan cadangkan buku yang sesuai dengan profil pembelajaran dan keperluan aksesibiliti anda.',
    agent_read:         'Rakan Bacaan',
    agent_read_desc:    'Baca dengan bantuan AI – soalan kefahaman, perbendaharaan kata, dan sokongan audio.',
    agent_adhd:         'Ejen ADHD',
    agent_adhd_desc:    'Sesi bacaan mikro dengan pemasa fokus, tetingkap bacaan, dan pembina nota.',
    agent_dys:          'Ejen Disleksia',
    agent_dys_desc:     'Hamparan warna, fon mesra disleksia, pembaris bacaan, dan sokongan peta minda.',
    agent_blind:        'Ejen Audio Buta',
    agent_blind_desc:   'Navigasi audio penuh dengan TTS, pintasan papan kekunci, dan arahan suara.',
    agent_sign:         'Ejen Bahasa Isyarat',
    agent_sign_desc:    'Kad Bahasa Isyarat Malaysia, panduan abjad, dan frasa lazim.',
    agent_warn:         'Ejen Amaran Awal',
    agent_warn_desc:    'Penilaian risiko pelajar, pemantauan prestasi, dan amaran pendidik.',
    agent_inter:        'Ejen Intervensi',
    agent_inter_desc:   'Strategi peribadi, pelan tindakan, dan sumber terpilih untuk setiap keperluan.',
    agent_ocr:          'Ejen Bacaan OCR',
    agent_ocr_desc:     'Muat naik gambar buku untuk ekstrak teks dengan Tesseract.js, kemudian baca lantang dengan sokongan TTS penuh.',
    sign_start: '▶ Mula Isyarat', sign_pause: '⏸ Jeda', sign_stop: '⏹ Henti',
    sign_next: '⏭ Seterusnya', sign_prev: '⏮ Sebelumnya', sign_repeat: '🔁 Ulang',
    sign_slow: '🐢 Perlahan', sign_normal: '⚡ Laju Normal',
    sign_deaf_mode: 'Mod Pelajar Pekak', sign_bim_support: 'Sokongan Bacaan BIM',
    sign_original: 'Asal', sign_simplified: 'Dipermudahkan',
    sign_keywords: 'Kata Kunci', sign_visual_meaning: 'Makna Visual',
    sign_status_ready: 'Sedia', sign_status_signing: 'Berisyarat',
    sign_status_paused: 'Dijeda', sign_status_stopped: 'Dihenti',
    sign_load_ocr: 'Muatkan Teks OCR', sign_clear: 'Padam Teks',
    sign_prototype_note: 'Mod prototaip: Avatar mensimulasikan pergerakan bahasa isyarat. Versi akan datang akan mengintegrasikan dataset avatar BIM sebenar.',
    rc_btn_sign: '🤟 Tukar ke Bahasa Isyarat',
    ocr_btn_sign: '🤟 Buka dalam Ejen Bahasa Isyarat',
    braille_toggle: '⠃ Mod Braille',
    braille_output: 'Output Braille',
    braille_copy: 'Salin Braille',
    braille_original: 'Teks asal',
    braille_preview: 'Pratonton Braille',
    braille_device_title: 'Menggunakan dengan Peranti Braille',
    braille_device_en: 'Untuk membaca kandungan ini menggunakan peranti Braille boleh segar semula, sambungkan peranti Braille anda kepada komputer atau telefon dan aktifkan output Braille pada pembaca skrin. CelikSense AI menyediakan teks mesra pembaca skrin yang boleh dihantar kepada peranti tersebut.',
    braille_prototype: 'Mod prototaip: Penukar ini menggunakan Braille Gred 1 asas. Versi akan datang akan mengintegrasikan sokongan Braille Melayu penuh dan Braille singkatan.',
    braille_agent_title: '⠃ Ejen Output Braille',
    braille_agent_desc: 'Menyediakan teks sedia Braille untuk pengguna peranti Braille boleh segar semula.',
    braille_open: '⠃ Buka Mod Braille',
    braille_reading: 'Rakan Membaca',
    braille_ocr: 'OCR ke Braille',
    rc_btn_braille: '⠃ Tukar kepada Braille',
    ocr_btn_braille: '⠃ Tukar Teks OCR kepada Braille',
    ps_agent_title: 'Ejen Pemperibadian AI',
    ps_agent_desc: 'Mempelajari gaya bacaan anda dan mencadangkan pengalaman terbaik.',
    ps_badge: 'AI Adaptif',
    ps_today: 'Cadangan untuk anda hari ini',
    ps_profile_summary: '📊 Ringkasan Profil Pembelajaran',
    ps_preferred_mode_label: 'Mod Pilihan: ',
    ps_view_full: '🧠 Lihat Profil Pembelajaran Penuh',
    ps_adaptive_title: '🧠 Cadangan Diperibadikan',
    ps_ocr_suggest_title: '🧠 Berdasarkan corak penggunaan anda',
    ps_privacy: 'Keutamaan pembelajaran anda disimpan secara setempat dalam pelayar ini untuk tujuan prototaip.',
    ps_page_title: 'Ejen Pemperibadian Pembelajaran AI',
    ps_page_subtitle: 'AI Adaptif yang mempelajari gaya bacaan anda',
    ps_section_profile: 'Profil Pembelajaran',
    ps_section_insights: 'Pandangan AI',
    ps_section_recs: 'Cadangan Diperibadikan',
    ps_section_behaviour: 'Tingkah Laku Bacaan',
    ps_section_teacher: 'Pandangan Guru & Ibu Bapa',
    ps_section_accessibility: 'Profil Kebolehcapaian',
    ps_reset_btn: 'Set Semula Data Pembelajaran',
    ps_reset_confirm: 'Adakah anda pasti? Ini akan memadam semua data pembelajaran anda.',
    ps_sessions: 'Sesi',
    ps_reading_time: 'Masa Membaca',
    ps_streak: 'Berturut-turut',
    ps_completion: 'Kadar Siap',
    ps_best_time: 'Masa Terbaik Membaca',
    ps_most_used: 'Ejen Paling Digunakan',
    teacher_agent_title: 'Ejen Guru AI',
    teacher_agent_desc: 'Menerangkan buku, menjana kuiz, menjawab soalan, mencipta peta minda, dan memotivasikan pelajar.',
    teacher_agent_badge: 'Guru Maya',
    teacher_title: 'Ejen Guru AI',
    teacher_subtitle: 'Guru maya anda — menerangkan, membuat kuiz, menjawab soalan, mencipta gambar rajah dan peta minda, dan memotivasikan anda.',
    teacher_badge1: '🤖 Gemini AI',
    teacher_badge2: '📚 Penjana Kuiz',
    teacher_badge3: '🗺️ Peta Minda',
    teacher_badge4: '💪 Motivasi',
    teacher_api_notice: 'Kunci API Gemini diperlukan untuk ciri AI. Tetapkan kunci dalam Tetapan → Mod prototaip aktif jika tiada kunci.',
    teacher_input_title: '📄 Input Teks Bacaan',
    teacher_ask_title: '💬 Tanya Guru',
    teacher_motivation_title: '💪 Sudut Motivasi',
    teacher_explain_title: '📖 Penjelasan',
    teacher_quiz_title: '📝 Penjana Kuiz',
    teacher_diagram_title: '🗺️ Gambar Rajah & Peta Minda',
    teacher_inclusive_title: '♿ Sokongan Inklusif',
    teacher_blind_mode: '🎙️ Mod Buta',
    teacher_deaf_mode: '🖐️ Mod Pekak',
    teacher_adhd_mode: '⚡ Mod ADHD',
    teacher_dyslexia_mode: '📖 Mod Disleksia',
    teacher_tts: '🔊 TTS Auto',
    teacher_open_btn: '👩‍🏫 Tanya Guru AI',
    teacher_footer_note: 'Ejen Guru AI · Prototaip',
    avatar_agent_title: 'Avatar Bahasa Isyarat Peribadi AI',
    avatar_agent_desc: 'Avatar AI anda sendiri menterjemahkan buku dan bahan pembelajaran ke dalam Bahasa Isyarat Malaysia (BIM).',
    avatar_badge: 'Avatar Saya',
    avatar_profile_section: '👤 Avatar Bahasa Isyarat Saya',
    avatar_profile_ready: 'Avatar bersedia untuk menandatangani',
    avatar_go_sign: '🤟 Mula Tanda Tangan',
    avatar_update: '📷 Kemas Kini Avatar',
    avatar_delete: '🗑️ Padam',
    avatar_no_avatar: 'Tiada avatar dicipta lagi.',
    avatar_create_now: '📷 Cipta Avatar Saya',
    avatar_create_title: '📷 Cipta Avatar Saya',
    avatar_step1: 'Langkah 1: Ambil Foto',
    avatar_step2: 'Langkah 2: Sesuaikan',
    avatar_step3: 'Langkah 3: Siap!',
    avatar_use_webcam: '📷 Guna Kamera Web',
    avatar_upload: '📁 Muat Naik Foto',
    avatar_capture: '✅ Ambil Foto',
    avatar_hairstyle: 'Pilih Gaya Rambut',
    avatar_name_label: 'Apa nama anda?',
    avatar_speed_label: 'Kelajuan Tanda Tangan',
    avatar_start_signing: '🤟 Mula Tanda Tangan',
    avatar_ready: '🎉 Avatar anda sudah siap!',
    avatar_prototype_note: 'Prototaip: Avatar SVG berdasarkan warna foto anda. Versi akan datang akan menggunakan teknologi avatar 3D.',

    /* Ejen Penemuan Buku */
    bd_title:           'Ejen Penemuan Buku AI',
    bd_subtitle:        'Cari bahan bacaan sah dan hantarkan ke mana-mana alat aksesibiliti CelikSense.',
    bd_search_hint:     'Cari mengikut tajuk, subjek, tahap, pengarang atau minat…',
    bd_search_btn:      'Cari',
    bd_sources_title:   'Pilih Sumber Buku',
    bd_results_title:   'Keputusan Carian',
    bd_my_library:      'Perpustakaan Saya',
    bd_send_to:         'Hantar ke Alatan',
    bd_send_teacher:    'Baca dengan Guru AI',
    bd_send_companion:  'Buka dalam Rakan Bacaan',
    bd_send_audio:      'Tukar ke Audio',
    bd_send_braille:    'Tukar ke Braille',
    bd_send_bim:        'Terjemah ke BIM',
    bd_send_adhd:       'Mod ADHD',
    bd_send_dyslexia:   'Mod Disleksia',
    bd_save_lib:        'Simpan ke Perpustakaan Saya',
    bd_badge_owned:     'Milik Pengguna',
    bd_badge_public:    'Domain Awam',
    bd_badge_preview:   'Pratonton Sahaja',
    bd_badge_library:   'Akses Perpustakaan',
    bd_badge_ocr:       'Perlu OCR',
    bd_badge_learning:  'Bahan Pembelajaran',
    bd_src_upload_pdf:  'Muat Naik PDF',
    bd_src_scan:        'Imbas Buku Fizikal',
    bd_src_gutenberg:   'Project Gutenberg',
    bd_src_openlibrary: 'Open Library',
    bd_src_gbooks:      'Pratonton Google Books',
    bd_src_school:      'Perpustakaan Sekolah',
    bd_src_uni:         'Perpustakaan Universiti',
    bd_src_gdrive:      'Google Drive',
    bd_src_onedrive:    'OneDrive',
    bd_src_community:   'Bahan Komuniti',
    bd_opac_title:      'Penyambung OPAC Perpustakaan',
    bd_opac_note:       'Integrasi OPAC memerlukan kebenaran daripada perpustakaan sekolah atau universiti.',
    bd_opac_name:       'Nama Perpustakaan',
    bd_opac_url:        'URL OPAC',
    bd_opac_keyword:    'Kata Kunci Carian',
    bd_opac_id:         'ID Pengguna Perpustakaan (pilihan)',
    bd_opac_search:     'Cari Perpustakaan',
    bd_community_title: 'Bahan Pembelajaran Komuniti',
    bd_community_note:  'Kongsi rumusan, nota, peta minda, dan kuiz — bukan buku berhak cipta penuh.',
    bd_community_share: 'Kongsi Bahan Pembelajaran',
    bd_copyright_notice:'CelikSense AI membantu pengguna mengakses dan mengubah bahan bacaan yang sah ke format boleh akses. Ia tidak menyimpan atau mengedarkan semula buku berhak cipta tanpa kebenaran.',
    bd_read_btn:        'Buka dengan CelikSense',
    bd_no_results:      'Tiada keputusan ditemui. Cuba kata kunci lain.',
    bd_loading:         'Mencari…',
    bd_agent_desc:      'Cari bahan bacaan sah daripada buku domain awam, fail peribadi, sistem perpustakaan dan pratonton yang diluluskan.',
    bd_agent_badge:     'Penemuan Buku',
    bd_avail_gutenberg: 'Tersedia di Project Gutenberg',
    bd_avail_preview:   'Tersedia sebagai pratonton',
    bd_avail_upload:    'Muat naik salinan anda sendiri',
    bd_avail_library:   'Minta akses daripada perpustakaan anda',
    bd_saved_ok:        'Disimpan ke Perpustakaan Saya.',
    bd_sent_ok:         'Kandungan dihantar. Membuka ejen…',

    /* Mod Luar Talian */
    offline_banner:         'Mod Luar Talian Diaktifkan — Pembelajaran Tanpa Halangan Internet.',
    offline_banner_sub:     'Kandungan yang dimuat turun, alatan dan tetapan masih tersedia.',
    offline_sync_banner:    'Menyegerakkan kemajuan pembelajaran anda…',
    offline_sync_done:      'Segerak selesai. Semua kemajuan disimpan.',
    offline_download_btn:   'Muat Turun untuk Luar Talian',
    offline_remove_btn:     'Buang Salinan Luar Talian',
    offline_saved:          'Disimpan untuk bacaan luar talian.',
    offline_removed:        'Salinan luar talian dibuang.',
    offline_ai_fallback:    'Mod Luar Talian: Menunjukkan sumber pembelajaran AI yang dicache.',
    offline_no_ai:          'Ciri AI memerlukan sambungan internet.',
    offline_lib_title:      'Perpustakaan Luar Talian',
    offline_lib_subtitle:   'Buku yang dimuat turun, imbasan OCR, nota dan kandungan cache anda.',
    offline_tab_downloads:  'Buku Dimuat Turun',
    offline_tab_ocr:        'Cache OCR',
    offline_tab_notes:      'Nota & Kuiz',
    offline_tab_ai:         'Cache AI',
    offline_tab_storage:    'Storan',
    offline_empty:          'Tiada apa-apa lagi. Muat turun kandungan semasa dalam talian untuk dibaca tanpa internet.',
    offline_storage_title:  'Penggunaan Storan',
    offline_storage_used:   'Digunakan',
    offline_storage_free:   'Tersedia',
    offline_storage_total:  'Jumlah',
    offline_demo:           'Demonstrasi Luar Talian — Semua ciri teras aktif tanpa internet.',
    offline_search_hint:    'Cari kandungan yang dimuat turun…',
    offline_open_btn:       'Buka',
    offline_delete_btn:     'Padam',
    offline_size:           'Saiz',
    offline_source:         'Sumber',
    offline_status_online:  'Dalam Talian',
    offline_status_offline: 'Luar Talian',
    offline_pending_sync:   'Item segerak tertangguh',
    offline_last_sync:      'Disegerakkan terakhir',
    offline_never_synced:   'Belum disegerakkan',
    offline_sync_now:       'Segerak Sekarang',
    offline_last_sync_label:'Segerak terakhir:',
    /* Offline Library — BM additional keys */
    offline_books_saved:    'buku tersimpan',
    offline_find_more:      '+ Cari Lebih Buku',
    offline_clear_all:      'Padam Semua',
    offline_go_discover:    'Semak Imbas Buku',
    offline_new_scan:       'Imbasan Baharu',
    offline_clear_ocr:      'Padam Cache',
    offline_go_ocr:         'Buka Agen OCR',
    offline_clear_ai:       'Padam Cache AI',
    offline_ai_cache_info:  'Jawapan AI disimpan secara automatik semasa dalam talian. Tanpa talian, Agen Guru menggunakan jawapan tersimpan.',
    offline_go_ai:          'Buka Guru AI',
    offline_notes_label:    'Nota',
    offline_bookmarks_label:'Penanda Buku',
    offline_highlights_label:'Penyerlahan',
    offline_quiz_label:     'Sejarah Kuiz',
    offline_notes_info:     'Nota, penanda buku, penyerlahan dan keputusan kuiz disimpan secara tempatan dan tersedia tanpa talian.',
    offline_open_reading:   'Buka Rakan Baca',
    offline_open_adhd:      'Buka Agen ADHD',
    offline_open_teacher:   'Buka Guru AI',
    offline_stat_books:     'buku',
    offline_stat_scans:     'imbasan',
    offline_stat_responses: 'respons',
    offline_stat_items:     'item',
    offline_sync_title:     'Segerak & Sandaran',
    offline_sw_title:       'Status Pekerja Perkhidmatan',
    offline_clear_all_data: 'Padam Semua Data',
    offline_read_btn:       'Baca Sekarang',
    offline_teach_btn:      'Tanya Guru AI',
    offline_already_saved:  '✅ Tersimpan',
    offline_cleared:        'Dibersihkan.',
    offline_empty_downloads:'Belum ada muat turun',
    offline_empty_downloads_sub: 'Buku yang anda simpan luar talian akan muncul di sini. Ketik "Muat Turun untuk Luar Talian" pada mana-mana buku.',
    offline_empty_ocr:      'Tiada imbasan OCR dalam cache',
    offline_empty_ocr_sub:  'Teks yang diekstrak daripada imej disimpan di sini untuk akses luar talian.',
    offline_empty_ai:       'Tiada respons AI dalam cache',
    offline_empty_ai_sub:   'Gunakan Guru AI atau Pustakawan AI semasa dalam talian dan jawapan akan disimpan di sini.',
    offline_confirm_clear_downloads: 'Buang semua buku yang dimuat turun daripada storan luar talian?',
    offline_confirm_clear_ocr:       'Padam semua imbasan OCR yang dicache?',
    offline_confirm_clear_ai:        'Padam semua respons AI yang dicache?',
    offline_confirm_clear_all:       'Padam SEMUA data luar talian? Ini tidak boleh dibuat asal.',
  }
};

/* Voice command bilingual lookup table */
const CS_VOICE_COMMANDS = {
  /* English commands */
  'start guide':       'startGuide',
  'read text':         'readAloud',
  'read aloud':        'readAloud',
  'stop audio':        'stopTTS',
  'stop reading':      'stopTTS',
  'pause':             'pauseTTS',
  'resume':            'resumeTTS',
  'generate summary':  'summarise',
  'summarise':         'summarise',
  'generate quiz':     'generateQuiz',
  'upload image':      'uploadImage',
  'take photo':        'takePhoto',
  'capture image':     'captureImage',
  'extract text':      'extractText',
  'start focus':       'startFocus',
  'stop focus':        'stopFocus',
  'take a break':      'takeBreak',
  'open dashboard':    'openDashboard',
  'go home':           'goHome',
  'help':              'showHelp',
  /* Bahasa Melayu commands */
  'mulakan panduan':   'startGuide',
  'baca teks':         'readAloud',
  'baca kuat':         'readAloud',
  'henti audio':       'stopTTS',
  'hentikan audio':    'stopTTS',
  'jeda':              'pauseTTS',
  'teruskan':          'resumeTTS',
  'jana rumusan':      'summarise',
  'ringkaskan':        'summarise',
  'jana kuiz':         'generateQuiz',
  'muat naik imej':    'uploadImage',
  'ambil gambar':      'takePhoto',
  'tangkap imej':      'captureImage',
  'ekstrak teks':      'extractText',
  'mula fokus':        'startFocus',
  'henti fokus':       'stopFocus',
  'rehat':             'takeBreak',
  'buka dashboard':    'openDashboard',
  'bantuan':           'showHelp',
};

/**
 * CS.lang — Language system
 *
 * Usage:
 *   CS.lang.t('nav_home')   // returns 'Home' or 'Laman Utama'
 *   CS.lang.set('ms')       // switch to Bahasa Melayu
 *   CS.lang.get()           // returns 'en' or 'ms'
 */
const _lang = {
  _current: localStorage.getItem('cs_lang') || 'en',

  get() { return this._current; },

  set(code) {
    this._current = code;
    localStorage.setItem('cs_lang', code);
    document.documentElement.lang = (code === 'ms') ? 'ms-MY' : 'en';
    window.currentLang = code;
    /* Update all elements that have a data-i18n attribute */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key  = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const val  = this.t(key);
      if (attr) el.setAttribute(attr, val);
      else      el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
    /* Update the language switch button label */
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.textContent = this.t('nav_lang_switch');
    });
    window.dispatchEvent(new CustomEvent('cs:lang:changed', { detail: { lang: code } }));
  },

  t(key) {
    const dict = CS_LANG[this._current] || CS_LANG.en;
    return dict[key] || CS_LANG.en[key] || key;
  },

  resolveCommand(transcript) {
    const clean = (transcript || '').toLowerCase().trim();
    for (const [phrase, action] of Object.entries(CS_VOICE_COMMANDS)) {
      var re = new RegExp('(^|\\s)' + phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '(\\s|$)','i');
      if (re.test(clean)) return action;
    }
    return null;
  },

  init() {
    this.set(this._current);
  }
};

/* ============================================================
   SECTION 2 — USER PROFILE
   Saves the learner's name, disability type, and accessibility
   settings to localStorage. No server or login needed.
============================================================ */
const _user = {
  _KEY: 'cs_user_v1',

  _defaults() {
    return {
      name:         '',
      displayName:  '',
      language:     'en',
      onboarded:    false,
      profile: {
        gradeLevel:        '',
        readingLevel:      5,
        disabilityTypes:   [],
        primaryDisability: 'none',
        schoolName:        '',
      },
      accessibility: {
        fontSizePx:      16,
        fontFamily:      'system',
        contrastMode:    'normal',
        colorOverlay:    'none',
        lineSpacing:     1.6,
        letterSpacingEm: 0,
        zoomLevel:       100,
        ttsEnabled:      true,
        ttsSpeed:        1.0,
        ttsPitch:        1.0,
        captionOverlay:  false,
        readingRuler:    false,
        readingWindow:   false,
        voiceCommands:   false,
        reducedMotion:   false,
      },
      stats: {
        streakDays:    0,
        sessionsTotal: 0,
        sessionsWeek:  0,
        lastSessionAt: null,
        lastSessionDate: null,
      }
    };
  },

  _merge(target, source) {
    const out = Object.assign({}, target);
    for (const key of Object.keys(source || {})) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        out[key] = this._merge(target[key] || {}, source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  },

  get() {
    try {
      const raw = localStorage.getItem(this._KEY);
      if (!raw) return this._defaults();
      return this._merge(this._defaults(), JSON.parse(raw));
    } catch { return this._defaults(); }
  },

  save(data) {
    localStorage.setItem(this._KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('cs:user:updated'));
  },

  update(patch)       { this.save(this._merge(this.get(), patch)); },
  updateA11y(patch)   { this.update({ accessibility: patch }); },
  updateProfile(patch){ this.update({ profile: patch }); },
  getA11y()           { return this.get().accessibility; },
  getProfile()        { return this.get().profile; },
  getStats()          { return this.get().stats; },
  isOnboarded()       { return this.get().onboarded; },

  /**
   * Call this when any agent session ends.
   * Automatically updates streak days, session count, and weekly total.
   */
  recordSession() {
    const user    = this.get();
    const stats   = user.stats;
    const today   = new Date().toISOString().substring(0, 10);
    const lastDate= stats.lastSessionDate;

    stats.sessionsTotal = (stats.sessionsTotal || 0) + 1;

    /* Update weekly count — reset if it is a new week */
    const now    = new Date();
    const weekNo = this._weekNumber(now);
    const lastWeekNo = lastDate ? this._weekNumber(new Date(lastDate)) : -1;
    if (weekNo !== lastWeekNo) stats.sessionsWeek = 1;
    else stats.sessionsWeek = (stats.sessionsWeek || 0) + 1;

    /* Update streak */
    if (lastDate === today) {
      /* already recorded today — no change to streak */
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().substring(0, 10);
      if (lastDate === yStr) {
        stats.streakDays = (stats.streakDays || 0) + 1;
      } else if (lastDate !== today) {
        stats.streakDays = 1; /* streak broken — restart */
      }
    }

    stats.lastSessionAt   = new Date().toISOString();
    stats.lastSessionDate = today;
    this.save(Object.assign({}, user, { stats }));
  },

  _weekNumber(date) {
    const d   = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }
};

/* ============================================================
   SECTION 3 — ANALYTICS
   Tracks quiz scores, focus scores, TTS usage, and sessions.
   Used by the Early Warning Agent to calculate risk score.
============================================================ */
const _analytics = {
  _KEY:      'cs_analytics_v1',
  _MAX:      300,
  _session:  null,

  _getLog() {
    try { return JSON.parse(localStorage.getItem(this._KEY) || '[]'); }
    catch { return []; }
  },

  _saveLog(log) {
    try { localStorage.setItem(this._KEY, JSON.stringify(log.slice(-this._MAX))); }
    catch { /* storage full — ignore */ }
  },

  log(type, data) {
    const entry = Object.assign({
      id:   Date.now().toString() + Math.random().toString(36).slice(2, 5),
      type: type,
      ts:   new Date().toISOString(),
    }, data);
    const log = this._getLog();
    log.push(entry);
    this._saveLog(log);
  },

  startSession(agent) {
    this._session = { agent, start: Date.now() };
    this.log('session_start', { agent });
  },

  endSession(extras) {
    if (!this._session) return;
    const duration = Math.round((Date.now() - this._session.start) / 1000);
    this.log('session_end', Object.assign({ agent: this._session.agent, durationSec: duration }, extras));
    _user.recordSession();
    this._session = null;
  },

  logQuiz(data)  { this.log('quiz_result',  data); },
  logFocus(data) { this.log('focus_score',  data); },
  logTTS(data)   { this.log('tts_used',     data); },
  logOCR(data)   { this.log('ocr_scan',     data); },
  getAll()       { return this._getLog(); },
  clear()        { localStorage.removeItem(this._KEY); },

  /**
   * Returns a summary of the last N days.
   * Used by Early Warning Agent to compute risk score.
   */
  getSummary(days) {
    days = days || 7;
    const cutoff = Date.now() - days * 86400000;
    const all    = this._getLog().filter(e => new Date(e.ts).getTime() > cutoff);

    const sessions = all.filter(e => e.type === 'session_end');
    const quizzes  = all.filter(e => e.type === 'quiz_result');
    const focus    = all.filter(e => e.type === 'focus_score');
    const tts      = all.filter(e => e.type === 'tts_used');

    function avg(arr, key) {
      if (!arr.length) return null;
      return Math.round(arr.reduce((s, x) => s + (x[key] || 0), 0) / arr.length);
    }

    return {
      sessionCount:   sessions.length,
      avgQuizScore:   avg(quizzes, 'scorePct'),
      avgFocusScore:  avg(focus,   'score'),
      avgDurationMin: sessions.length ? Math.round(sessions.reduce((s, e) => s + (e.durationSec || 0), 0) / sessions.length / 60) : null,
      ttsRatioPct:    sessions.length ? Math.round((tts.length / sessions.length) * 100) : 0,
      activeDays:     new Set(all.map(e => e.ts.substring(0, 10))).size,
    };
  },

  /**
   * Computes weighted risk score 0-100.
   * Lower score = healthier. Higher score = more at risk.
   */
  computeRisk() {
    const s = this.getSummary(7);
    const quizComp     = s.avgQuizScore  != null ? (100 - s.avgQuizScore)  : 50;
    const freqComp     = Math.min(100, Math.max(0, (1 - s.sessionCount / 5) * 100));
    const durComp      = s.avgDurationMin != null ? Math.max(0, (40 - s.avgDurationMin) * 2.5) : 50;
    const focusComp    = s.avgFocusScore != null ? (100 - s.avgFocusScore) : 50;
    const ttsComp      = Math.min(100, s.ttsRatioPct || 0);

    const score = Math.round(
      quizComp  * 0.30 +
      freqComp  * 0.20 +
      durComp   * 0.15 +
      focusComp * 0.20 +
      ttsComp   * 0.10 +
      30        * 0.05
    );

    const level =
      score < 30 ? 'low' :
      score < 60 ? 'moderate' :
      score < 80 ? 'high' : 'critical';

    return { score, level, summary: s };
  }
};

/* ============================================================
   SECTION 4 — TTS ENGINE
   Text-to-Speech wrapper.
   Fixes the Chrome voice-loading bug by waiting for the
   voiceschanged event before picking a voice.
============================================================ */
const _tts = (() => {
  const synth = window.speechSynthesis;
  let _voices   = [];
  let _ready    = false;
  let _queued   = null;

  var _loadVoices = function() {
    var v = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (v && v.length > 0) { _voices = v; _ready = true; if (_queued) { _queued(); _queued = null; } }
  };
  _loadVoices();
  if (window.speechSynthesis && 'onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = _loadVoices;
  }

  function _pick(lang) {
    return _voices.find(v => v.lang.startsWith(lang)) ||
           _voices.find(v => v.lang.startsWith('en')) || null;
  }

  return {
    speak(text, opts) {
      if (!synth || !text) return;
      synth.cancel();
      opts = opts || {};
      if (!_ready) { _queued = () => this.speak(text, opts); return; }

      const pref  = _user.getA11y();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate  = opts.rate  !== undefined ? opts.rate  : (pref.ttsSpeed  || 1.0);
      utter.pitch = opts.pitch !== undefined ? opts.pitch : (pref.ttsPitch  || 1.0);
      utter.lang  = opts.lang  ||
        (localStorage.getItem('cs_lang') === 'ms' ? 'ms-MY' : 'en-MY');

      const voice = _pick(utter.lang.substring(0, 2));
      if (voice) utter.voice = voice;

      utter.onend = function() {
        window.dispatchEvent(new CustomEvent('cs:tts:ended'));
        if (typeof opts.onEnd === 'function') opts.onEnd();
      };

      /* Show caption bar if enabled */
      if (pref.captionOverlay) {
        let cap = document.querySelector('.cs-caption-bar');
        if (!cap) {
          cap           = document.createElement('div');
          cap.className = 'cs-caption-bar';
          cap.setAttribute('aria-live', 'polite');
          cap.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:rgba(0,0,0,0.85);color:white;padding:14px 20px;font-size:18px;text-align:center;z-index:9999';
          document.body.appendChild(cap);
        }
        cap.textContent = text.length > 100 ? text.substring(0, 100) + '…' : text;
        const origEnd = utter.onend;
        utter.onend = function() { cap.textContent = ''; origEnd(); };
      }

      synth.speak(utter);
      _analytics.logTTS({ agent: opts.agent || 'unknown', chars: text.length });
    },

    stop()        { synth && synth.cancel(); window.dispatchEvent(new CustomEvent('cs:tts:ended')); },
    pause()       { synth && synth.pause(); },
    resume()      { synth && synth.resume(); },
    isSpeaking()  { return !!(synth && synth.speaking); },
    isSupported() { return !!synth; },
  };
})();

/* ============================================================
   SECTION 5 — VOICE ENGINE
   Speech Recognition wrapper.
   Supports continuous mode with automatic restart.
   Fixes the bug where continuous mode silently died on mobile.
============================================================ */
const _voice = (() => {
  const SR  = window.SpeechRecognition || window.webkitSpeechRecognition;
  let _rec      = null;
  let _active   = false;
  let _handlers = {};
  let _opts     = {};

  function _updateBar(msg, listening) {
    const bar = document.getElementById('cs-voice-bar');
    if (!bar) return;
    const txt = bar.querySelector('.cs-voice-text');
    if (txt) txt.textContent = msg;
    bar.style.opacity = _active ? '1' : '0';
    const dot = bar.querySelector('.cs-voice-dot');
    if (dot) dot.style.animation = listening ? 'cs-pulse 1s infinite' : 'none';
  }

  function _start() {
    if (!SR) {
      CS.toast(_lang.t('voice_not_supported'), 'error');
      return;
    }
    _rec                  = new SR();
    _rec.continuous       = false;
    _rec.interimResults   = false;
    _rec.lang             = localStorage.getItem('cs_lang') === 'ms' ? 'ms-MY' : 'en-MY';
    _rec.maxAlternatives  = 3;

    _rec.onstart = function() {
      _active = true;
      _updateBar(_lang.t('blind_listening'), true);
      window.dispatchEvent(new CustomEvent('cs:voice:start'));
    };

    _rec.onresult = function(e) {
      if (!e.results || !e.results.length || !e.results[0][0]) return;
      const transcript = e.results[0][0].transcript;
      _updateBar('Heard: "' + transcript + '"', false);
      const action = _lang.resolveCommand(transcript);
      window.dispatchEvent(new CustomEvent('cs:voice:result', { detail: { transcript, action } }));
      if (action && _handlers[action]) _handlers[action](transcript);
      else if (!action) _updateBar(_lang.t('blind_not_heard'), false);
    };

    _rec.onerror = function(e) {
      _active = false;
      const msgs = {
        'not-allowed': _lang.t('voice_denied'),
        'network':     _lang.t('voice_network_err'),
        'no-speech':   'No speech detected.',
      };
      _updateBar(msgs[e.error] || ('Error: ' + e.error), false);
      window.dispatchEvent(new CustomEvent('cs:voice:error', { detail: e.error }));
      /* Restart continuous mode after any error except permission denied */
      if (_opts.continuous && e.error !== 'not-allowed') {
        setTimeout(function() { if (_opts.continuous) _start(); }, 800);
      }
    };

    /* KEY FIX: restart continuous mode on every onend event */
    _rec.onend = function() {
      _active = false;
      if (_opts.continuous) {
        setTimeout(function() { if (_opts.continuous) _start(); }, 300);
      } else {
        _updateBar('Ready', false);
      }
    };

    try { _rec.start(); }
    catch(e) { console.error('[Voice]', e); }
  }

  return {
    isSupported() { return !!SR; },

    start(opts) {
      _opts = opts || {};
      if (_active) return;
      _start();
    },

    stop() {
      _opts   = {};
      _active = false;
      if (_rec) { try { _rec.stop(); } catch(e) {} _rec = null; }
      _updateBar('Stopped', false);
      window.dispatchEvent(new CustomEvent('cs:voice:stop'));
    },

    addCommand(action, fn) { _handlers[action] = fn; },
    addCommands(map)       { Object.assign(_handlers, map); },
    isActive()             { return _active; },
  };
})();

/* ============================================================
   SECTION 6 — GEMINI AI CLIENT
   Connects to Google Gemini API (gemini-2.0-flash model).
   Accepts both legacy AIza... keys and new AQ... key format.

   To use the AI features:
   1. Go to https://aistudio.google.com/app/apikey and get a free API key
   2. Open Settings (gear icon in dashboard) and paste your key
   3. All AI features will then work: summarise, quiz, recommend
============================================================ */
const _groq = (() => {
  const MODEL = 'gemini-2.0-flash';
  const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';

  let _key   = localStorage.getItem('gemini_api_key') || '';
  let _quota = false;

  function _prompt(role, text, lang, level) {
    const langLabel = lang === 'ms' ? 'Bahasa Malaysia' : 'English';
    const levels = {
      easy:   'simple language for a 9-year-old',
      normal: 'standard secondary school level',
      deep:   'detailed university-level explanation',
    };
    return (
      'You are an educational AI for Malaysian inclusive learning. ' +
      'Respond in ' + langLabel + ' at ' + (levels[level] || levels.normal) + '. ' +
      'Return ONLY a valid JSON object — no markdown, no code fences, no preamble.\n\n' +
      role + '\n\nText:\n' + text.substring(0, 8000)
    );
  }

  /* Robust JSON extractor — handles fences, whitespace, wrapped text */
  function _extractJSON(text) {
    if (!text) return null;
    var codeBlock = text.match(/```(?:json)?[\s\S]*?```/);
    if (codeBlock) {
      var inner = codeBlock[0].replace(/```(?:json)?/,'').replace(/```/,'').trim();
      try { return JSON.parse(inner); } catch(e) {}
    }
    var start = -1;
    var openChar = '', closeChar = '';
    var bi = text.indexOf('{'), ai = text.indexOf('[');
    if (bi === -1 && ai === -1) return null;
    if (bi === -1) { start = ai; openChar='['; closeChar=']'; }
    else if (ai === -1) { start = bi; openChar='{'; closeChar='}'; }
    else if (ai < bi) { start = ai; openChar='['; closeChar=']'; }
    else { start = bi; openChar='{'; closeChar='}'; }
    var depth = 0, inStr = false, esc = false;
    for (var i = start; i < text.length; i++) {
      var c = text[i];
      if (esc) { esc=false; continue; }
      if (c==='\\' && inStr) { esc=true; continue; }
      if (c==='"') { inStr=!inStr; continue; }
      if (inStr) continue;
      if (c===openChar) depth++;
      else if (c===closeChar) { depth--; if(depth===0){ try{ return JSON.parse(text.slice(start,i+1)); }catch(e){ return null; } } }
    }
    return null;
  }

  async function _call(prompt) {
    if (_quota)            return { error: 'quota',   fallback: true };
    if (!navigator.onLine) return { error: 'offline', fallback: true };
    if (!_key)             return { error: 'no_key',  fallback: true };

    try {
      const res = await fetch(BASE_URL + '?key=' + _key, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
        }),
        signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined,
      });

      if (res.status === 429) { _quota = true; return { error: 'quota', fallback: true }; }
      if (res.status === 400) return { error: 'invalid_key', fallback: true };
      if (res.status === 403) return { error: 'invalid_key', fallback: true };
      if (!res.ok)            return { error: 'HTTP ' + res.status, fallback: true };

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) return { error: 'empty_response', fallback: true };
      return { data: _extractJSON(text), fallback: false };
    } catch(e) {
      console.warn('[Gemini AI]', e.message);
      return { error: e.message, fallback: true };
    }
  }

  return {
    setKey(k)  { _key = k; localStorage.setItem('gemini_api_key', k); _quota = false; },
    clearKey() { _key = ''; localStorage.removeItem('gemini_api_key'); },
    isReady()  { return !!_key; },
    getStatus() {
      if (_quota) return 'quota';
      if (!!_key) return 'ready';
      return 'no-key';
    },

    async summarise(text, lang, level) {
      lang  = lang  || _lang.get();
      level = level || 'normal';
      const res = await _call(_prompt(
        'Summarise this text. Return JSON: {"summary":"...","keyPoints":["..."],"difficulty":"easy|medium|hard","wordCount":0}',
        text, lang, level
      ));
      if (res.fallback) return this._fbSummary(text, res.error);
      return res.data;
    },

    async generateQuiz(text, lang, count) {
      lang  = lang  || _lang.get();
      count = count || 4;
      const res = await _call(_prompt(
        'Generate ' + count + ' multiple-choice questions with 4 options each. Return JSON: {"questions":[{"question":"...","options":["A...","B...","C...","D..."],"correct":0,"explanation":"..."}]}',
        text, lang, 'normal'
      ));
      if (res.fallback) return { questions: [], _fallback: true, _reason: res.error };
      return res.data;
    },

    async recommend(profile, interests, lang) {
      lang = lang || _lang.get();
      const info = JSON.stringify({ grade: profile.gradeLevel, level: profile.readingLevel, disabilities: profile.disabilityTypes });
      const res = await _call(_prompt(
        'Recommend 6 books for this Malaysian student: ' + info + '. Return JSON: {"books":[{"title":"...","author":"...","reason":"...","level":"easy|medium|hard","format":"audio|text|both","genre":"..."}]}',
        'Interests: ' + interests, lang, 'normal'
      ));
      if (res.fallback) return { books: [], _fallback: true, _reason: res.error };
      return res.data;
    },

    async generateIntervention(riskData, profile, lang) {
      lang = lang || _lang.get();
      const res = await _call(_prompt(
        'Generate a 3-step intervention plan. Risk: ' + riskData.score + ' (' + riskData.level + '). Return JSON: {"planTitle":"...","triggerReason":"...","steps":[{"stepNumber":1,"title":"...","description":"...","agent":"...","durationDays":7}]}',
        'Risk: ' + JSON.stringify(riskData), lang, 'normal'
      ));
      if (res.fallback) return this._fbIntervention(riskData, res.error);
      return res.data;
    },

    async testConnection() {
      const res = await _call('Return exactly this JSON: {"ok":true,"message":"Connected"}');
      if (res.fallback) return { ok: false, message: res.error || 'Failed' };
      return { ok: true, message: 'Connected' };
    },

    _fbSummary(text, reason) {
      var s = (text.match(/[^.!?]+[.!?]+/g) || []).slice(0, 3).join(' ');
      return { summary: s || text.substring(0, 200), keyPoints: [], difficulty: 'unknown', wordCount: text.split(/\s+/).length, _fallback: true, _reason: reason };
    },
    _fbIntervention(risk, reason) {
      return {
        planTitle:     'Standard Support Plan',
        triggerReason: 'Risk score: ' + risk.score,
        steps: [
          { stepNumber: 1, title: 'Daily Reading Companion', description: 'Use Reading Companion for 15 minutes daily.', agent: 'reading-companion', durationDays: 7 },
          { stepNumber: 2, title: 'Enable Text-to-Speech',   description: 'Turn on TTS in Accessibility Settings.',       agent: 'accessibility',       durationDays: 14 },
          { stepNumber: 3, title: 'ADHD Focus Sessions',     description: 'Use 10-minute Pomodoro sessions.',             agent: 'adhd-agent',          durationDays: 7 },
        ],
        _fallback: true, _reason: reason,
      };
    },
  };
})();

/* ============================================================
   SECTION 7 — ACCESSIBILITY ENGINE
   Reads the user's saved settings and applies them to the page.
   Call CS.a11y.apply() on every page load.
============================================================ */
const _a11y = {
  apply(prefs) {
    const p = prefs || _user.getA11y();
    const root = document.documentElement;
    const body = document.body;

    /* Font size */
    root.style.fontSize = (p.fontSizePx || 16) + 'px';

    /* Font family */
    const fonts = {
      system:    '',
      dyslexic:  'Lexend, "Comic Sans MS", sans-serif',
      arial:     'Arial, sans-serif',
      verdana:   'Verdana, sans-serif',
    };
    body.style.fontFamily = fonts[p.fontFamily] || '';

    /* Contrast */
    body.classList.toggle('cs-high-contrast',    p.contrastMode === 'high');
    body.classList.toggle('cs-inverted-contrast', p.contrastMode === 'inverted');

    /* Colour overlay */
    var overlays = {
      none:   'transparent',
      yellow: 'rgba(255,255,0,0.15)',
      blue:   'rgba(0,100,255,0.12)',
      green:  'rgba(0,200,100,0.12)',
      grey:   'rgba(128,128,128,0.18)',
      pink:   'rgba(255,100,150,0.12)',
    };
    var ov = document.getElementById('cs-overlay');
    if (!ov) {
      ov           = document.createElement('div');
      ov.id        = 'cs-overlay';
      ov.setAttribute('aria-hidden', 'true');
      ov.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998';
      document.body.appendChild(ov);
    }
    ov.style.background = overlays[p.colorOverlay] || 'transparent';

    /* Line and letter spacing */
    root.style.setProperty('--cs-line-height',     String(p.lineSpacing      || 1.6));
    root.style.setProperty('--cs-letter-spacing',  (p.letterSpacingEm || 0)  + 'em');

    /* Zoom */
    root.style.zoom = (p.zoomLevel || 100) + '%';

    /* Reading ruler */
    body.classList.toggle('cs-ruler-on', !!p.readingRuler);
    if (p.readingRuler) this._initRuler();

    /* Reduced motion */
    if (p.reducedMotion) {
      var s = document.getElementById('cs-no-motion');
      if (!s) {
        s    = document.createElement('style');
        s.id = 'cs-no-motion';
        s.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }';
        document.head.appendChild(s);
      }
    } else {
      var el = document.getElementById('cs-no-motion');
      if (el) el.remove();
    }

    window.dispatchEvent(new CustomEvent('cs:a11y:applied', { detail: p }));
  },

  _initRuler() {
    var ruler = document.getElementById('cs-ruler');
    if (!ruler) {
      ruler           = document.createElement('div');
      ruler.id        = 'cs-ruler';
      ruler.setAttribute('aria-hidden', 'true');
      ruler.style.cssText =
        'position:fixed;left:0;right:0;height:2.5em;' +
        'background:rgba(255,215,0,0.25);' +
        'border-top:1px solid rgba(255,215,0,0.6);' +
        'border-bottom:1px solid rgba(255,215,0,0.6);' +
        'pointer-events:none;z-index:8000;display:none';
      document.body.appendChild(ruler);
      document.addEventListener('mousemove', function(e) {
        if (!document.body.classList.contains('cs-ruler-on')) return;
        ruler.style.display = 'block';
        ruler.style.top     = (e.clientY - 20) + 'px';
      });
    }
  }
};

/* ============================================================
   SECTION 8 — TOAST NOTIFICATIONS
   Small pop-up messages at the top-right of the page.
   CS.toast('Message', 'success')  — green tick
   CS.toast('Warning', 'warn')     — orange warning
   CS.toast('Failed', 'error')     — red cross
   CS.toast('Note', 'info')        — blue info
============================================================ */
function _toast(title, type, msg) {
  type = type || 'success';
  var container = document.querySelector('.cs-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'cs-toast-container';
    container.id        = 'cs-toasts';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    container.style.cssText =
      'position:fixed;top:70px;right:16px;z-index:10000;' +
      'display:flex;flex-direction:column;gap:8px;max-width:340px;';
    document.body.appendChild(container);
  }

  var colors = { success:'#15803D', warn:'#B45309', error:'#B91C1C', info:'#1D4ED8' };
  var icons  = { success:'✓', warn:'⚠', error:'✗', info:'ℹ' };
  var toast  = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.style.cssText =
    'background:#fff;border:1px solid #e5e7eb;border-left:4px solid ' + (colors[type]||colors.info) + ';' +
    'border-radius:8px;padding:12px 14px;display:flex;gap:10px;align-items:flex-start;' +
    'box-shadow:0 4px 12px rgba(0,0,0,0.1);font-family:system-ui,sans-serif;';
  toast.innerHTML =
    '<div style="color:' + (colors[type]||colors.info) + ';font-size:16px;flex-shrink:0" aria-hidden="true">' + (icons[type]||icons.info) + '</div>' +
    '<div><div style="font-size:14px;font-weight:600;color:#111">' + title + '</div>' +
    (msg ? '<div style="font-size:12px;color:#6b7280;margin-top:2px">' + msg + '</div>' : '') + '</div>';

  container.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 4000);
}

/* ============================================================
   SECTION 9 — NAVIGATION HELPERS
   Marks the current page link as active in the nav bar.
   Call CS.nav.init() once per page.
============================================================ */
const _nav = {
  init() {
    var path = location.pathname;
    var page = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, [data-nav-link]').forEach(function(a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      a.classList.toggle('active', href === page);
      if (href === page) a.setAttribute('aria-current', 'page');
    });
  }
};

/* ============================================================
   GLOBAL CSS INJECTED BY shared.js
   These are the minimal styles needed for the shared
   components (toast, overlay, ruler, voice bar, caption).
   Each HTML page still has its own full stylesheet.
============================================================ */
(function() {
  var style = document.createElement('style');
  style.id  = 'cs-shared-styles';
  style.textContent = [
    /* High contrast mode */
    '.cs-high-contrast { filter: contrast(1.5); }',
    '.cs-inverted-contrast { filter: invert(1) hue-rotate(180deg); }',

    /* Voice command bar at bottom of screen */
    '#cs-voice-bar {',
    '  position:fixed;bottom:20px;left:50%;transform:translateX(-50%);',
    '  background:#0B4F6C;color:#fff;border-radius:9999px;',
    '  padding:10px 20px;display:flex;align-items:center;gap:10px;',
    '  font-size:14px;font-weight:500;z-index:9000;',
    '  opacity:0;pointer-events:none;transition:opacity 0.2s;',
    '  white-space:nowrap;',
    '}',
    '#cs-voice-bar.active { opacity:1; pointer-events:auto; }',
    '.cs-voice-dot {',
    '  width:10px;height:10px;border-radius:50%;',
    '  background:#F5A623;flex-shrink:0;',
    '}',
    '@keyframes cs-pulse {',
    '  0%,100%{transform:scale(1)} 50%{transform:scale(1.5)}',
    '}',

    /* Reading ruler */
    '#cs-ruler { display:none; }',
    '.cs-ruler-on #cs-ruler { display:block; }',

    /* Focus ring visible for keyboard users */
    ':focus-visible {',
    '  outline:3px solid #F5A623;outline-offset:3px;',
    '  border-radius:4px;',
    '}',

    /* Skip link for keyboard/screen reader users */
    '.cs-skip-link {',
    '  position:absolute;top:-100px;left:16px;',
    '  background:#0B4F6C;color:#fff;padding:8px 16px;',
    '  border-radius:6px;font-weight:700;z-index:10000;',
    '  transition:top 0.2s;text-decoration:none;',
    '}',
    '.cs-skip-link:focus { top:16px; }',
  ].join('\n');
  document.head.appendChild(style);
})();

/* ============================================================
   PUBLIC API — window.CS
   Every HTML page accesses everything through window.CS.

   Examples:
     CS.tts.speak("Hello learner")
     CS.voice.start()
     CS.gemini.summarise(text)
     CS.user.getA11y()
     CS.lang.t('nav_home')
     CS.analytics.computeRisk()
     CS.toast("Saved!", "success")
     CS.a11y.apply()
============================================================ */
window.CS = {
  lang:      _lang,
  user:      _user,
  analytics: _analytics,
  tts:       _tts,
  voice:     _voice,
  gemini:    _groq,
  // groq: legacy alias only — this calls Gemini, NOT the Groq API (api.groq.com)
  groq:      _groq,  /* legacy alias — use CS.gemini going forward */
  a11y:      _a11y,
  nav:       _nav,
  toast:     _toast,
  t:         function(key) { return _lang.t(key); },
};

/* ── Auto-initialise on every page load ─────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  /* Apply saved language */
  _lang.init();

  /* Apply saved accessibility settings */
  _a11y.apply();

  /* Mark active nav link */
  _nav.init();

  /* BUG-024 — keyboard support for Agents nav dropdown */
  (function() {
    var dropBtn = document.querySelector('.nav-dropdown > button[aria-haspopup]');
    if (!dropBtn) return;

    dropBtn.addEventListener('keydown', function(e) {
      var menu = this.closest('.nav-dropdown').querySelector('.dropdown-menu');
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var isOpen = menu.style.display === 'flex' || menu.classList.contains('open');
        if (isOpen) {
          menu.style.display = 'none'; menu.classList.remove('open');
          this.setAttribute('aria-expanded', 'false');
        } else {
          menu.style.display = 'flex'; menu.style.flexDirection = 'column';
          menu.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
          var first = menu.querySelector('a, button');
          if (first) first.focus();
        }
      }
      if (e.key === 'Escape') {
        menu.style.display = 'none'; menu.classList.remove('open');
        this.setAttribute('aria-expanded', 'false'); this.focus();
      }
    });

    var menu = dropBtn.closest('.nav-dropdown').querySelector('.dropdown-menu');
    if (menu) {
      menu.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          this.style.display = 'none'; this.classList.remove('open');
          dropBtn.setAttribute('aria-expanded', 'false'); dropBtn.focus();
        }
      });
    }
  })();

  /* Language toggle buttons */
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-lang-toggle]')) {
      var next = _lang.get() === 'en' ? 'ms' : 'en';
      _lang.set(next);
    }
  });

  /* Escape key stops TTS */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      _tts.stop();
      var panel = document.getElementById('cs-a11y-panel');
      if (panel) panel.removeAttribute('open');
    }
    /* Alt+S — stop audio */
    if (e.altKey && e.key === 's') { e.preventDefault(); _tts.stop(); }
    /* Alt+V — toggle voice */
    if (e.altKey && e.key === 'v') {
      e.preventDefault();
      _voice.isActive() ? _voice.stop() : _voice.start({ continuous: true });
    }
  });

  /* Offline / online banners */
  if (!navigator.onLine) _toast(_lang.t('err_offline'), 'warn');
  window.addEventListener('offline', function() { _toast(_lang.t('err_offline'), 'warn'); });
  window.addEventListener('online',  function() { _toast('Back online', 'success'); });
});

/* ── Global convenience bridges for HTML onclick handlers ───────────────
 *  All HTML pages call speak(), stopSpeech(), toggleLanguage(), toggleNav()
 *  and reference synth / currentLang directly. These bridges expose the
 *  internal CS modules as plain globals so those calls work without changes
 *  to any HTML file.
 * ──────────────────────────────────────────────────────────────────────── */

/** Speak text aloud. Mirrors CS.tts.speak(). */
window.speak = function(text, onEnd) {
  return _tts.speak(text, { onEnd: onEnd });
};

/** Stop any active TTS. Mirrors CS.tts.stop(). */
window.stopSpeech = function() {
  return _tts.stop();
};

/** Toggle language between EN and BM. Updates button label automatically. */
window.toggleLanguage = function() {
  var next = _lang.get() === 'en' ? 'ms' : 'en';
  _lang.set(next);
  /* Update every lang toggle button text */
  var btn = document.getElementById('langBtn');
  if (btn) btn.textContent = next === 'en' ? 'BM' : 'EN';
  window.currentLang = next;
};

/** Toggle mobile nav drawer. */
window.toggleNav = function() {
  var links = document.getElementById('navLinks');
  if (links) links.classList.toggle('active');
  var hamburger = document.querySelector('.nav-hamburger[aria-expanded]');
  if (hamburger) {
    var isOpen = document.querySelector('.nav-links') && document.querySelector('.nav-links').classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
};

/** Expose the browser speech synthesis object as a global (used by blind-audio.html). */
window.synth = window.speechSynthesis;

/** Keep currentLang in sync — read by blind-audio.html and ocr-agent.html. */
window.currentLang = (function() {
  try { return localStorage.getItem('cs_lang') || 'en'; } catch(e) { return 'en'; }
})();

/* ============================================================
   CS.books — Book Discovery Agent data layer
   localStorage key: cs_my_library  (array of saved books)
   localStorage key: cs_book_content (text to pass between agents)
============================================================ */
window.CS.books = {

  /* ── Mock catalogue data ──────────────────────────────── */
  GUTENBERG: [
    { id:'g1', title:'Alice\'s Adventures in Wonderland', author:'Lewis Carroll', lang:'English', year:1865, subjects:['Fiction','Children'], accessibility:['adhd','dyslexia'], extract:'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do…' },
    { id:'g2', title:'The Wonderful Wizard of Oz', author:'L. Frank Baum', lang:'English', year:1900, subjects:['Fiction','Children','Adventure'], accessibility:['adhd','dyslexia'], extract:'Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer\'s wife…' },
    { id:'g3', title:'Pride and Prejudice', author:'Jane Austen', lang:'English', year:1813, subjects:['Fiction','Classic','Romance'], accessibility:['dyslexia'], extract:'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife…' },
    { id:'g4', title:'The Science of Getting Rich', author:'Wallace D. Wattles', lang:'English', year:1910, subjects:['Self-help','Career'], accessibility:['adhd','blind'], extract:'Whatever may be said in praise of poverty, the fact remains that it is not possible to live a really complete or successful life unless one is rich…' },
    { id:'g5', title:'Flatland: A Romance of Many Dimensions', author:'Edwin A. Abbott', lang:'English', year:1884, subjects:['Science','Mathematics','Fiction'], accessibility:['adhd','dyslexia'], extract:'I call our world Flatland, not because we call it so, but to make its nature clearer to you, my happy readers, who are privileged to live in Space…' },
    { id:'g6', title:'Twenty Thousand Leagues Under the Sea', author:'Jules Verne', lang:'English', year:1870, subjects:['Science','Adventure','Fiction'], accessibility:['adhd'], extract:'The year 1866 was signalised by a remarkable incident, a mysterious and puzzling phenomenon, which doubtless no one has yet forgotten…' },
    { id:'g7', title:'The Art of War', author:'Sun Tzu', lang:'English', year:500, subjects:['Strategy','History','Philosophy'], accessibility:['adhd','blind'], extract:'The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin…' },
    { id:'g8', title:'Siti Nurbaya', author:'Marah Rusli', lang:'Bahasa Melayu', year:1922, subjects:['Fiction','Malaysian Literature','Classic'], accessibility:['dyslexia'], extract:'Pada suatu hari di waktu petang, kedengaranlah suara seruling yang merdu sekali di lereng bukit Padang Panjang…' },
  ],

  OPEN_LIBRARY: [
    { id:'ol1', title:'Harry Potter and the Sorcerer\'s Stone', author:'J.K. Rowling', availability:'Preview', borrow:'Borrow available at library', url:'#', accessibility:['adhd','dyslexia'] },
    { id:'ol2', title:'The Very Hungry Caterpillar', author:'Eric Carle', availability:'Preview', borrow:'Physical copy at school library', url:'#', accessibility:['adhd','deaf','dyslexia'] },
    { id:'ol3', title:'Charlotte\'s Web', author:'E.B. White', availability:'Full text available', borrow:'Borrow available at library', url:'#', accessibility:['dyslexia','blind'] },
    { id:'ol4', title:'A Brief History of Time', author:'Stephen Hawking', availability:'Preview', borrow:'Ask library for access', url:'#', accessibility:['adhd','blind'] },
    { id:'ol5', title:'Totto-Chan: The Little Girl at the Window', author:'Tetsuko Kuroyanagi', availability:'Preview', borrow:'Borrow available at library', url:'#', accessibility:['adhd','dyslexia'] },
  ],

  GOOGLE_BOOKS: [
    { id:'gb1', title:'Thinking, Fast and Slow', author:'Daniel Kahneman', preview:'Snippet preview', pages:499, accessibility:['adhd','blind'] },
    { id:'gb2', title:'The Diary of a Young Girl', author:'Anne Frank', preview:'Limited preview', pages:283, accessibility:['dyslexia','deaf'] },
    { id:'gb3', title:'Atomic Habits', author:'James Clear', preview:'Snippet preview', pages:320, accessibility:['adhd'] },
    { id:'gb4', title:'Wonder', author:'R.J. Palacio', preview:'Limited preview', pages:315, accessibility:['adhd','dyslexia','deaf'] },
    { id:'gb5', title:'The Curious Incident of the Dog in the Night-Time', author:'Mark Haddon', preview:'Snippet preview', pages:226, accessibility:['adhd','dyslexia'] },
  ],

  COMMUNITY: [
    { id:'cm1', title:'Nota Sains Tingkatan 2 — Sistem Pernafasan', author:'Cikgu Amirah', type:'Note', lang:'Bahasa Melayu', accessibility:['adhd','dyslexia'] },
    { id:'cm2', title:'Mind Map: English Literature Form 4', author:'Student Volunteer', type:'Mind Map', lang:'English', accessibility:['adhd','deaf'] },
    { id:'cm3', title:'Vocabulary List — UPSR Bahasa Melayu', author:'Parent Community', type:'Vocabulary', lang:'Bahasa Melayu', accessibility:['dyslexia','blind'] },
    { id:'cm4', title:'Quiz: Matematik Tahun 5 — Pecahan', author:'Teacher Resource Pool', type:'Quiz', lang:'Bahasa Melayu', accessibility:['adhd','dyslexia'] },
  ],

  /* ── Recommendation engine ──────────────────────────────── */
  recommend: function(query) {
    var profile = null;
    try { profile = JSON.parse(localStorage.getItem('cs_user') || '{}'); } catch(e) { profile = {}; }
    var disability = ((profile.profile || {}).disability || '').toLowerCase();
    var lang = (profile.language || localStorage.getItem('cs_lang') || 'en');

    var q = (query || '').toLowerCase();
    var results = [];

    /* Gutenberg search */
    this.GUTENBERG.forEach(function(b) {
      var match = !q
        || b.title.toLowerCase().includes(q)
        || b.author.toLowerCase().includes(q)
        || b.subjects.some(function(s){ return s.toLowerCase().includes(q); });
      var accessMatch = !disability || b.accessibility.includes(disability);
      if (match || accessMatch) results.push(Object.assign({}, b, { source:'gutenberg', legalStatus:'public' }));
    });

    /* Open Library search */
    this.OPEN_LIBRARY.forEach(function(b) {
      var match = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      if (match) results.push(Object.assign({}, b, { source:'openlibrary', legalStatus:'preview' }));
    });

    /* Google Books */
    this.GOOGLE_BOOKS.forEach(function(b) {
      var match = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      if (match) results.push(Object.assign({}, b, { source:'googlebooks', legalStatus:'preview' }));
    });

    return results.slice(0, 20);
  },

  /* ── My Library ─────────────────────────────────────────── */
  getLibrary: function() {
    try { return JSON.parse(localStorage.getItem('cs_my_library') || '[]'); } catch(e) { return []; }
  },

  saveToLibrary: function(book) {
    var lib = this.getLibrary();
    var exists = lib.some(function(b){ return b.id === book.id; });
    if (!exists) {
      lib.unshift(Object.assign({}, book, { savedAt: Date.now(), progress: 0 }));
      localStorage.setItem('cs_my_library', JSON.stringify(lib));
    }
    return !exists;
  },

  removeFromLibrary: function(bookId) {
    var lib = this.getLibrary().filter(function(b){ return b.id !== bookId; });
    localStorage.setItem('cs_my_library', JSON.stringify(lib));
  },

  /* ── Send text to another agent via localStorage ─────────── */
  sendToAgent: function(text, title, agentPage) {
    localStorage.setItem('cs_book_content',       text  || '');
    localStorage.setItem('cs_book_content_title', title || '');
    if (agentPage) window.location.href = agentPage;
  },

  /* ── Community materials ────────────────────────────────── */
  getCommunityMaterials: function() {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem('cs_community_materials') || '[]'); } catch(e) {}
    return this.COMMUNITY.concat(saved);
  },

  saveCommunityMaterial: function(material) {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem('cs_community_materials') || '[]'); } catch(e) {}
    saved.unshift(Object.assign({}, material, { id: 'u' + Date.now(), savedAt: Date.now() }));
    localStorage.setItem('cs_community_materials', JSON.stringify(saved));
  },
};

/* ============================================================
   CS.db — Backend-ready data layer
   Wraps all localStorage reads/writes with a structured API
   that is 1:1 compatible with a future REST backend.
   All keys: cs_sessions, cs_agent_counts, cs_feedback,
             cs_class_roster (plus existing cs_user, etc.)
============================================================ */
window.CS.db = {

  // Schema version for future migrations
  SCHEMA_VERSION: 1,

  // ── Student profile ────────────────────────────────────
  getProfile: function() {
    try {
      var raw = localStorage.getItem('cs_user');
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return {
        name:          parsed.name          || parsed.displayName || '',
        displayName:   parsed.displayName   || parsed.name        || '',
        language:      parsed.language      || 'en',
        onboarded:     parsed.onboarded     || false,
        profile:       parsed.profile       || {},
        accessibility: parsed.accessibility || {},
        stats:         parsed.stats         || {},
      };
    } catch(e) { return null; }
  },

  saveProfile: function(data) {
    try { localStorage.setItem('cs_user', JSON.stringify(data)); } catch(e) {}
  },

  // ── Learning sessions ──────────────────────────────────
  logSession: function(agentName, durationMs, outcome) {
    // outcome: { quizScore, wordsRead, focusMinutes, signsLearned }
    var sessions;
    try { sessions = JSON.parse(localStorage.getItem('cs_sessions') || '[]'); } catch(e) { sessions = []; }
    sessions.push({
      id:        Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      agentName: agentName || 'unknown',
      durationMs: durationMs || 0,
      outcome:   outcome   || {},
      ts:        new Date().toISOString(),
    });
    // cap at 500 entries
    if (sessions.length > 500) sessions = sessions.slice(-500);
    try { localStorage.setItem('cs_sessions', JSON.stringify(sessions)); } catch(e) {}
  },

  getSessions: function(days) {
    try {
      var all = JSON.parse(localStorage.getItem('cs_sessions') || '[]');
      if (!days) return all;
      var cutoff = Date.now() - days * 86400000;
      return all.filter(function(s) { return new Date(s.ts).getTime() > cutoff; });
    } catch(e) { return []; }
  },

  // ── Agent usage ────────────────────────────────────────
  trackAgent: function(agentName) {
    var counts;
    try { counts = JSON.parse(localStorage.getItem('cs_agent_counts') || '{}'); } catch(e) { counts = {}; }
    counts[agentName] = (counts[agentName] || 0) + 1;
    try { localStorage.setItem('cs_agent_counts', JSON.stringify(counts)); } catch(e) {}
  },

  getAgentCounts: function() {
    try { return JSON.parse(localStorage.getItem('cs_agent_counts') || '{}'); } catch(e) { return {}; }
  },

  // ── Feedback ───────────────────────────────────────────
  saveFeedback: function(formData) {
    var feedback;
    try { feedback = JSON.parse(localStorage.getItem('cs_feedback') || '[]'); } catch(e) { feedback = []; }
    feedback.push(Object.assign({ ts: new Date().toISOString() }, formData || {}));
    try { localStorage.setItem('cs_feedback', JSON.stringify(feedback)); } catch(e) {}
  },

  getFeedback: function() {
    try { return JSON.parse(localStorage.getItem('cs_feedback') || '[]'); } catch(e) { return []; }
  },

  // ── Class roster (teacher use) ─────────────────────────
  getClassRoster: function() {
    try { return JSON.parse(localStorage.getItem('cs_class_roster') || '[]'); } catch(e) { return []; }
  },

  saveClassRoster: function(students) {
    try { localStorage.setItem('cs_class_roster', JSON.stringify(students || [])); } catch(e) {}
  },

  addStudent: function(student) {
    // student = { id, name, profile, agents }
    var roster = this.getClassRoster();
    roster.push(student);
    this.saveClassRoster(roster);
  },

  // ── Export / Import ────────────────────────────────────
  exportToJSON: function() {
    return {
      schemaVersion: this.SCHEMA_VERSION,
      exportedAt:    new Date().toISOString(),
      profile:       this.getProfile(),
      sessions:      this.getSessions(),
      agentCounts:   this.getAgentCounts(),
      feedback:      this.getFeedback(),
      roster:        this.getClassRoster(),
    };
  },

  importFromJSON: function(json) {
    var data;
    try { data = typeof json === 'string' ? JSON.parse(json) : json; } catch(e) { console.error('[CS.db] importFromJSON: invalid JSON', e); return false; }
    if (!data || data.schemaVersion !== this.SCHEMA_VERSION) {
      console.warn('[CS.db] importFromJSON: schema version mismatch. Expected', this.SCHEMA_VERSION, 'got', data && data.schemaVersion);
      return false;
    }
    try {
      if (data.profile)     this.saveProfile(data.profile);
      if (data.sessions)    localStorage.setItem('cs_sessions',     JSON.stringify(data.sessions));
      if (data.agentCounts) localStorage.setItem('cs_agent_counts', JSON.stringify(data.agentCounts));
      if (data.feedback)    localStorage.setItem('cs_feedback',     JSON.stringify(data.feedback));
      if (data.roster)      localStorage.setItem('cs_class_roster', JSON.stringify(data.roster));
      return true;
    } catch(e) { console.error('[CS.db] importFromJSON error', e); return false; }
  },

  // ── Backend sync stub ──────────────────────────────────
  // Currently logs to console. Replace this stub with a real fetch() call
  // once a backend is configured.
  syncToBackend: function() {
    var payload = this.exportToJSON();
    console.log('[CS.db] Backend sync ready. Payload size:', JSON.stringify(payload).length, 'bytes');
    console.log('[CS.db] To enable: replace this stub with fetch(\'/api/sync\', {method:\'POST\',body:JSON.stringify(payload)})');
    return Promise.resolve({ status: 'local_only', message: 'Backend not configured' });
  },
};

/* ============================================================
   CS.offline — Intelligent Offline Mode
   IndexedDB-backed offline storage with online/offline detection,
   banner management, AI fallback cache, and sync queue.

   Stores (IndexedDB: 'celiksense-idb', version 2):
     downloads   — book text content saved for offline reading
     ocr_cache   — OCR-extracted text from scanned images
     ai_cache    — Gemini AI responses cached for offline replay
     sync_queue  — items queued to sync when connectivity returns

   Usage:
     CS.offline.init()                      // call once on DOMContentLoaded
     CS.offline.saveDownload(book)          // save book text offline
     CS.offline.getDownloads()              // Promise<items[]>
     CS.offline.saveOCR(text, title)        // cache OCR result
     CS.offline.saveAIResponse(key, resp)   // cache AI answer
     CS.offline.getCachedAIResponse(key)    // Promise<response|null>
     CS.offline.getStorageInfo()            // Promise<{used,quota,pct}>
     CS.offline.isOnline()                  // bool
============================================================ */
window.CS.offline = (function() {

  var IDB_NAME    = 'celiksense-idb';
  var IDB_VERSION = 2;
  var _db         = null;
  var _bannerEl   = null;
  var _syncEl     = null;
  var _wasOnline  = null;
  var _lang       = { t: function(k) { return (window.CS && window.CS.lang) ? window.CS.lang.t(k) : k; } };

  /* ── IndexedDB open ──────────────────────────────────── */
  function _openDB() {
    if (_db) return Promise.resolve(_db);
    return new Promise(function(resolve, reject) {
      var req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onerror   = function() { reject(req.error); };
      req.onsuccess = function() { _db = req.result; resolve(_db); };
      req.onupgradeneeded = function(e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('downloads')) {
          var s = db.createObjectStore('downloads', { keyPath: 'id' });
          s.createIndex('savedAt', 'savedAt');
        }
        if (!db.objectStoreNames.contains('ocr_cache')) {
          db.createObjectStore('ocr_cache', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('ai_cache')) {
          db.createObjectStore('ai_cache', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          var sq = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
          sq.createIndex('ts', 'ts');
        }
      };
    });
  }

  function _put(store, item) {
    return _openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx  = db.transaction(store, 'readwrite');
        var req = tx.objectStore(store).put(item);
        req.onsuccess = function() { resolve(req.result); };
        req.onerror   = function() { reject(req.error); };
      });
    });
  }

  function _getAll(store) {
    return _openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx  = db.transaction(store, 'readonly');
        var req = tx.objectStore(store).getAll();
        req.onsuccess = function() { resolve(req.result || []); };
        req.onerror   = function() { reject(req.error); };
      });
    });
  }

  function _delete(store, key) {
    return _openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx  = db.transaction(store, 'readwrite');
        var req = tx.objectStore(store).delete(key);
        req.onsuccess = function() { resolve(); };
        req.onerror   = function() { reject(req.error); };
      });
    });
  }

  function _get(store, key) {
    return _openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx  = db.transaction(store, 'readonly');
        var req = tx.objectStore(store).get(key);
        req.onsuccess = function() { resolve(req.result || null); };
        req.onerror   = function() { reject(req.error); };
      });
    });
  }

  /* ── Banner helpers ──────────────────────────────────── */
  function _ensureBanners() {
    if (_bannerEl) return;

    /* Offline banner */
    _bannerEl              = document.createElement('div');
    _bannerEl.id           = 'cs-offline-banner';
    _bannerEl.setAttribute('role', 'alert');
    _bannerEl.setAttribute('aria-live', 'assertive');
    _bannerEl.setAttribute('aria-atomic', 'true');
    _bannerEl.style.cssText = [
      'position:fixed;top:0;left:0;right:0;z-index:10001;',
      'background:linear-gradient(90deg,#1e1b4b,#312e81);',
      'color:#e0e7ff;font-family:inherit;font-size:13px;font-weight:600;',
      'padding:10px 20px;display:none;',
      'flex-direction:column;gap:2px;',
      'border-bottom:2px solid #6366f1;',
    ].join('');
    document.body.appendChild(_bannerEl);

    /* Sync banner */
    _syncEl              = document.createElement('div');
    _syncEl.id           = 'cs-sync-banner';
    _syncEl.setAttribute('role', 'status');
    _syncEl.setAttribute('aria-live', 'polite');
    _syncEl.style.cssText = [
      'position:fixed;top:0;left:0;right:0;z-index:10002;',
      'background:linear-gradient(90deg,#064e3b,#065f46);',
      'color:#d1fae5;font-family:inherit;font-size:13px;font-weight:600;',
      'padding:10px 20px;display:none;align-items:center;gap:10px;',
      'border-bottom:2px solid #34d399;',
    ].join('');
    document.body.appendChild(_syncEl);
  }

  function _showOfflineBanner() {
    _ensureBanners();
    var t = _lang.t.bind(_lang);
    _bannerEl.style.display = 'flex';
    _bannerEl.innerHTML =
      '<span style="font-size:16px;margin-right:6px;" aria-hidden="true">📡</span>' +
      '<span>' + t('offline_banner') + '</span>' +
      '<span style="font-size:11px;opacity:0.8;margin-top:1px;">' + t('offline_banner_sub') + '</span>';
    /* Push page content down so banner doesn't overlap nav */
    document.body.style.marginTop = '52px';
  }

  function _hideOfflineBanner() {
    if (!_bannerEl) return;
    _bannerEl.style.display = 'none';
    document.body.style.marginTop = '';
  }

  function _showSyncBanner() {
    _ensureBanners();
    _syncEl.style.display = 'flex';
    _syncEl.innerHTML =
      '<span aria-hidden="true" style="animation:spin 1s linear infinite;display:inline-block;">🔄</span>' +
      '<span>' + _lang.t('offline_sync_banner') + '</span>';
    /* Add spin keyframes once */
    if (!document.getElementById('cs-spin-style')) {
      var s = document.createElement('style');
      s.id = 'cs-spin-style';
      s.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }
  }

  function _hideSyncBanner(success) {
    if (!_syncEl) return;
    if (success) {
      _syncEl.innerHTML = '<span>✅ ' + _lang.t('offline_sync_done') + '</span>';
      setTimeout(function() { _syncEl.style.display = 'none'; }, 3000);
    } else {
      _syncEl.style.display = 'none';
    }
  }

  /* ── SW messaging helper ─────────────────────────────── */
  function _swMessage(msg) {
    return new Promise(function(resolve) {
      if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
        resolve({ ok: false, error: 'SW not active' });
        return;
      }
      var channel = new MessageChannel();
      channel.port1.onmessage = function(e) { resolve(e.data); };
      navigator.serviceWorker.controller.postMessage(msg, [channel.port2]);
    });
  }

  /* ── Public API ──────────────────────────────────────── */
  return {

    isOnline: function() { return navigator.onLine; },

    /* Save book/article text for offline reading */
    saveDownload: function(book) {
      if (!book || !book.id) return Promise.reject(new Error('Missing id'));
      var item = {
        id:          book.id,
        title:       book.title       || 'Untitled',
        text:        book.text        || book.extract || '',
        author:      book.author      || '',
        source:      book.source      || 'unknown',
        legalStatus: book.legalStatus || 'unknown',
        savedAt:     Date.now(),
        size:        ((book.text || book.extract || '').length),
      };
      return _put('downloads', item);
    },

    getDownloads: function() {
      return _getAll('downloads').catch(function() { return []; });
    },

    removeDownload: function(id) {
      return _delete('downloads', id);
    },

    isDownloaded: function(id) {
      return _get('downloads', id).then(function(item) { return !!item; }).catch(function() { return false; });
    },

    /* OCR cache */
    saveOCR: function(text, title) {
      var item = {
        id:      'ocr-' + Date.now(),
        title:   title || 'OCR Scan',
        text:    text  || '',
        savedAt: Date.now(),
        size:    (text || '').length,
      };
      return _put('ocr_cache', item);
    },

    getOCRCache: function() {
      return _getAll('ocr_cache').catch(function() { return []; });
    },

    removeOCR: function(id) {
      return _delete('ocr_cache', id);
    },

    /* AI response cache — used for offline AI Teacher fallback */
    saveAIResponse: function(promptKey, response) {
      return _put('ai_cache', {
        key:      promptKey || ('ai-' + Date.now()),
        prompt:   promptKey || '',
        response: response  || '',
        savedAt:  Date.now(),
      });
    },

    getCachedAIResponse: function(promptKey) {
      return _get('ai_cache', promptKey).then(function(item) {
        return item ? item.response : null;
      }).catch(function() { return null; });
    },

    getAICache: function() {
      return _getAll('ai_cache').catch(function() { return []; });
    },

    removeAICache: function(key) {
      return _delete('ai_cache', key);
    },

    /* Sync queue */
    addToSyncQueue: function(type, data) {
      return _put('sync_queue', { type: type, data: data, ts: Date.now() });
    },

    getSyncQueue: function() {
      return _getAll('sync_queue').catch(function() { return []; });
    },

    clearSyncQueue: function() {
      return _openDB().then(function(db) {
        return new Promise(function(resolve, reject) {
          var tx  = db.transaction('sync_queue', 'readwrite');
          var req = tx.objectStore('sync_queue').clear();
          req.onsuccess = resolve;
          req.onerror   = function() { reject(req.error); };
        });
      });
    },

    /* Trigger sync of queued items when back online */
    processSyncQueue: function() {
      var self = this;
      _showSyncBanner();
      return self.getSyncQueue().then(function(items) {
        if (!items.length) {
          _hideSyncBanner(true);
          localStorage.setItem('cs_last_sync', Date.now().toString());
          return;
        }
        /* Prototype: log to console; real implementation would POST to backend */
        console.log('[CS.offline] Sync queue processed:', items.length, 'items');
        localStorage.setItem('cs_last_sync',        Date.now().toString());
        localStorage.setItem('cs_pending_sync_count', '0');
        _toast(_lang.t('offline_sync_done'), 'success');
        _hideSyncBanner(true);
        /* Background Sync API fallback registration */
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready.then(function(reg) {
            if (reg.sync) return reg.sync.register('cs-progress-sync').catch(function(){});
          }).catch(function(){});
        }
        return self.clearSyncQueue();
      }).catch(function() {
        _hideSyncBanner(false);
      });
    },

    /* Storage estimate */
    getStorageInfo: function() {
      if (navigator.storage && navigator.storage.estimate) {
        return navigator.storage.estimate().then(function(est) {
          var used  = est.usage  || 0;
          var quota = est.quota  || 0;
          return {
            used:  used,
            quota: quota,
            free:  quota - used,
            pct:   quota > 0 ? Math.round((used / quota) * 100) : 0,
            usedMB:  (used  / 1048576).toFixed(1),
            quotaMB: (quota / 1048576).toFixed(1),
            freeMB:  ((quota - used) / 1048576).toFixed(1),
          };
        });
      }
      /* Fallback: estimate from localStorage size */
      var lsSize = 0;
      for (var k in localStorage) {
        if (localStorage.hasOwnProperty(k)) lsSize += localStorage[k].length * 2;
      }
      return Promise.resolve({
        used: lsSize, quota: 5242880, free: 5242880 - lsSize,
        pct: Math.round((lsSize / 5242880) * 100),
        usedMB: (lsSize / 1048576).toFixed(2),
        quotaMB: '5.0',
        freeMB: ((5242880 - lsSize) / 1048576).toFixed(2),
      });
    },

    /* Notes, bookmarks, quizzes from localStorage */
    getNotes: function() {
      try { return JSON.parse(localStorage.getItem('cs_notes') || '[]'); } catch(e) { return []; }
    },

    getBookmarks: function() {
      try { return JSON.parse(localStorage.getItem('cs_bookmarks') || '[]'); } catch(e) { return []; }
    },

    getQuizHistory: function() {
      try { return JSON.parse(localStorage.getItem('cs_quiz_history') || '[]'); } catch(e) { return []; }
    },

    getHighlights: function() {
      try { return JSON.parse(localStorage.getItem('cs_highlights') || '[]'); } catch(e) { return []; }
    },

    /* Init: detect online/offline and wire up banners + sync */
    init: function() {
      var self = this;
      _ensureBanners();

      /* SW message listener for SYNC_STARTED */
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', function(e) {
          if (e.data && e.data.type === 'SYNC_STARTED') {
            _showSyncBanner();
          }
        });
      }

      /* Initial state */
      _wasOnline = navigator.onLine;
      if (!navigator.onLine) _showOfflineBanner();

      /* Listen for changes */
      window.addEventListener('online', function() {
        _hideOfflineBanner();
        if (_wasOnline === false) {
          /* Just came back online — process sync queue */
          setTimeout(function() { self.processSyncQueue(); }, 800);
        }
        _wasOnline = true;
        window.dispatchEvent(new CustomEvent('cs:online'));
      });

      window.addEventListener('offline', function() {
        _showOfflineBanner();
        _wasOnline = false;
        window.dispatchEvent(new CustomEvent('cs:offline'));
      });

      /* Patch CS.gemini to fall back to cache when offline */
      var origGenerate = window.CS && window.CS.gemini && window.CS.gemini._generate;
      if (origGenerate) {
        window.CS.gemini._generateOfflineAware = function(prompt, opts) {
          if (!navigator.onLine) {
            var cacheKey = prompt.substring(0, 120);
            return self.getCachedAIResponse(cacheKey).then(function(cached) {
              if (cached) {
                return '\n\n' + _lang.t('offline_ai_fallback') + '\n\n' + cached;
              }
              return _lang.t('offline_no_ai');
            });
          }
          return origGenerate.call(window.CS.gemini, prompt, opts).then(function(response) {
            /* Cache successful AI responses for offline replay */
            var cacheKey = prompt.substring(0, 120);
            self.saveAIResponse(cacheKey, response).catch(function(){});
            return response;
          });
        };
      }

      /* Register Background Sync for periodic progress saves */
      if (navigator.serviceWorker && navigator.serviceWorker.ready && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(function(reg) {
          reg.sync.register('cs-progress-sync').catch(function(){});
        }).catch(function(){});
      }

      /* Auto-add reading progress to sync queue every 5 minutes */
      setInterval(function() {
        try {
          var sessions = JSON.parse(localStorage.getItem('cs_sessions') || '[]');
          if (sessions.length > 0) {
            self.addToSyncQueue('reading_progress', {
              sessions: sessions.slice(-10),
              ts: Date.now(),
            }).catch(function(){});
            var pending = parseInt(localStorage.getItem('cs_pending_sync_count') || '0');
            localStorage.setItem('cs_pending_sync_count', String(pending + 1));
          }
        } catch(e) {}
      }, 300000);
    },
  };

})();
