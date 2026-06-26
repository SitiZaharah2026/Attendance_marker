/**
 * CelikSense AI – Braille Output System
 * window.CS_BRAILLE – Grade 1 Braille converter, mode manager,
 * panel injector, live region updater, clipboard, voice commands.
 * Written in plain ES5 for broad compatibility.
 */

window.CS_BRAILLE = (function () {

  /* ------------------------------------------------------------------ */
  /* 1. GRADE 1 BRAILLE MAPS                                             */
  /* ------------------------------------------------------------------ */

  var ALPHA_MAP = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙',
    'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
    'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇',
    'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
    'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
    'y': '⠽', 'z': '⠵'
  };

  /* Number cells reuse letter cells a-j */
  var NUMBER_MAP = {
    '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙',
    '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓',
    '9': '⠊', '0': '⠚'
  };

  var PUNCT_MAP = {
    ' ': '⠀',
    '.': '⠲',
    ',': '⠂',
    '?': '⠦',
    '!': '⠖',
    ':': '⠒',
    ';': '⠆',
    '-': '⠤',
    '(': '⠦',
    ')': '⠴',
    '\'': '⠄',
    '"': '⠄'
  };

  var CAPITAL_INDICATOR = '⠠'; /* ⠠ */
  var NUMBER_INDICATOR  = '⠼'; /* ⠼ */

  /* ------------------------------------------------------------------ */
  /* Internal state                                                       */
  /* ------------------------------------------------------------------ */

  var _lastInputText  = '';
  var _lastBrailleOut = '';

  /* ------------------------------------------------------------------ */
  /* 1. CONVERTER                                                         */
  /* ------------------------------------------------------------------ */

  function convert(text) {
    if (!text) return '';
    var result = '';
    var i = 0;
    var len = text.length;

    while (i < len) {
      var ch = text.charAt(i);

      /* Newline – pass through */
      if (ch === '\n' || ch === '\r') {
        result += ch;
        i++;
        continue;
      }

      /* Digit – collect contiguous digit group, prefix once with ⠼ */
      if (ch >= '0' && ch <= '9') {
        result += NUMBER_INDICATOR;
        while (i < len && text.charAt(i) >= '0' && text.charAt(i) <= '9') {
          result += NUMBER_MAP[text.charAt(i)] || text.charAt(i);
          i++;
        }
        continue;
      }

      /* Uppercase letter */
      if (ch >= 'A' && ch <= 'Z') {
        result += CAPITAL_INDICATOR;
        result += ALPHA_MAP[ch.toLowerCase()] || ch;
        i++;
        continue;
      }

      /* Lowercase letter */
      if (ch >= 'a' && ch <= 'z') {
        result += ALPHA_MAP[ch] || ch;
        i++;
        continue;
      }

      /* Punctuation / space */
      if (PUNCT_MAP.hasOwnProperty(ch)) {
        result += PUNCT_MAP[ch];
        i++;
        continue;
      }

      /* Unknown – pass through unchanged */
      result += ch;
      i++;
    }

    return result;
  }

  /* ------------------------------------------------------------------ */
  /* 4. LIVE REGION UPDATER                                              */
  /* ------------------------------------------------------------------ */

  function _ensureLiveRegion() {
    var el = document.getElementById('brailleLiveRegion');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'brailleLiveRegion';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.setAttribute('role', 'status');
    el.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
    document.body.appendChild(el);
    return el;
  }

  function updateLiveRegion(text) {
    var el = _ensureLiveRegion();
    el.textContent = text;
  }

  /* ------------------------------------------------------------------ */
  /* 2. BRAILLE MODE MANAGER                                             */
  /* ------------------------------------------------------------------ */

  function enable() {
    try { localStorage.setItem('brailleMode', '1'); } catch (e) {}
    document.body.classList.add('braille-mode');
    updateLiveRegion('Braille mode enabled. Braille panels are now visible.');
    var panels = document.querySelectorAll('.braille-panel');
    for (var i = 0; i < panels.length; i++) {
      panels[i].style.display = 'block';
    }
    var btn = document.getElementById('brailleToggle');
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      btn.title = 'Disable Braille Mode';
    }
  }

  function disable() {
    try { localStorage.removeItem('brailleMode'); } catch (e) {}
    document.body.classList.remove('braille-mode');
    updateLiveRegion('Braille mode disabled.');
    var panels = document.querySelectorAll('.braille-panel');
    for (var i = 0; i < panels.length; i++) {
      panels[i].style.display = '';
    }
    var btn = document.getElementById('brailleToggle');
    if (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      btn.title = 'Enable Braille Mode';
    }
  }

  function isEnabled() {
    try { return localStorage.getItem('brailleMode') === '1'; } catch (e) {}
    return document.body.classList.contains('braille-mode');
  }

  function init() {
    injectStyles();
    if (isEnabled()) {
      enable();
    }
    var btn = document.getElementById('brailleToggle');
    if (btn) {
      btn.className += ' braille-toggle-btn';
      if (isEnabled()) btn.classList.add('active');
      btn.setAttribute('aria-pressed', isEnabled() ? 'true' : 'false');
      btn.setAttribute('role', 'switch');
      btn.title = isEnabled() ? 'Disable Braille Mode' : 'Enable Braille Mode';
      btn.addEventListener('click', function () {
        if (isEnabled()) { disable(); } else { enable(); }
      });
    }
    _registerVoiceCommands();
  }

  /* ------------------------------------------------------------------ */
  /* 3. BRAILLE OUTPUT PANEL INJECTOR                                    */
  /* ------------------------------------------------------------------ */

  function injectPanel(containerId, text) {
    var container = document.getElementById(containerId);
    if (!container) return;

    /* Remove existing panel in same container */
    var existing = container.querySelector('.braille-panel');
    if (existing) container.removeChild(existing);

    var brailleText = convert(text || '');

    var panel = document.createElement('div');
    panel.className = 'braille-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Braille Output Panel');

    /* Title */
    var title = document.createElement('div');
    title.className = 'braille-title';
    title.innerHTML = '⠃ Braille Output <span class="braille-mode-badge">GRADE 1</span>';
    panel.appendChild(title);

    /* Original text */
    var orig = document.createElement('div');
    orig.className = 'braille-original';
    orig.setAttribute('aria-label', 'Original text');
    orig.textContent = text || '';
    panel.appendChild(orig);

    /* Braille preview */
    var preview = document.createElement('div');
    preview.className = 'braille-preview';
    preview.setAttribute('aria-label', 'Braille preview');
    preview.setAttribute('tabindex', '0');
    preview.setAttribute('role', 'region');
    preview.textContent = brailleText;
    panel.appendChild(preview);

    /* ARIA live region (visually hidden) – reuse or create via helper */
    _ensureLiveRegion();

    /* Copy button */
    var copyBtn = document.createElement('button');
    copyBtn.className = 'braille-copy-btn';
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy Braille';
    copyBtn.setAttribute('aria-label', 'Copy Braille text to clipboard');
    (function (bt) {
      bt.addEventListener('click', function () {
        copyToClipboard(brailleText);
        bt.textContent = 'Copied!';
        setTimeout(function () { bt.textContent = 'Copy Braille'; }, 2000);
      });
    }(copyBtn));
    panel.appendChild(copyBtn);

    /* Device instructions – collapsible */
    var deviceInfo = document.createElement('details');
    deviceInfo.className = 'braille-device-info';
    var summary = document.createElement('summary');
    summary.textContent = 'How to use with a Braille Display';
    deviceInfo.appendChild(summary);
    var instr = document.createElement('p');
    instr.style.marginTop = '8px';
    instr.textContent =
      'Connect your Braille display to this device via USB or Bluetooth. ' +
      'Enable a screen reader (NVDA, JAWS, VoiceOver, or TalkBack) and navigate ' +
      'to the Braille preview region. The display will refresh automatically. ' +
      'You may also copy the Unicode Braille text above and paste it into any ' +
      'Braille-aware application. Grade 1 Braille is used — each cell represents ' +
      'one character.';
    deviceInfo.appendChild(instr);
    panel.appendChild(deviceInfo);

    /* Prototype notice */
    var notice = document.createElement('p');
    notice.style.cssText = 'margin-top:12px;font-size:12px;color:#64748b;';
    notice.textContent =
      'Prototype: Braille output is generated client-side using Grade 1 Unicode ' +
      'Braille mappings and is intended for use with compatible assistive devices.';
    panel.appendChild(notice);

    container.appendChild(panel);

    _lastInputText  = text || '';
    _lastBrailleOut = brailleText;
  }

  /* ------------------------------------------------------------------ */
  /* 5. CLIPBOARD                                                        */
  /* ------------------------------------------------------------------ */

  function copyToClipboard(text) {
    function speak(msg) {
      if (window.CS && window.CS.tts && window.CS.tts.speak) {
        window.CS.tts.speak(msg);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        speak('Braille text copied');
      }, function () {
        _fallbackCopy(text);
        speak('Braille text copied');
      });
    } else {
      _fallbackCopy(text);
      speak('Braille text copied');
    }
  }

  function _fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ------------------------------------------------------------------ */
  /* 6. CONVERT AND DISPLAY                                              */
  /* ------------------------------------------------------------------ */

  function processText(inputText, outputContainerId) {
    var braille = convert(inputText || '');
    _lastInputText  = inputText  || '';
    _lastBrailleOut = braille;

    if (outputContainerId) {
      var container = document.getElementById(outputContainerId);
      if (container) {
        var preview = container.querySelector('.braille-preview');
        if (preview) {
          preview.textContent = braille;
        } else {
          injectPanel(outputContainerId, inputText);
          return;
        }
        var orig = container.querySelector('.braille-original');
        if (orig) orig.textContent = inputText || '';
      }
    }

    updateLiveRegion(inputText || '');

    if (window.CS && typeof window.CS.tts === 'function') {
      window.CS.tts('Braille output updated.');
    }
  }

  /* ------------------------------------------------------------------ */
  /* 7. VOICE COMMANDS                                                   */
  /* ------------------------------------------------------------------ */

  function _deviceInstructionsText() {
    return 'Connect your Braille display via USB or Bluetooth, enable your screen ' +
      'reader, and navigate to the Braille preview region. The display refreshes ' +
      'automatically. Grade 1 Braille cells are used.';
  }

  function _registerVoiceCommands() {
    if (!window.CS_VOICE || typeof window.CS_VOICE.register !== 'function') return;

    window.CS_VOICE.register('braille mode', function () { enable(); });
    window.CS_VOICE.register('mod braille',  function () { enable(); });

    window.CS_VOICE.register('convert to braille', function () {
      processText(_lastInputText, null);
    });
    window.CS_VOICE.register('tukar kepada braille', function () {
      processText(_lastInputText, null);
    });

    window.CS_VOICE.register('copy braille', function () {
      copyToClipboard(_lastBrailleOut);
    });
    window.CS_VOICE.register('salin braille', function () {
      copyToClipboard(_lastBrailleOut);
    });

    window.CS_VOICE.register('braille instructions', function () {
      if (window.CS && typeof window.CS.tts === 'function') {
        window.CS.tts(_deviceInstructionsText());
      }
    });
    window.CS_VOICE.register('arahan braille', function () {
      if (window.CS && typeof window.CS.tts === 'function') {
        window.CS.tts(_deviceInstructionsText());
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. CSS INJECTOR                                                     */
  /* ------------------------------------------------------------------ */

  function injectStyles() {
    if (document.getElementById('cs-braille-styles')) return;
    var style = document.createElement('style');
    style.id = 'cs-braille-styles';
    style.textContent = [
      '.braille-panel{background:#1e293b;border-radius:16px;padding:24px;margin:16px 0;border:2px solid #6366f1;}',
      '.braille-preview{font-family:monospace;font-size:22px;line-height:2;color:#a5f3fc;background:#0f172a;padding:16px;border-radius:10px;white-space:pre-wrap;word-break:break-all;min-height:80px;outline:2px solid transparent;}',
      '.braille-preview:focus{outline:3px solid #6366f1;}',
      '.braille-original{font-size:15px;color:#cbd5e1;margin-bottom:12px;font-style:italic;}',
      '.braille-title{font-size:18px;font-weight:800;color:#f8fafc;margin-bottom:16px;}',
      '.braille-copy-btn{background:#6366f1;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px;margin-top:12px;}',
      '.braille-copy-btn:hover{background:#4f46e5;}',
      '.braille-device-info{margin-top:16px;color:#94a3b8;font-size:13px;}',
      '.braille-device-info summary{color:#a5b4fc;font-weight:700;cursor:pointer;}',
      '.braille-mode-badge{background:#6366f1;color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:20px;}',
      'body.braille-mode .braille-panel{display:block !important;}',
      '.braille-toggle-btn{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;padding:10px 22px;border-radius:12px;font-weight:800;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:8px;}',
      '.braille-toggle-btn.active{background:linear-gradient(135deg,#10b981,#0d9488);}',
      '#brailleLiveRegion{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------ */
  /* AUTO-INIT on DOMContentLoaded                                       */
  /* ------------------------------------------------------------------ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ------------------------------------------------------------------ */
  /* PUBLIC API                                                          */
  /* ------------------------------------------------------------------ */

  return {
    convert:          convert,
    enable:           enable,
    disable:          disable,
    isEnabled:        isEnabled,
    init:             init,
    injectPanel:      injectPanel,
    updateLiveRegion: updateLiveRegion,
    copyToClipboard:  copyToClipboard,
    processText:      processText,
    injectStyles:     injectStyles
  };

}());
