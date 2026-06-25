/**
 * CelikSense AI – Personal Avatar Creator System
 * window.CS_AVATAR
 * Plain ES6, no build step required.
 */

(function () {
  'use strict';

  const AVATAR_KEY = 'cs_personal_avatar';
  const AVATAR_SETTINGS_KEY = 'cs_avatar_settings';

  const DEFAULT_AVATAR = {
    created: '',
    skinTone: '#F5CBA7',
    skinToneClass: 'light',
    hairColor: '#3D2B1F',
    eyeColor: '#634e34',
    hasGlasses: false,
    hasBeard: false,
    faceShape: 'oval',
    gender: 'neutral',
    hairstyleIndex: 0,
    expressionDefault: 'friendly',
    photoDataUrl: '',
    svgDataUrl: '',
    name: '',
    signSpeed: 1.0,
    preferredLang: 'en'
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => {
      const h = Math.max(0, Math.min(255, Math.round(v))).toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
  }

  function hexLighten(hex, amount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);
    return rgbToHex(r, g, b);
  }

  function hexDarken(hex, amount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);
    return rgbToHex(r, g, b);
  }

  function getSaturation(r, g, b) {
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    if (max === 0) return 0;
    return (max - min) / max;
  }

  // ─── Core API ───────────────────────────────────────────────────────────────

  const CS_AVATAR = {};

  CS_AVATAR.getAvatar = function () {
    try {
      const raw = localStorage.getItem(AVATAR_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  CS_AVATAR.saveAvatar = function (data) {
    try {
      localStorage.setItem(AVATAR_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('CS_AVATAR: could not save avatar', e);
    }
  };

  CS_AVATAR.hasAvatar = function () {
    return !!localStorage.getItem(AVATAR_KEY);
  };

  CS_AVATAR.deleteAvatar = function () {
    localStorage.removeItem(AVATAR_KEY);
    document.dispatchEvent(new CustomEvent('avatarDeleted'));
  };

  CS_AVATAR.analyseImageColors = function (imageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, 100, 100);

    // Skin tone – center face region rows 25-55, cols 25-75
    let sr = 0, sg = 0, sb = 0, scount = 0;
    for (let y = 25; y <= 55; y++) {
      for (let x = 25; x <= 75; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        sr += p[0]; sg += p[1]; sb += p[2]; scount++;
      }
    }
    sr /= scount; sg /= scount; sb /= scount;
    const lightness = (sr + sg + sb) / 3;
    let skinToneClass;
    if (lightness > 200) skinToneClass = 'light';
    else if (lightness >= 170) skinToneClass = 'medium';
    else if (lightness >= 130) skinToneClass = 'tan';
    else if (lightness >= 90) skinToneClass = 'dark';
    else skinToneClass = 'deep';
    const skinTone = rgbToHex(sr, sg, sb);

    // Hair – top region rows 0-20
    let hr = 0, hg = 0, hb = 0, hcount = 0;
    for (let y = 0; y <= 20; y++) {
      for (let x = 10; x <= 90; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        hr += p[0]; hg += p[1]; hb += p[2]; hcount++;
      }
    }
    hr /= hcount; hg /= hcount; hb /= hcount;
    const hairColor = rgbToHex(hr, hg, hb);

    // Eye – rows 30-45, cols 30-45 and 55-70
    let er = 0, eg = 0, eb = 0, ecount = 0;
    for (let y = 30; y <= 45; y++) {
      for (let x = 30; x <= 45; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        er += p[0]; eg += p[1]; eb += p[2]; ecount++;
      }
      for (let x = 55; x <= 70; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        er += p[0]; eg += p[1]; eb += p[2]; ecount++;
      }
    }
    er /= ecount; eg /= ecount; eb /= ecount;
    const eyeColor = rgbToHex(er, eg, eb);

    return { skinTone, skinToneClass, hairColor, eyeColor };
  };

  CS_AVATAR.detectFaceFeatures = function (imageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, 100, 100);

    // Beard – chin rows 70-90
    let totalSat = 0, totalDark = 0, bcount = 0;
    for (let y = 70; y <= 90; y++) {
      for (let x = 30; x <= 70; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        totalSat += getSaturation(p[0], p[1], p[2]);
        totalDark += (p[0] + p[1] + p[2]) / 3;
        bcount++;
      }
    }
    const avgSat = totalSat / bcount;
    const avgDark = totalDark / bcount;
    const hasBeard = avgSat < 0.2 && avgDark < 160 && avgDark > 60;

    // Glasses – horizontal high-contrast edges in eye region rows 28-50
    let edgeCount = 0;
    for (let y = 28; y <= 50; y++) {
      for (let x = 20; x <= 80; x++) {
        const p1 = ctx.getImageData(x, y, 1, 1).data;
        const p2 = ctx.getImageData(x + 1, y, 1, 1).data;
        const diff = Math.abs(
          (p1[0] + p1[1] + p1[2]) / 3 - (p2[0] + p2[1] + p2[2]) / 3
        );
        if (diff > 60) edgeCount++;
      }
    }
    const hasGlasses = edgeCount > 40;

    return { hasBeard, hasGlasses };
  };

  // ─── SVG Generation ─────────────────────────────────────────────────────────

  CS_AVATAR.generateAvatarSVG = function (data) {
    return buildSVG(data, data.expressionDefault || 'friendly');
  };

  CS_AVATAR.generateAvatarSVGWithExpression = function (data, expression) {
    return buildSVG(data, expression);
  };

  function buildSVG(data, expression) {
    const skin = data.skinTone || '#F5CBA7';
    const hair = data.hairColor || '#3D2B1F';
    const eye = data.eyeColor || '#634e34';
    const skinShadow = hexDarken(skin, 25);
    const skinLight = hexLighten(skin, 15);
    const hairDark = hexDarken(hair, 20);
    const eyebrowColor = hexDarken(hair, 10);
    const gender = data.gender || 'neutral';
    const faceShape = data.faceShape || 'oval';
    const hairstyleIndex = data.hairstyleIndex != null ? data.hairstyleIndex : 0;

    // Face ellipse dimensions
    let faceRx = 62, faceRy = 78;
    if (faceShape === 'round') { faceRx = 68; faceRy = 70; }
    else if (faceShape === 'square') { faceRx = 65; faceRy = 72; }
    else if (faceShape === 'heart') { faceRx = 60; faceRy = 76; }

    // Gender adjustments
    let featureScale = 1.0;
    if (gender === 'feminine') featureScale = 0.92;
    else if (gender === 'masculine') featureScale = 1.06;

    // Expression
    const expr = getExpression(expression);

    // Hairstyle
    const hairPath = getHairstyle(hairstyleIndex, hair, hairDark, faceRx, gender);

    // Glasses
    const glassesLayer = data.hasGlasses ? buildGlasses() : '';

    // Beard
    const beardLayer = data.hasBeard ? buildBeard(skin, skinShadow, faceRx) : '';

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" width="200" height="280">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ede9fe"/>
      <stop offset="100%" stop-color="#c7d2fe"/>
    </radialGradient>
    <radialGradient id="faceGrad" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${skinLight}"/>
      <stop offset="100%" stop-color="${skinShadow}"/>
    </radialGradient>
    <radialGradient id="eyeGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="${hexLighten(eye, 30)}"/>
      <stop offset="100%" stop-color="${hexDarken(eye, 20)}"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.18)"/>
    </filter>
    <clipPath id="faceClip">
      <ellipse cx="100" cy="130" rx="${faceRx}" ry="${faceRy}"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <circle cx="100" cy="140" r="130" fill="url(#bgGrad)"/>

  <!-- Shoulders + shirt -->
  <ellipse cx="100" cy="268" rx="90" ry="40" fill="#4f46e5"/>
  <rect x="28" y="240" width="144" height="50" rx="18" fill="#6366f1"/>
  <!-- Collar -->
  <path d="M82,240 Q100,258 118,240" fill="none" stroke="#4338ca" stroke-width="2.5"/>

  <!-- Neck -->
  <rect x="84" y="195" width="32" height="50" rx="14" fill="${skin}"/>
  <rect x="86" y="200" width="28" height="40" rx="12" fill="${skinShadow}" opacity="0.25"/>

  <!-- Ears -->
  <ellipse cx="${100 - faceRx + 8}" cy="132" rx="9" ry="13" fill="${skin}" filter="url(#softShadow)"/>
  <ellipse cx="${100 + faceRx - 8}" cy="132" rx="9" ry="13" fill="${skin}" filter="url(#softShadow)"/>
  <ellipse cx="${100 - faceRx + 9}" cy="132" rx="5" ry="8" fill="${skinShadow}" opacity="0.3"/>
  <ellipse cx="${100 + faceRx - 9}" cy="132" rx="5" ry="8" fill="${skinShadow}" opacity="0.3"/>

  <!-- Face -->
  <ellipse cx="100" cy="130" rx="${faceRx}" ry="${faceRy}" fill="url(#faceGrad)" filter="url(#softShadow)"/>

  <!-- Hair layer (behind face elements, above face base) -->
  ${hairPath}

  <!-- Eyebrows -->
  ${buildEyebrows(eyebrowColor, expr, featureScale)}

  <!-- Eyes -->
  ${buildEyes(eye, expr, featureScale)}

  <!-- Nose -->
  ${buildNose(skinShadow, featureScale)}

  <!-- Mouth -->
  ${buildMouth(skin, expr, featureScale, gender)}

  ${glassesLayer}
  ${beardLayer}

  <!-- Subtle chin highlight -->
  <ellipse cx="100" cy="193" rx="20" ry="6" fill="${skinLight}" opacity="0.35"/>
</svg>`;

    return svgStr;
  }

  function getExpression(expression) {
    const map = {
      happy:       { mouthPath: 'M 76,168 Q 100,188 124,168', mouthOpen: false, leftBrow: -4, rightBrow: -4, eyeSquint: 0.12 },
      thinking:    { mouthPath: 'M 82,172 Q 100,172 118,169', mouthOpen: false, leftBrow: -6, rightBrow: 4,  eyeSquint: 0 },
      surprised:   { mouthPath: 'M 88,170 Q 100,185 112,170', mouthOpen: true,  leftBrow: -8, rightBrow: -8, eyeSquint: -0.08 },
      confused:    { mouthPath: 'M 80,174 Q 100,169 120,172', mouthOpen: false, leftBrow: -4, rightBrow: 6,  eyeSquint: 0 },
      encouraging: { mouthPath: 'M 74,166 Q 100,190 126,166', mouthOpen: false, leftBrow: -3, rightBrow: -3, eyeSquint: 0.18 },
      serious:     { mouthPath: 'M 82,172 Q 100,172 118,172', mouthOpen: false, leftBrow: 2,  rightBrow: 2,  eyeSquint: 0 },
      neutral:     { mouthPath: 'M 82,170 Q 100,176 118,170', mouthOpen: false, leftBrow: 0,  rightBrow: 0,  eyeSquint: 0 },
      friendly:    { mouthPath: 'M 78,168 Q 100,186 122,168', mouthOpen: false, leftBrow: -3, rightBrow: -3, eyeSquint: 0.08 }
    };
    return map[expression] || map['friendly'];
  }

  function buildEyebrows(color, expr, scale) {
    const lShift = expr.leftBrow || 0;
    const rShift = expr.rightBrow || 0;
    const thick = Math.round(3 * scale);
    return `
  <path d="M ${70 - 4*scale},${100 + lShift} Q ${80},${97 + lShift} ${90 + 4*scale},${101 + lShift}"
        fill="none" stroke="${color}" stroke-width="${thick}" stroke-linecap="round"/>
  <path d="M ${110 - 4*scale},${101 + rShift} Q ${120},${97 + rShift} ${130 + 4*scale},${100 + rShift}"
        fill="none" stroke="${color}" stroke-width="${thick}" stroke-linecap="round"/>`;
  }

  function buildEyes(eyeColor, expr, scale) {
    const squint = expr.eyeSquint || 0;
    const eyeRy = Math.round((10 - squint * 50) * scale);
    const eyeRyActual = Math.max(4, eyeRy);
    return `
  <!-- Left eye -->
  <ellipse cx="80" cy="116" rx="${Math.round(12*scale)}" ry="${eyeRyActual}" fill="white"/>
  <ellipse cx="80" cy="116" rx="${Math.round(8*scale)}" ry="${Math.round(8*scale)}" fill="url(#eyeGrad)"/>
  <ellipse cx="80" cy="116" rx="${Math.round(5*scale)}" ry="${Math.round(5*scale)}" fill="#1a1a2e"/>
  <ellipse cx="${78 - Math.round(1*scale)}" cy="${114}" rx="2" ry="2" fill="white" opacity="0.85"/>
  <!-- Right eye -->
  <ellipse cx="120" cy="116" rx="${Math.round(12*scale)}" ry="${eyeRyActual}" fill="white"/>
  <ellipse cx="120" cy="116" rx="${Math.round(8*scale)}" ry="${Math.round(8*scale)}" fill="url(#eyeGrad)"/>
  <ellipse cx="120" cy="116" rx="${Math.round(5*scale)}" ry="${Math.round(5*scale)}" fill="#1a1a2e"/>
  <ellipse cx="${118 - Math.round(1*scale)}" cy="${114}" rx="2" ry="2" fill="white" opacity="0.85"/>`;
  }

  function buildNose(shadowColor, scale) {
    return `
  <path d="M 97,130 Q 94,148 88,154 Q 100,158 112,154 Q 106,148 103,130"
        fill="none" stroke="${shadowColor}" stroke-width="${Math.round(1.5*scale)}" stroke-linecap="round" opacity="0.55"/>`;
  }

  function buildMouth(skin, expr, scale, gender) {
    const path = expr.mouthPath;
    if (expr.mouthOpen) {
      return `
  <path d="${path}" fill="#c0392b" stroke="none"/>
  <path d="${path}" fill="none" stroke="${hexDarken(skin, 40)}" stroke-width="2" stroke-linecap="round"/>`;
    }
    const lipColor = gender === 'feminine' ? '#e8848a' : hexDarken(skin, 30);
    const lipColorDark = gender === 'feminine' ? '#c0556b' : hexDarken(skin, 45);
    return `
  <path d="${path}" fill="none" stroke="${lipColorDark}" stroke-width="${Math.round(2.5*scale)}" stroke-linecap="round"/>
  <path d="${path}" fill="none" stroke="${lipColor}" stroke-width="${Math.round(1.2*scale)}" stroke-linecap="round" opacity="0.6"/>`;
  }

  function buildGlasses() {
    return `
  <!-- Glasses frames -->
  <rect x="63" y="107" width="28" height="18" rx="7" fill="none" stroke="#64748b" stroke-width="2.2"/>
  <rect x="109" y="107" width="28" height="18" rx="7" fill="none" stroke="#64748b" stroke-width="2.2"/>
  <line x1="91" y1="115" x2="109" y2="115" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
  <line x1="63" y1="114" x2="55" y2="111" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
  <line x1="137" y1="114" x2="145" y2="111" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
  <!-- Lens tint -->
  <rect x="63" y="107" width="28" height="18" rx="7" fill="#bfdbfe" opacity="0.18"/>
  <rect x="109" y="107" width="28" height="18" rx="7" fill="#bfdbfe" opacity="0.18"/>`;
  }

  function buildBeard(skin, skinShadow, faceRx) {
    return `
  <!-- Beard -->
  <ellipse cx="100" cy="185" rx="${faceRx - 12}" ry="22" fill="${hexDarken(skin, 50)}" opacity="0.28"/>
  <path d="M ${100 - (faceRx - 14)},175 Q 100,200 ${100 + (faceRx - 14)},175"
        fill="${hexDarken(skin, 45)}" opacity="0.22"/>`;
  }

  function getHairstyle(index, hair, hairDark, faceRx, gender) {
    const styles = [
      // 0: short neat
      `<path d="M ${100 - faceRx},125 Q ${100 - faceRx - 4},68 100,52 Q ${100 + faceRx + 4},68 ${100 + faceRx},125 Q 100,58 ${100 - faceRx},125 Z"
          fill="${hair}"/>
       <path d="M ${100 - faceRx},120 Q ${100 - faceRx - 2},72 100,56" fill="none" stroke="${hairDark}" stroke-width="1.5" opacity="0.4"/>`,

      // 1: medium wavy
      `<path d="M ${100 - faceRx - 4},128 Q 42,80 52,54 Q 68,42 100,50 Q 132,42 148,54 Q 158,80 ${100 + faceRx + 4},128 Q 130,60 100,52 Q 70,60 ${100 - faceRx - 4},128 Z"
          fill="${hair}"/>
       <path d="M 42,130 Q 38,100 44,74 Q 50,52 60,46" fill="none" stroke="${hairDark}" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
       <path d="M 158,130 Q 162,100 156,74 Q 150,52 140,46" fill="none" stroke="${hairDark}" stroke-width="2" stroke-linecap="round" opacity="0.35"/>`,

      // 2: curly/afro
      `<path d="M ${100 - faceRx - 8},118 Q 28,90 32,64 Q 36,38 60,34 Q 74,28 100,30 Q 126,28 140,34 Q 164,38 168,64 Q 172,90 ${100 + faceRx + 8},118 Q 140,50 100,44 Q 60,50 ${100 - faceRx - 8},118 Z"
          fill="${hair}"/>
       <circle cx="65" cy="56" r="14" fill="${hairDark}" opacity="0.4"/>
       <circle cx="100" cy="42" r="16" fill="${hairDark}" opacity="0.3"/>
       <circle cx="135" cy="56" r="14" fill="${hairDark}" opacity="0.4"/>
       <circle cx="50" cy="78" r="12" fill="${hairDark}" opacity="0.3"/>
       <circle cx="150" cy="78" r="12" fill="${hairDark}" opacity="0.3"/>`,

      // 3: long straight
      `<path d="M ${100 - faceRx - 2},130 Q 36,88 44,52 Q 56,38 100,50 Q 144,38 156,52 Q 164,88 ${100 + faceRx + 2},130"
          fill="${hair}"/>
       <path d="M 38,130 L 36,230 Q 42,250 54,248 L 56,200 Q 46,160 40,130 Z" fill="${hair}"/>
       <path d="M 162,130 L 164,230 Q 158,250 146,248 L 144,200 Q 154,160 160,130 Z" fill="${hair}"/>
       <path d="M 39,140 L 37,230" fill="none" stroke="${hairDark}" stroke-width="1.5" opacity="0.3"/>
       <path d="M 161,140 L 163,230" fill="none" stroke="${hairDark}" stroke-width="1.5" opacity="0.3"/>`,

      // 4: hijab/head covering
      `<path d="M ${100 - faceRx - 2},132 Q 32,100 36,68 Q 44,38 100,34 Q 156,38 164,68 Q 168,100 ${100 + faceRx + 2},132 Q 100,40 ${100 - faceRx - 2},132 Z"
          fill="${hair}"/>
       <path d="M 36,130 Q 30,170 34,210 Q 42,240 70,248 L 72,230 Q 52,222 48,192 Q 44,162 42,132 Z" fill="${hair}"/>
       <path d="M 164,130 Q 170,170 166,210 Q 158,240 130,248 L 128,230 Q 148,222 152,192 Q 156,162 158,132 Z" fill="${hair}"/>
       <ellipse cx="100" cy="76" rx="${faceRx - 4}" ry="44" fill="${hairDark}" opacity="0.18"/>
       <path d="M 36,132 Q 100,155 164,132" fill="none" stroke="${hairDark}" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>`
    ];

    return styles[Math.min(index, styles.length - 1)] || styles[0];
  }

  // ─── Data URL ────────────────────────────────────────────────────────────────

  CS_AVATAR.svgToDataUrl = function (svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  CS_AVATAR.renderAvatarInContainer = function (containerId, expression) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const avatar = CS_AVATAR.getAvatar();
    if (!avatar) return;

    const expr = expression || avatar.expressionDefault || 'friendly';
    const svg = CS_AVATAR.generateAvatarSVGWithExpression(avatar, expr);
    const url = CS_AVATAR.svgToDataUrl(svg);

    let img = container.querySelector('img.ca-avatar-render');
    if (!img) {
      img = document.createElement('img');
      img.className = 'ca-avatar-render';
      img.style.cssText = 'transition:opacity 0.3s ease;width:100%;height:100%;object-fit:contain;';
      container.appendChild(img);
    }
    img.style.opacity = '0';
    img.src = url;
    img.alt = avatar.name ? avatar.name + ' avatar' : 'My Avatar';
    img.onload = function () { img.style.opacity = '1'; };
  };

  // ─── Photo Processing ────────────────────────────────────────────────────────

  CS_AVATAR.processPhoto = function (imgElement, customizations) {
    const colors = CS_AVATAR.analyseImageColors(imgElement);
    const features = CS_AVATAR.detectFaceFeatures(imgElement);

    const merged = Object.assign({}, DEFAULT_AVATAR, colors, features, customizations || {}, {
      created: new Date().toISOString()
    });

    const svg = CS_AVATAR.generateAvatarSVG(merged);
    merged.svgDataUrl = CS_AVATAR.svgToDataUrl(svg);

    // Compressed 100x100 photo thumbnail
    const canvas = document.createElement('canvas');
    canvas.width = 100; canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, 100, 100);
    merged.photoDataUrl = canvas.toDataURL('image/jpeg', 0.7);

    CS_AVATAR.saveAvatar(merged);
    return merged;
  };

  // ─── Webcam ──────────────────────────────────────────────────────────────────

  CS_AVATAR._webcamStream = null;

  CS_AVATAR.startWebcam = function (videoElementId) {
    const video = document.getElementById(videoElementId);
    if (!video) return Promise.reject(new Error('Video element not found'));
    return navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(function (stream) {
        CS_AVATAR._webcamStream = stream;
        video.srcObject = stream;
        video.play();
        return stream;
      });
  };

  CS_AVATAR.stopWebcam = function () {
    if (CS_AVATAR._webcamStream) {
      CS_AVATAR._webcamStream.getTracks().forEach(function (t) { t.stop(); });
      CS_AVATAR._webcamStream = null;
    }
  };

  CS_AVATAR.capturePhoto = function (videoElementId, canvasId) {
    const video = document.getElementById(videoElementId);
    const canvas = document.getElementById(canvasId);
    if (!video || !canvas) return Promise.resolve(null);
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL('image/jpeg', 0.9);
    const img = new Image();
    return new Promise(function (resolve) {
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(img); }; // fallback — resolve even on error
      img.src = dataURL;
    });
  };

  // ─── Modal ───────────────────────────────────────────────────────────────────

  CS_AVATAR.injectStyles = function () {
    if (document.getElementById('cs-avatar-styles')) return;
    const style = document.createElement('style');
    style.id = 'cs-avatar-styles';
    style.textContent = `
.ca-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;}
.ca-modal{background:#fff;border-radius:24px;padding:28px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;position:relative;}
.ca-modal h2{font-size:20px;font-weight:900;color:#1e293b;margin:0 0 6px;}
.ca-step-bar{display:flex;gap:6px;margin:12px 0 20px;}
.ca-step{flex:1;height:4px;border-radius:2px;background:#e2e8f0;}
.ca-step.active{background:#6366f1;}
.ca-step.done{background:#10b981;}
.ca-webcam-box{background:#0f172a;border-radius:14px;overflow:hidden;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;margin:12px 0;}
.ca-webcam-box video,.ca-webcam-box img{width:100%;height:100%;object-fit:cover;}
.ca-btn-row{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;}
.ca-btn{padding:10px 16px;border-radius:10px;border:none;font-weight:700;font-size:13px;cursor:pointer;transition:opacity .2s;}
.ca-btn:hover{opacity:.85;}
.ca-btn-primary{background:#6366f1;color:#fff;}
.ca-btn-secondary{background:#f1f5f9;color:#475569;}
.ca-btn-success{background:#10b981;color:#fff;}
.ca-btn-danger{background:#ef4444;color:#fff;}
.ca-hairstyle-btn{width:46px;height:46px;border-radius:12px;border:2px solid #e2e8f0;background:#f8fafc;font-size:22px;cursor:pointer;transition:all .15s;}
.ca-hairstyle-btn.selected{border-color:#6366f1;background:#ede9fe;}
.ca-avatar-preview{width:120px;height:168px;margin:0 auto 12px;display:block;border-radius:16px;box-shadow:0 4px 20px rgba(99,102,241,.2);}
.ca-avatar-preview-lg{width:180px;height:252px;margin:0 auto 16px;display:block;border-radius:20px;box-shadow:0 8px 32px rgba(99,102,241,.25);}
.ca-label{font-size:13px;font-weight:700;color:#475569;margin:12px 0 6px;}
.ca-input{width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;box-sizing:border-box;}
.ca-input:focus{outline:2px solid #6366f1;border-color:#6366f1;}
.ca-avatar-widget{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,#ede9fe,#e0f2fe);border:1.5px solid #c4b5fd;border-radius:16px;padding:14px;margin:12px 0;}
.ca-avatar-mini{width:56px;height:78px;border-radius:10px;}
.ca-close-btn{position:absolute;top:16px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#64748b;line-height:1;}
.ca-gender-btn{padding:8px 16px;border-radius:10px;border:1.5px solid #e2e8f0;background:#f8fafc;font-size:13px;font-weight:700;cursor:pointer;}
.ca-gender-btn.selected{background:#ede9fe;border-color:#6366f1;color:#4f46e5;}
.avatar-expression-badge{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:20px;display:inline-block;}
@keyframes avatarBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.avatar-signing{animation:avatarBounce 1.2s ease-in-out infinite;}
.ca-speed-row{display:flex;gap:10px;align-items:center;margin:6px 0;}
.ca-speed-row label{font-size:13px;font-weight:600;color:#475569;display:flex;align-items:center;gap:5px;cursor:pointer;}
.ca-done-check{text-align:center;padding:10px 0;}
.ca-done-check p{font-size:16px;font-weight:700;color:#1e293b;margin:8px 0 16px;}
    `;
    document.head.appendChild(style);
  };

  CS_AVATAR.injectCreatorModal = function () {
    if (document.getElementById('ca-creator-modal')) return;

    CS_AVATAR.injectStyles();

    const backdrop = document.createElement('div');
    backdrop.className = 'ca-modal-backdrop';
    backdrop.id = 'ca-creator-modal';
    backdrop.style.display = 'none';

    backdrop.innerHTML = `
<div class="ca-modal" role="dialog" aria-modal="true" aria-label="Create My Avatar">
  <button class="ca-close-btn" id="ca-close-btn" aria-label="Close">&times;</button>
  <h2>📷 Create My Avatar</h2>
  <p style="font-size:13px;color:#64748b;margin:0 0 4px;">Let's build your personal signing guide!</p>
  <div class="ca-step-bar">
    <div class="ca-step active" id="ca-step-1"></div>
    <div class="ca-step" id="ca-step-2"></div>
    <div class="ca-step" id="ca-step-3"></div>
  </div>
  <div style="font-size:11px;color:#94a3b8;text-align:center;margin:-14px 0 14px;letter-spacing:.5px;">
    <span id="ca-step-label">Step 1 of 3: Take a Photo</span>
  </div>

  <!-- STEP 1 -->
  <div id="ca-panel-1">
    <div class="ca-webcam-box" id="avatarWebcamPreview">
      <span style="color:#475569;font-size:13px;">Camera preview will appear here</span>
    </div>
    <canvas id="ca-capture-canvas" style="display:none;"></canvas>
    <div class="ca-btn-row">
      <button class="ca-btn ca-btn-primary" id="ca-btn-webcam">📷 Use Webcam</button>
      <button class="ca-btn ca-btn-secondary" id="ca-btn-upload">📁 Upload Photo</button>
      <button class="ca-btn ca-btn-secondary" id="ca-btn-skip">⚡ Skip (Use Defaults)</button>
    </div>
    <input type="file" id="ca-file-input" accept="image/*" capture="user" style="display:none;"/>
    <div id="ca-webcam-capture-row" style="display:none;">
      <div class="ca-btn-row">
        <button class="ca-btn ca-btn-success" id="ca-btn-capture">✅ Take Photo</button>
        <button class="ca-btn ca-btn-danger" id="ca-btn-stop-webcam">⏹ Stop</button>
      </div>
    </div>
  </div>

  <!-- STEP 2 -->
  <div id="ca-panel-2" style="display:none;">
    <img id="ca-avatar-preview-sm" class="ca-avatar-preview" src="" alt="Avatar preview"/>
    <div class="ca-label">Hair Style</div>
    <div class="ca-btn-row" id="ca-hairstyle-row">
      <button class="ca-hairstyle-btn selected" data-idx="0" title="Short neat">💇</button>
      <button class="ca-hairstyle-btn" data-idx="1" title="Medium wavy">👱</button>
      <button class="ca-hairstyle-btn" data-idx="2" title="Curly / Afro">🧑‍🦱</button>
      <button class="ca-hairstyle-btn" data-idx="3" title="Long straight">👩</button>
      <button class="ca-hairstyle-btn" data-idx="4" title="Hijab / Head covering">🧕</button>
    </div>
    <div class="ca-label">Gender Presentation</div>
    <div class="ca-btn-row">
      <button class="ca-gender-btn" data-gender="feminine">Feminine</button>
      <button class="ca-gender-btn selected" data-gender="neutral">Neutral</button>
      <button class="ca-gender-btn" data-gender="masculine">Masculine</button>
    </div>
    <div class="ca-label">What should I call you?</div>
    <input type="text" class="ca-input" id="ca-name-input" placeholder="Enter your name..." maxlength="40"/>
    <div class="ca-label">Signing Speed</div>
    <div class="ca-speed-row">
      <label><input type="radio" name="ca-speed" value="0.75"/> 🐢 Slow</label>
      <label><input type="radio" name="ca-speed" value="1.0" checked/> 🚶 Normal</label>
      <label><input type="radio" name="ca-speed" value="1.5"/> 🏃 Fast</label>
    </div>
    <div class="ca-btn-row" style="margin-top:16px;">
      <button class="ca-btn ca-btn-primary" id="ca-btn-next-to-3" style="flex:1;">Continue →</button>
    </div>
  </div>

  <!-- STEP 3 -->
  <div id="ca-panel-3" style="display:none;">
    <div class="ca-done-check">
      <img id="ca-avatar-preview-lg" class="ca-avatar-preview-lg" src="" alt="Your avatar"/>
      <p>🎉 Your avatar is ready!</p>
      <div id="ca-avatar-name-display" style="font-size:15px;color:#6366f1;font-weight:800;margin-bottom:12px;"></div>
      <button class="ca-btn ca-btn-success" id="ca-btn-start-signing" style="font-size:15px;padding:14px 32px;">
        🤟 Start Signing
      </button>
    </div>
  </div>
</div>`;

    document.body.appendChild(backdrop);
    CS_AVATAR._initModalEvents(backdrop);
  };

  CS_AVATAR._initModalEvents = function (backdrop) {
    // State
    let currentStep = 1;
    let capturedImage = null;
    let currentCustomizations = {
      hairstyleIndex: 0,
      gender: 'neutral',
      name: '',
      signSpeed: 1.0,
      preferredLang: 'en'
    };

    function showStep(n) {
      currentStep = n;
      [1, 2, 3].forEach(function (i) {
        const panel = document.getElementById('ca-panel-' + i);
        const step = document.getElementById('ca-step-' + i);
        if (panel) panel.style.display = i === n ? 'block' : 'none';
        if (step) {
          step.className = 'ca-step' + (i < n ? ' done' : i === n ? ' active' : '');
        }
      });
      const labels = ['Step 1 of 3: Take a Photo', 'Step 2 of 3: Customise', 'Step 3 of 3: Done'];
      const lbl = document.getElementById('ca-step-label');
      if (lbl) lbl.textContent = labels[n - 1];
    }

    function refreshPreview() {
      const svg = buildSVG(Object.assign({}, DEFAULT_AVATAR, currentCustomizations), 'friendly');
      const url = CS_AVATAR.svgToDataUrl(svg);
      const sm = document.getElementById('ca-avatar-preview-sm');
      const lg = document.getElementById('ca-avatar-preview-lg');
      if (sm) sm.src = url;
      if (lg) lg.src = url;
    }

    function goToStep2(img) {
      capturedImage = img;
      CS_AVATAR.stopWebcam();

      if (img) {
        // Analyse image
        const colors = CS_AVATAR.analyseImageColors(img);
        const features = CS_AVATAR.detectFaceFeatures(img);
        Object.assign(currentCustomizations, colors, features);
      }

      // Show webcam preview with captured image
      const previewBox = document.getElementById('avatarWebcamPreview');
      if (previewBox && img) {
        previewBox.innerHTML = '';
        const previewImg = document.createElement('img');
        previewImg.src = img.src;
        previewBox.appendChild(previewImg);
      }

      refreshPreview();
      showStep(2);
    }

    // Close
    const closeBtn = document.getElementById('ca-close-btn');
    if (closeBtn) closeBtn.onclick = function () { CS_AVATAR._closeModal(); };
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) CS_AVATAR._closeModal();
    });

    // Webcam
    const btnWebcam = document.getElementById('ca-btn-webcam');
    if (btnWebcam) btnWebcam.onclick = function () {
      const previewBox = document.getElementById('avatarWebcamPreview');

      // Guard: remove any existing video element and stop its stream before creating a new one
      const existing = document.getElementById('ca-webcam-video');
      if (existing) {
        if (existing.srcObject) { existing.srcObject.getTracks().forEach(function (t) { t.stop(); }); }
        existing.remove();
      }

      previewBox.innerHTML = '';
      const video = document.createElement('video');
      video.id = 'ca-webcam-video';
      video.muted = true;
      video.playsInline = true;
      previewBox.appendChild(video);

      CS_AVATAR.startWebcam('ca-webcam-video')
        .then(function () {
          const row = document.getElementById('ca-webcam-capture-row');
          if (row) row.style.display = 'block';
        })
        .catch(function (err) {
          previewBox.innerHTML = '<span style="color:#ef4444;font-size:12px;padding:8px;">Camera not available: ' + err.message + '</span>';
        });
    };

    // Capture
    const btnCapture = document.getElementById('ca-btn-capture');
    if (btnCapture) btnCapture.onclick = function () {
      const row = document.getElementById('ca-webcam-capture-row');
      if (row) row.style.display = 'none';
      CS_AVATAR.capturePhoto('ca-webcam-video', 'ca-capture-canvas').then(function (img) {
        goToStep2(img || null);
      });
    };

    // Stop webcam
    const btnStop = document.getElementById('ca-btn-stop-webcam');
    if (btnStop) btnStop.onclick = function () {
      CS_AVATAR.stopWebcam();
      const row = document.getElementById('ca-webcam-capture-row');
      if (row) row.style.display = 'none';
      const previewBox = document.getElementById('avatarWebcamPreview');
      previewBox.innerHTML = '<span style="color:#475569;font-size:13px;">Camera stopped</span>';
    };

    // Upload
    const btnUpload = document.getElementById('ca-btn-upload');
    const fileInput = document.getElementById('ca-file-input');
    if (btnUpload && fileInput) {
      btnUpload.onclick = function () { fileInput.click(); };
      fileInput.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
          const img = new Image();
          img.onload = function () { goToStep2(img); };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      };
    }

    // Skip
    const btnSkip = document.getElementById('ca-btn-skip');
    if (btnSkip) btnSkip.onclick = function () { goToStep2(null); };

    // Hairstyle buttons
    const hairRow = document.getElementById('ca-hairstyle-row');
    if (hairRow) {
      hairRow.querySelectorAll('.ca-hairstyle-btn').forEach(function (btn) {
        btn.onclick = function () {
          hairRow.querySelectorAll('.ca-hairstyle-btn').forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          currentCustomizations.hairstyleIndex = parseInt(btn.dataset.idx, 10);
          refreshPreview();
        };
      });
    }

    // Gender buttons
    backdrop.querySelectorAll('.ca-gender-btn').forEach(function (btn) {
      btn.onclick = function () {
        backdrop.querySelectorAll('.ca-gender-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        currentCustomizations.gender = btn.dataset.gender;
        refreshPreview();
      };
    });

    // Name input
    const nameInput = document.getElementById('ca-name-input');
    if (nameInput) {
      nameInput.oninput = function () {
        currentCustomizations.name = nameInput.value.trim();
      };
    }

    // Sign speed
    backdrop.querySelectorAll('input[name="ca-speed"]').forEach(function (radio) {
      radio.onchange = function () {
        currentCustomizations.signSpeed = parseFloat(radio.value);
      };
    });

    // Next to step 3
    const btnNext = document.getElementById('ca-btn-next-to-3');
    if (btnNext) btnNext.onclick = function () {
      // Final save
      const avatarData = Object.assign({}, DEFAULT_AVATAR, currentCustomizations, {
        created: new Date().toISOString()
      });

      if (capturedImage) {
        const canvas = document.createElement('canvas');
        canvas.width = 100; canvas.height = 100;
        canvas.getContext('2d').drawImage(capturedImage, 0, 0, 100, 100);
        avatarData.photoDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      }

      const svg = CS_AVATAR.generateAvatarSVG(avatarData);
      avatarData.svgDataUrl = CS_AVATAR.svgToDataUrl(svg);
      CS_AVATAR.saveAvatar(avatarData);

      // Update large preview
      const lg = document.getElementById('ca-avatar-preview-lg');
      if (lg) lg.src = avatarData.svgDataUrl;

      const nameDisplay = document.getElementById('ca-avatar-name-display');
      if (nameDisplay && avatarData.name) nameDisplay.textContent = 'Hello, ' + avatarData.name + '!';

      showStep(3);
    };

    // Start signing
    const btnStart = document.getElementById('ca-btn-start-signing');
    if (btnStart) btnStart.onclick = function () {
      CS_AVATAR._closeModal();
      document.dispatchEvent(new CustomEvent('avatarCreated', { detail: CS_AVATAR.getAvatar() }));
    };

    showStep(1);
  };

  CS_AVATAR._closeModal = function () {
    const modal = document.getElementById('ca-creator-modal');
    if (modal) modal.style.display = 'none';
    CS_AVATAR.stopWebcam();
  };

  CS_AVATAR.openCreatorModal = function () {
    CS_AVATAR.injectCreatorModal();
    const modal = document.getElementById('ca-creator-modal');
    if (modal) modal.style.display = 'flex';
  };

  // ─── Init ────────────────────────────────────────────────────────────────────

  CS_AVATAR.init = function () {
    CS_AVATAR.injectStyles();
    if (CS_AVATAR.hasAvatar()) {
      document.dispatchEvent(new CustomEvent('avatarReady', { detail: CS_AVATAR.getAvatar() }));
    }
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CS_AVATAR.init);
  } else {
    CS_AVATAR.init();
  }

  window.CS_AVATAR = CS_AVATAR;
})();
