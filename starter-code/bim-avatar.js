/**
 * BIM Avatar — Sign Language Animated Avatar Module
 * CelikSense AI — Bahasa Isyarat Malaysia (BIM) Visual Avatar
 * Animated stick-figure humanoid using inline SVG + CSS keyframes
 */

window.BIM_AVATAR = (function () {
  'use strict';

  // ─── Word Simplifier Dictionary ───────────────────────────────────────────
  const WORD_MAP = {
    requires: 'needs',
    sufficient: 'enough',
    illumination: 'light',
    photosynthesis: 'plant makes food from sunlight',
    comprehension: 'understand',
    vocabulary: 'words',
    demonstrate: 'show',
    utilise: 'use',
    utilize: 'use',
    approximately: 'about',
    additional: 'more',
    assistance: 'help',
    communicate: 'talk',
    communication: 'talking',
    understand: 'know',
    understanding: 'knowing',
    information: 'facts',
    important: 'big',
    difficult: 'hard',
    beautiful: 'nice',
    immediately: 'now',
    purchase: 'buy',
    obtain: 'get',
    receive: 'get',
    construct: 'build',
    observe: 'see',
    examine: 'look',
    conclude: 'end',
    conclusion: 'end',
    introduction: 'start',
    participate: 'join',
    necessary: 'need',
    provide: 'give',
    request: 'ask',
    respond: 'answer',
    response: 'answer',
    regarding: 'about',
    because: 'why',
    therefore: 'so',
    however: 'but',
    although: 'but',
    furthermore: 'also',
    subsequently: 'then',
    previously: 'before',
    currently: 'now',
    enormous: 'big',
    minuscule: 'small',
    frequently: 'often',
    occasionally: 'sometimes',
    accomplish: 'do',
    achievement: 'win',
    encourage: 'help',
    environment: 'place',
    experience: 'learn',
    explanation: 'tell why',
    favourite: 'like most',
    generate: 'make',
    identify: 'find',
    implement: 'do',
    indicate: 'show',
    involve: 'include',
    knowledge: 'know',
    language: 'words',
    location: 'place',
    material: 'thing',
    mention: 'say',
    method: 'way',
    opportunity: 'chance',
    permission: 'allow',
    position: 'place',
    practice: 'do again',
    process: 'steps',
    produce: 'make',
    purpose: 'why',
    question: 'ask',
    remember: 'know',
    represent: 'show',
    situation: 'time',
    solution: 'fix',
    structure: 'build',
    suggest: 'say',
    support: 'help',
    technology: 'tools',
    various: 'many',
  };

  // ─── Pose Definitions ─────────────────────────────────────────────────────
  // Each pose maps body-part IDs to transform/attribute changes
  const POSES = {
    neutral: {
      label: 'Neutral',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 100 160' },
      rightArm: { d: 'M 170 120 L 200 160' },
      leftHand: { cx: 100, cy: 162 },
      rightHand: { cx: 200, cy: 162 },
      face: 'neutral',
    },
    hello: {
      label: 'Hello',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 100 160' },
      rightArm: { d: 'M 170 120 L 210 75' },
      leftHand: { cx: 100, cy: 162 },
      rightHand: { cx: 210, cy: 73 },
      face: 'happy',
    },
    yes: {
      label: 'Yes',
      head: { cy: 65, cx: 150 },
      leftArm: { d: 'M 130 120 L 100 160' },
      rightArm: { d: 'M 170 120 L 200 160' },
      leftHand: { cx: 100, cy: 162 },
      rightHand: { cx: 200, cy: 162 },
      face: 'happy',
    },
    no: {
      label: 'No',
      head: { cy: 60, cx: 155 },
      leftArm: { d: 'M 130 120 L 100 160' },
      rightArm: { d: 'M 170 120 L 200 160' },
      leftHand: { cx: 100, cy: 162 },
      rightHand: { cx: 200, cy: 162 },
      face: 'sad',
    },
    stop: {
      label: 'Stop',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 95 85' },
      rightArm: { d: 'M 170 120 L 205 85' },
      leftHand: { cx: 93, cy: 83 },
      rightHand: { cx: 207, cy: 83 },
      face: 'serious',
    },
    book: {
      label: 'Book',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 115 145' },
      rightArm: { d: 'M 170 120 L 185 145' },
      leftHand: { cx: 113, cy: 147 },
      rightHand: { cx: 187, cy: 147 },
      face: 'neutral',
    },
    read: {
      label: 'Read',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 110 150' },
      rightArm: { d: 'M 170 120 L 190 130' },
      leftHand: { cx: 108, cy: 152 },
      rightHand: { cx: 192, cy: 128 },
      face: 'thinking',
    },
    understand: {
      label: 'Understand',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 100 160' },
      rightArm: { d: 'M 170 120 L 162 72' },
      leftHand: { cx: 100, cy: 162 },
      rightHand: { cx: 161, cy: 70 },
      face: 'thinking',
    },
    question: {
      label: 'Question',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 95 90' },
      rightArm: { d: 'M 170 120 L 205 90' },
      leftHand: { cx: 93, cy: 88 },
      rightHand: { cx: 207, cy: 88 },
      face: 'questioning',
    },
    good: {
      label: 'Good',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 100 160' },
      rightArm: { d: 'M 170 120 L 205 100' },
      leftHand: { cx: 100, cy: 162 },
      rightHand: { cx: 207, cy: 98 },
      face: 'happy',
    },
    learn: {
      label: 'Learn',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 100 160' },
      rightArm: { d: 'M 170 120 L 158 68' },
      leftHand: { cx: 100, cy: 162 },
      rightHand: { cx: 157, cy: 66 },
      face: 'thinking',
    },
    word: {
      label: 'Word',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 105 135' },
      rightArm: { d: 'M 170 120 L 195 135' },
      leftHand: { cx: 103, cy: 137 },
      rightHand: { cx: 197, cy: 137 },
      face: 'neutral',
    },
    sentence: {
      label: 'Sentence',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 90 120' },
      rightArm: { d: 'M 170 120 L 210 120' },
      leftHand: { cx: 88, cy: 120 },
      rightHand: { cx: 212, cy: 120 },
      face: 'neutral',
    },
    signing: {
      label: 'Signing',
      head: { cy: 60, cx: 150 },
      leftArm: { d: 'M 130 120 L 105 100' },
      rightArm: { d: 'M 170 120 L 195 100' },
      leftHand: { cx: 103, cy: 98 },
      rightHand: { cx: 197, cy: 98 },
      face: 'happy',
    },
  };

  // ─── Face Expression SVG Fragments ────────────────────────────────────────
  const FACE_EXPRESSIONS = {
    neutral: `
      <line data-role="lbrow" x1="136" y1="52" x2="146" y2="52" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <line data-role="rbrow" x1="154" y1="52" x2="164" y2="52" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <circle data-role="leye" cx="141" cy="58" r="3" fill="#1e1b4b"/>
      <circle data-role="reye" cx="159" cy="58" r="3" fill="#1e1b4b"/>
      <path data-role="mouth" d="M 142 67 Q 150 70 158 67" stroke="#92400e" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    happy: `
      <line data-role="lbrow" x1="136" y1="50" x2="146" y2="53" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <line data-role="rbrow" x1="154" y1="53" x2="164" y2="50" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <circle data-role="leye" cx="141" cy="58" r="3" fill="#1e1b4b"/>
      <circle data-role="reye" cx="159" cy="58" r="3" fill="#1e1b4b"/>
      <path data-role="mouth" d="M 142 65 Q 150 72 158 65" stroke="#92400e" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    sad: `
      <line data-role="lbrow" x1="136" y1="54" x2="146" y2="51" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <line data-role="rbrow" x1="154" y1="51" x2="164" y2="54" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <circle data-role="leye" cx="141" cy="58" r="3" fill="#1e1b4b"/>
      <circle data-role="reye" cx="159" cy="58" r="3" fill="#1e1b4b"/>
      <path data-role="mouth" d="M 142 70 Q 150 64 158 70" stroke="#92400e" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    serious: `
      <line data-role="lbrow" x1="136" y1="53" x2="146" y2="55" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
      <line data-role="rbrow" x1="154" y1="55" x2="164" y2="53" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
      <circle data-role="leye" cx="141" cy="59" r="3" fill="#1e1b4b"/>
      <circle data-role="reye" cx="159" cy="59" r="3" fill="#1e1b4b"/>
      <line data-role="mouth" x1="143" y1="67" x2="157" y2="67" stroke="#92400e" stroke-width="2" stroke-linecap="round"/>`,
    thinking: `
      <line data-role="lbrow" x1="136" y1="51" x2="146" y2="53" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <line data-role="rbrow" x1="154" y1="50" x2="164" y2="52" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <circle data-role="leye" cx="141" cy="58" r="3" fill="#1e1b4b"/>
      <circle data-role="reye" cx="159" cy="58" r="2.5" fill="#1e1b4b"/>
      <path data-role="mouth" d="M 144 67 Q 152 69 157 66" stroke="#92400e" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    questioning: `
      <path data-role="lbrow" d="M 136 53 Q 141 49 146 52" stroke="#78350f" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path data-role="rbrow" d="M 154 52 Q 159 49 164 53" stroke="#78350f" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle data-role="leye" cx="141" cy="58" r="3.5" fill="#1e1b4b"/>
      <circle data-role="reye" cx="159" cy="58" r="3.5" fill="#1e1b4b"/>
      <path data-role="mouth" d="M 143 66 Q 150 70 157 66" stroke="#92400e" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  };

  // ─── CSS Keyframes & Styles ────────────────────────────────────────────────
  const CSS_STYLES = `
    @keyframes bim-wave {
      0%   { transform: rotate(0deg); transform-origin: 170px 120px; }
      25%  { transform: rotate(-20deg); transform-origin: 170px 120px; }
      75%  { transform: rotate(20deg); transform-origin: 170px 120px; }
      100% { transform: rotate(0deg); transform-origin: 170px 120px; }
    }
    @keyframes bim-nod {
      0%   { transform: translateY(0px); }
      30%  { transform: translateY(6px); }
      60%  { transform: translateY(-2px); }
      100% { transform: translateY(0px); }
    }
    @keyframes bim-shake {
      0%   { transform: translateX(0px); }
      25%  { transform: translateX(-8px); }
      75%  { transform: translateX(8px); }
      100% { transform: translateX(0px); }
    }
    @keyframes bim-pulse {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
    @keyframes bim-float {
      0%   { transform: translateY(0px); }
      50%  { transform: translateY(-4px); }
      100% { transform: translateY(0px); }
    }
    @keyframes bim-handwave {
      0%   { transform: rotate(0deg); }
      20%  { transform: rotate(25deg); }
      40%  { transform: rotate(-15deg); }
      60%  { transform: rotate(25deg); }
      80%  { transform: rotate(-10deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes bim-signing-left {
      0%   { transform: translate(0, 0); }
      33%  { transform: translate(-8px, -6px); }
      66%  { transform: translate(4px, -10px); }
      100% { transform: translate(0, 0); }
    }
    @keyframes bim-signing-right {
      0%   { transform: translate(0, 0); }
      33%  { transform: translate(8px, -10px); }
      66%  { transform: translate(-4px, -6px); }
      100% { transform: translate(0, 0); }
    }
    @keyframes bim-read-trace {
      0%   { transform: translateX(-10px); }
      50%  { transform: translateX(10px); }
      100% { transform: translateX(-10px); }
    }
    @keyframes bim-understand-tap {
      0%   { transform: translate(0, 0); }
      40%  { transform: translate(-8px, -6px); }
      60%  { transform: translate(-10px, -8px); }
      100% { transform: translate(0, 0); }
    }
    @keyframes bim-sentence-sweep {
      0%   { transform: translateX(-12px); }
      50%  { transform: translateX(12px); }
      100% { transform: translateX(-12px); }
    }
    .bim-pose-hello #bim-right-arm { animation: bim-wave 0.8s ease-in-out infinite; }
    .bim-pose-hello #bim-right-hand { animation: bim-handwave 0.8s ease-in-out infinite; }
    .bim-pose-yes #bim-head-group { animation: bim-nod 0.7s ease-in-out 2; }
    .bim-pose-no #bim-head-group { animation: bim-shake 0.6s ease-in-out 2; }
    .bim-pose-signing #bim-left-hand { animation: bim-signing-left 0.9s ease-in-out infinite; }
    .bim-pose-signing #bim-right-hand { animation: bim-signing-right 0.9s ease-in-out infinite; }
    .bim-pose-signing #bim-left-arm { animation: bim-signing-left 0.9s ease-in-out infinite; }
    .bim-pose-signing #bim-right-arm { animation: bim-signing-right 0.9s ease-in-out infinite; }
    .bim-pose-read #bim-right-hand { animation: bim-read-trace 1s ease-in-out infinite; }
    .bim-pose-understand #bim-right-hand { animation: bim-understand-tap 0.8s ease-in-out 2; }
    .bim-pose-understand #bim-right-arm { animation: bim-understand-tap 0.8s ease-in-out 2; }
    .bim-pose-sentence #bim-left-hand { animation: bim-sentence-sweep 1s ease-in-out infinite; }
    .bim-pose-sentence #bim-right-hand { animation: bim-sentence-sweep 1s ease-in-out infinite reverse; }
    .bim-pose-sentence #bim-left-arm { animation: bim-sentence-sweep 1s ease-in-out infinite; }
    .bim-pose-sentence #bim-right-arm { animation: bim-sentence-sweep 1s ease-in-out infinite reverse; }
    .bim-pose-good #bim-right-hand { animation: bim-pulse 0.6s ease-in-out 2; }
    .bim-pose-learn #bim-right-hand { animation: bim-understand-tap 0.9s ease-in-out 2; }
    .bim-pose-learn #bim-right-arm { animation: bim-understand-tap 0.9s ease-in-out 2; }
    .bim-pose-question #bim-avatar { animation: bim-float 1.2s ease-in-out infinite; }
    .bim-pose-stop #bim-left-hand { animation: bim-pulse 0.5s ease-in-out infinite; }
    .bim-pose-stop #bim-right-hand { animation: bim-pulse 0.5s ease-in-out infinite; }
    .bim-avatar-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .bim-label {
      font-size: 13px;
      color: #6366f1;
      font-weight: 600;
      letter-spacing: 0.04em;
      min-height: 20px;
    }
    .bim-sentence-text {
      font-size: 12px;
      color: #7c3aed;
      text-align: center;
      max-width: 220px;
      line-height: 1.4;
      min-height: 34px;
      background: #f5f3ff;
      border-radius: 8px;
      padding: 4px 10px;
    }
    .bim-keywords {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      justify-content: center;
      min-height: 22px;
    }
    .bim-kw-badge {
      background: #ede9fe;
      color: #5b21b6;
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
    }
    .bim-controls {
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .bim-btn {
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .bim-btn:hover { background: #4f46e5; }
    .bim-btn:disabled { background: #a5b4fc; cursor: default; }
    .bim-progress {
      font-size: 11px;
      color: #6366f1;
      opacity: 0.7;
    }
    #bim-avatar svg {
      transition: all 0.35s cubic-bezier(.4,0,.2,1);
      overflow: visible;
    }
    #bim-left-arm, #bim-right-arm {
      transition: d 0.4s cubic-bezier(.4,0,.2,1),
                  stroke 0.3s;
      stroke-linecap: round;
    }
    #bim-left-hand, #bim-right-hand {
      transition: cx 0.4s cubic-bezier(.4,0,.2,1),
                  cy 0.4s cubic-bezier(.4,0,.2,1);
    }
    #bim-head {
      transition: cy 0.35s cubic-bezier(.4,0,.2,1),
                  cx 0.35s cubic-bezier(.4,0,.2,1);
    }
    #bim-face-expr {
      transition: opacity 0.2s;
    }
  `;

  // ─── State ─────────────────────────────────────────────────────────────────
  let _container = null;
  let _svgRoot = null;
  let _faceGroup = null;
  let _poseWrapper = null;
  let _labelEl = null;
  let _sentenceEl = null;
  let _keywordsEl = null;
  let _progressEl = null;

  let _sentences = [];
  let _currentIdx = 0;
  let _playing = false;
  let _paused = false;
  let _speedMultiplier = 1;
  let _currentPose = 'neutral';
  let _signTimer = null;
  let _onSentenceChangeCb = null;
  let _onCompleteCb = null;

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function _injectStyles() {
    if (document.getElementById('bim-avatar-styles')) return;
    const style = document.createElement('style');
    style.id = 'bim-avatar-styles';
    style.textContent = CSS_STYLES;
    document.head.appendChild(style);
  }

  function _buildSVG() {
    return `
<svg id="bim-svg" viewBox="0 0 300 260" width="180" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BIM Sign Language Avatar">
  <defs>
    <radialGradient id="bim-bg-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ede9fe"/>
      <stop offset="100%" stop-color="#f5f3ff"/>
    </radialGradient>
    <radialGradient id="bim-skin-grad" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </radialGradient>
    <radialGradient id="bim-body-grad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </radialGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="150" cy="130" r="115" fill="url(#bim-bg-grad)" opacity="0.7"/>

  <!-- Avatar group (float target) -->
  <g id="bim-avatar">

    <!-- Torso -->
    <rect id="bim-torso" x="120" y="100" width="60" height="70" rx="12" ry="12"
          fill="url(#bim-body-grad)" stroke="#4338ca" stroke-width="2"/>

    <!-- Left leg -->
    <line x1="135" y1="170" x2="125" y2="220" stroke="#4338ca" stroke-width="8"
          stroke-linecap="round"/>
    <!-- Right leg -->
    <line x1="165" y1="170" x2="175" y2="220" stroke="#4338ca" stroke-width="8"
          stroke-linecap="round"/>
    <!-- Left foot -->
    <ellipse cx="121" cy="222" rx="10" ry="5" fill="#4338ca"/>
    <!-- Right foot -->
    <ellipse cx="179" cy="222" rx="10" ry="5" fill="#4338ca"/>

    <!-- Neck -->
    <rect x="143" y="87" width="14" height="16" rx="5" fill="#fbbf24"/>

    <!-- Left arm -->
    <path id="bim-left-arm" d="M 120 120 L 90 160"
          stroke="#4338ca" stroke-width="8" stroke-linecap="round" fill="none"/>
    <!-- Right arm -->
    <path id="bim-right-arm" d="M 180 120 L 210 160"
          stroke="#4338ca" stroke-width="8" stroke-linecap="round" fill="none"/>

    <!-- Left hand -->
    <circle id="bim-left-hand" cx="88" cy="162" r="9"
            fill="url(#bim-skin-grad)" stroke="#d97706" stroke-width="1.5"/>
    <!-- Right hand -->
    <circle id="bim-right-hand" cx="212" cy="162" r="9"
            fill="url(#bim-skin-grad)" stroke="#d97706" stroke-width="1.5"/>

    <!-- Head group (nod/shake target) -->
    <g id="bim-head-group">
      <!-- Head -->
      <circle id="bim-head" cx="150" cy="60" r="32"
              fill="url(#bim-skin-grad)" stroke="#d97706" stroke-width="2"/>
      <!-- Hair -->
      <path d="M 118 54 Q 120 28 150 25 Q 180 28 182 54 Q 175 38 150 36 Q 125 38 118 54 Z"
            fill="#92400e" opacity="0.85"/>
      <!-- Face expression group -->
      <g id="bim-face-expr">
        <line data-role="lbrow" x1="136" y1="52" x2="146" y2="52"
              stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
        <line data-role="rbrow" x1="154" y1="52" x2="164" y2="52"
              stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
        <circle data-role="leye" cx="141" cy="58" r="3" fill="#1e1b4b"/>
        <circle data-role="reye" cx="159" cy="58" r="3" fill="#1e1b4b"/>
        <path data-role="mouth" d="M 142 67 Q 150 70 158 67"
              stroke="#92400e" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
    </g>
  </g>
</svg>`;
  }

  function _buildHTML() {
    return `
<div class="bim-avatar-wrap">
  <div class="bim-label" id="bim-pose-label">BIM Avatar</div>
  <div id="bim-avatar">${_buildSVG()}</div>
  <div class="bim-sentence-text" id="bim-sentence-display"></div>
  <div class="bim-keywords" id="bim-keywords-display"></div>
  <div class="bim-progress" id="bim-progress-display"></div>
  <div class="bim-controls">
    <button class="bim-btn" id="bim-btn-prev" title="Previous sentence">&#8592;</button>
    <button class="bim-btn" id="bim-btn-pause" title="Pause/Resume">&#10074;&#10074;</button>
    <button class="bim-btn" id="bim-btn-next" title="Next sentence">&#8594;</button>
    <button class="bim-btn" id="bim-btn-repeat" title="Repeat">&#8635;</button>
    <button class="bim-btn" id="bim-btn-stop" title="Stop">&#9632;</button>
  </div>
</div>`;
  }

  function _setFaceExpression(type) {
    const faceGroup = document.getElementById('bim-face-expr');
    if (!faceGroup) return;
    const expr = FACE_EXPRESSIONS[type] || FACE_EXPRESSIONS['neutral'];
    faceGroup.innerHTML = expr;
  }

  function _applyPoseToSVG(poseKey) {
    const pose = POSES[poseKey];
    if (!pose) return;

    const leftArm = document.getElementById('bim-left-arm');
    const rightArm = document.getElementById('bim-right-arm');
    const leftHand = document.getElementById('bim-left-hand');
    const rightHand = document.getElementById('bim-right-hand');
    const head = document.getElementById('bim-head');

    if (leftArm && pose.leftArm) leftArm.setAttribute('d', pose.leftArm.d);
    if (rightArm && pose.rightArm) rightArm.setAttribute('d', pose.rightArm.d);
    if (leftHand && pose.leftHand) {
      leftHand.setAttribute('cx', pose.leftHand.cx);
      leftHand.setAttribute('cy', pose.leftHand.cy);
    }
    if (rightHand && pose.rightHand) {
      rightHand.setAttribute('cx', pose.rightHand.cx);
      rightHand.setAttribute('cy', pose.rightHand.cy);
    }
    if (head && pose.head) {
      head.setAttribute('cy', pose.head.cy);
      head.setAttribute('cx', pose.head.cx);
    }
    _setFaceExpression(pose.face || 'neutral');

    // Update label
    const labelEl = document.getElementById('bim-pose-label');
    if (labelEl) labelEl.textContent = pose.label || poseKey;
  }

  function _setPoseClass(poseKey) {
    const avatarDiv = document.getElementById('bim-avatar');
    if (!avatarDiv) return;
    // Remove all pose classes
    const classes = Array.from(avatarDiv.classList).filter(c => c.startsWith('bim-pose-'));
    classes.forEach(c => avatarDiv.classList.remove(c));
    if (poseKey !== 'neutral') {
      avatarDiv.classList.add('bim-pose-' + poseKey);
    }
    _currentPose = poseKey;
  }

  // ─── Sentence Processor ───────────────────────────────────────────────────
  function _simplifyWord(word) {
    const lower = word.toLowerCase().replace(/[^a-z]/g, '');
    return WORD_MAP[lower] !== undefined ? WORD_MAP[lower] : word;
  }

  function _simplifyText(text) {
    const words = text.split(/\s+/);
    const simplified = words.map(_simplifyWord).join(' ');
    // Limit to 8 words
    const resultWords = simplified.split(/\s+/);
    if (resultWords.length > 8) {
      return resultWords.slice(0, 8).join(' ') + '...';
    }
    return simplified;
  }

  function _extractKeywords(text) {
    const stopWords = new Set(['a','an','the','is','are','was','were','be','been',
      'being','have','has','had','do','does','did','will','would','could','should',
      'may','might','shall','can','to','of','in','for','on','with','at','by','from',
      'as','into','through','that','this','these','those','it','its','we','they',
      'you','he','she','and','or','but','so','if','then','than','when','where',
      'how','what','who','which','not','no','more','also']);
    const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    const keywords = words
      .filter(w => w.length > 3 && !stopWords.has(w))
      .slice(0, 3);
    return keywords;
  }

  function _generateMeaning(text, keywords) {
    if (keywords.length === 0) return text;
    const templates = [
      `Think: ${keywords.slice(0, 2).join(' + ')}`,
      `Picture: ${keywords[0]}`,
      `Key idea: ${keywords.join(', ')}`,
    ];
    return templates[Math.min(keywords.length - 1, 2)];
  }

  function _processSentences(text) {
    const raw = text
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return raw.map(sentence => {
      const simplified = _simplifyText(sentence);
      const keywords = _extractKeywords(simplified);
      const meaning = _generateMeaning(simplified, keywords);

      // Determine sign sequence from keywords + sentence structure
      const signs = _pickSignsForSentence(sentence, keywords);

      return { original: sentence, simplified, keywords, meaning, signs };
    });
  }

  function _pickSignsForSentence(sentence, keywords) {
    const lower = sentence.toLowerCase();
    const signs = ['signing'];

    if (/\?/.test(sentence)) signs.push('question');
    if (/\b(hello|hi|greet)/i.test(lower)) signs.push('hello');
    if (/\b(yes|correct|right|true)/i.test(lower)) signs.push('yes');
    if (/\b(no|not|never|wrong)/i.test(lower)) signs.push('no');
    if (/\b(stop|halt|pause|wait)/i.test(lower)) signs.push('stop');
    if (/\b(book|read|text|page|chapter)/i.test(lower)) {
      signs.push('book');
      signs.push('read');
    }
    if (/\b(understand|comprehend|know|learn)/i.test(lower)) signs.push('understand');
    if (/\b(good|great|excellent|wonderful|nice)/i.test(lower)) signs.push('good');
    if (/\b(learn|study|education|school)/i.test(lower)) signs.push('learn');
    if (/\b(word|vocabulary|sign|language)/i.test(lower)) signs.push('word');
    if (/\b(sentence|phrase|paragraph)/i.test(lower)) signs.push('sentence');

    signs.push('neutral');
    return signs;
  }

  // ─── Sign Sequence Player ─────────────────────────────────────────────────
  function _playSignSequence(signs, baseDuration, onDone) {
    let i = 0;
    function next() {
      if (i >= signs.length) {
        if (typeof onDone === 'function') onDone();
        return;
      }
      const sign = signs[i++];
      _setPoseClass(sign);
      _applyPoseToSVG(sign);
      _signTimer = setTimeout(next, baseDuration / _speedMultiplier);
    }
    next();
  }

  function _playSentenceAt(idx, onDone) {
    if (idx < 0 || idx >= _sentences.length) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    const s = _sentences[idx];
    _currentIdx = idx;

    // Update UI
    const sentEl = document.getElementById('bim-sentence-display');
    if (sentEl) sentEl.textContent = s.simplified;

    const kwEl = document.getElementById('bim-keywords-display');
    if (kwEl) {
      kwEl.innerHTML = s.keywords
        .map(k => `<span class="bim-kw-badge">${k}</span>`)
        .join('');
    }

    const progEl = document.getElementById('bim-progress-display');
    if (progEl) progEl.textContent = `${idx + 1} / ${_sentences.length}`;

    if (typeof _onSentenceChangeCb === 'function') {
      _onSentenceChangeCb(idx, s);
    }

    _playSignSequence(s.signs, 900, onDone);
  }

  function _playAll(startIdx) {
    if (!_playing || _paused) return;
    if (startIdx >= _sentences.length) {
      _playing = false;
      _setPoseClass('neutral');
      _applyPoseToSVG('neutral');
      if (typeof _onCompleteCb === 'function') _onCompleteCb();
      return;
    }
    _playSentenceAt(startIdx, function () {
      if (!_playing || _paused) return;
      _playAll(startIdx + 1);
    });
  }

  // ─── Public API ───────────────────────────────────────────────────────────
  function init(containerId) {
    _injectStyles();
    _container = typeof containerId === 'string'
      ? document.getElementById(containerId)
      : containerId;
    if (!_container) {
      console.error('[BIM_AVATAR] Container not found:', containerId);
      return;
    }
    _container.innerHTML = _buildHTML();

    // Wire up control buttons
    const btnPause = document.getElementById('bim-btn-pause');
    const btnPrev = document.getElementById('bim-btn-prev');
    const btnNext = document.getElementById('bim-btn-next');
    const btnRepeat = document.getElementById('bim-btn-repeat');
    const btnStop = document.getElementById('bim-btn-stop');

    if (btnPause) btnPause.addEventListener('click', function () {
      if (_paused) { resume(); this.innerHTML = '&#10074;&#10074;'; }
      else         { pause();  this.innerHTML = '&#9654;'; }
    });
    if (btnPrev)   btnPrev.addEventListener('click', prevSentence);
    if (btnNext)   btnNext.addEventListener('click', nextSentence);
    if (btnRepeat) btnRepeat.addEventListener('click', repeat);
    if (btnStop)   btnStop.addEventListener('click', stop);

    // Initial neutral pose
    _applyPoseToSVG('neutral');
  }

  function showPose(poseName, duration) {
    const poseKey = poseName in POSES ? poseName : 'neutral';
    _setPoseClass(poseKey);
    _applyPoseToSVG(poseKey);
    if (duration && duration > 0) {
      setTimeout(function () {
        _setPoseClass('neutral');
        _applyPoseToSVG('neutral');
      }, duration);
    }
  }

  function signText(text, speed, onSentenceChange, onComplete) {
    stop();
    _sentences = _processSentences(text || '');
    _currentIdx = 0;
    _speedMultiplier = speed || 1;
    _onSentenceChangeCb = onSentenceChange || null;
    _onCompleteCb = onComplete || null;
    _playing = true;
    _paused = false;

    const btnPause = document.getElementById('bim-btn-pause');
    if (btnPause) btnPause.innerHTML = '&#10074;&#10074;';

    _playAll(0);
  }

  function pause() {
    if (!_playing) return;
    _paused = true;
    if (_signTimer) { clearTimeout(_signTimer); _signTimer = null; }
  }

  function resume() {
    if (!_paused) return;
    _paused = false;
    _playAll(_currentIdx);
  }

  function stop() {
    _playing = false;
    _paused = false;
    if (_signTimer) { clearTimeout(_signTimer); _signTimer = null; }
    _setPoseClass('neutral');
    _applyPoseToSVG('neutral');
    const sentEl = document.getElementById('bim-sentence-display');
    if (sentEl) sentEl.textContent = '';
    const kwEl = document.getElementById('bim-keywords-display');
    if (kwEl) kwEl.innerHTML = '';
    const progEl = document.getElementById('bim-progress-display');
    if (progEl) progEl.textContent = '';
  }

  function repeat() {
    if (_sentences.length === 0) return;
    _playing = true;
    _paused = false;
    const btnPause = document.getElementById('bim-btn-pause');
    if (btnPause) btnPause.innerHTML = '&#10074;&#10074;';
    _playAll(0);
  }

  function setSpeed(multiplier) {
    _speedMultiplier = Math.max(0.25, Math.min(4, multiplier || 1));
  }

  function getCurrentSentence() { return _currentIdx; }
  function getTotalSentences()   { return _sentences.length; }

  function nextSentence() {
    if (_currentIdx + 1 < _sentences.length) {
      pause();
      _playing = true;
      _paused = false;
      _playAll(_currentIdx + 1);
    }
  }

  function prevSentence() {
    if (_currentIdx > 0) {
      pause();
      _playing = true;
      _paused = false;
      _playAll(_currentIdx - 1);
    }
  }

  function isPlaying() { return _playing && !_paused; }

  // Expose helpers for advanced use
  function processText(text) { return _processSentences(text); }
  function simplifyWord(word) { return _simplifyWord(word); }

  // ─── Return Public API ────────────────────────────────────────────────────
  return {
    init,
    showPose,
    signText,
    pause,
    resume,
    stop,
    repeat,
    setSpeed,
    getCurrentSentence,
    getTotalSentences,
    nextSentence,
    prevSentence,
    isPlaying,
    processText,
    simplifyWord,
    POSES,
    WORD_MAP,
  };
})();
