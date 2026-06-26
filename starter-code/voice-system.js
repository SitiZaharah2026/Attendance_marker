(function () {
  'use strict';

  var synth = window.speechSynthesis;
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = null;
  var recognitionActive = false;
  var lastSpoken = '';
  var currentPageName = '';
  var currentPageInstructions = '';
  var loginFlowActive = false;
  var loginStep = null;
  var loginData = {};
  var cameraStream = null;
  var videoElement = null;
  var canvasElement = null;
  var isListening = false;
  var restartTimer = null;

  function speak(text, onEnd) {
    if (!synth) return;
    synth.cancel();
    lastSpoken = text;
    var utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    utter.lang = 'en-US';
    utter.onend = function () {
      if (onEnd) onEnd();
      else startListening();
    };
    utter.onerror = function () {
      startListening();
    };
    synth.speak(utter);
  }

  function speakBM(text, onEnd) {
    if (!synth) return;
    synth.cancel();
    lastSpoken = text;
    var utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    utter.lang = 'ms-MY';
    utter.onend = function () {
      if (onEnd) onEnd();
      else startListening();
    };
    utter.onerror = function () {
      startListening();
    };
    synth.speak(utter);
  }

  function speakAuto(text, onEnd) {
    var bmWords = ['halaman', 'bantuan', 'berhenti', 'ulang', 'kamera', 'buka', 'imbas', 'buku', 'pustakawan', 'membaca', 'disleksia', 'isyarat', 'amaran', 'awal', 'intervensi', 'profil', 'keluar', 'dimuat', 'sedia', 'kata', 'laluan'];
    var lowerText = text.toLowerCase();
    var isBM = bmWords.some(function (w) { return lowerText.indexOf(w) !== -1; });
    if (isBM) speakBM(text, onEnd);
    else speak(text, onEnd);
  }

  function initRecognition() {
    if (!SpeechRecognition) return null;
    var r = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-US';
    r.maxAlternatives = 3;
    r.onresult = function (event) {
      var lastResult = event.results[event.results.length - 1];
      var bestTranscript = '', bestConf = 0;
      for (var i = 0; i < lastResult.length; i++) {
        if (lastResult[i].confidence >= bestConf) {
          bestConf = lastResult[i].confidence;
          bestTranscript = lastResult[i].transcript;
        }
      }
      bestTranscript = bestTranscript.trim().toLowerCase();
      var allAlts = [];
      for (var j = 0; j < lastResult.length; j++) {
        allAlts.push(lastResult[j].transcript.trim().toLowerCase());
      }
      isListening = false;
      recognitionActive = false;
      handleCommand(bestTranscript, allAlts);
    };
    r.onerror = function (event) {
      isListening = false;
      recognitionActive = false;
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        restartTimer = setTimeout(startListening, 2000);
      } else {
        restartTimer = setTimeout(startListening, 500);
      }
    };
    r.onend = function () {
      isListening = false;
      recognitionActive = false;
      if (!loginFlowActive && !synth.speaking) {
        restartTimer = setTimeout(startListening, 300);
      }
    };
    return r;
  }

  function startListening() {
    if (!SpeechRecognition) return;
    if (isListening || recognitionActive || synth.speaking || loginFlowActive) return;
    if (restartTimer) { clearTimeout(restartTimer); restartTimer = null; }
    if (!recognition) recognition = initRecognition();
    try {
      recognition.start();
      isListening = true;
      recognitionActive = true;
    } catch (e) {
      isListening = false;
      recognitionActive = false;
    }
  }

  function stopListening() {
    if (restartTimer) { clearTimeout(restartTimer); restartTimer = null; }
    if (recognition) {
      try { recognition.abort(); } catch (e) {}
    }
    isListening = false;
    recognitionActive = false;
  }

  function stripWakeWord(text) {
    return text
      .replace(/^celiksense[\s,]+/i, '')
      .replace(/^celik sense[\s,]+/i, '')
      .trim();
  }

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  }

  function matchesAny(input, patterns) {
    var n = normalize(input);
    return patterns.some(function (p) {
      return n === normalize(p) || n.indexOf(normalize(p)) !== -1;
    });
  }

  function handleCommand(raw, alternatives) {
    if (loginFlowActive) {
      handleLoginInput(raw, alternatives);
      return;
    }

    var input = stripWakeWord(raw);
    var alts = (alternatives || []).map(stripWakeWord);

    function check(patterns) {
      return matchesAny(input, patterns) || alts.some(function (a) { return matchesAny(a, patterns); });
    }

    if (check(['start guide', 'mula panduan', 'guide'])) {
      CS_VOICE.startGuide();
    } else if (check(['login', 'log in', 'masuk', 'daftar masuk'])) {
      CS_VOICE.startLoginFlow();
    } else if (check(['guest mode', 'mod tetamu', 'tetamu', 'guest'])) {
      CS_VOICE.enableGuestMode();
    } else if (check(['open dashboard', 'dashboard', 'papan pemuka', 'buka papan pemuka'])) {
      navigateTo('dashboard.html');
    } else if (check(['open librarian', 'librarian', 'pustakawan', 'ai librarian'])) {
      navigateTo('ai-librarian.html');
    } else if (check(['open reading', 'reading companion', 'pembantu membaca', 'reading'])) {
      navigateTo('reading-companion.html');
    } else if (check(['open ocr', 'ocr', 'imbas buku', 'scan'])) {
      navigateTo('ocr-agent.html');
    } else if (check(['open adhd', 'adhd'])) {
      navigateTo('adhd-agent.html');
    } else if (check(['open dyslexia', 'dyslexia', 'disleksia'])) {
      navigateTo('dyslexia-agent.html');
    } else if (check(['open sign language', 'sign language', 'bahasa isyarat', 'isyarat'])) {
      navigateTo('sign-language.html');
    } else if (check(['open early warning', 'early warning', 'amaran awal', 'amaran'])) {
      navigateTo('early-warning.html');
    } else if (check(['open intervention', 'intervention', 'intervensi'])) {
      navigateTo('intervention.html');
    } else if (check(['open profile', 'profile', 'profil'])) {
      navigateTo('profile.html');
    } else if (check(['open camera', 'buka kamera', 'camera', 'kamera'])) {
      CS_VOICE.openCamera();
    } else if (check(['read page', 'baca halaman', 'read', 'baca'])) {
      CS_VOICE.readPage();
    } else if (check(['stop', 'berhenti', 'cancel', 'batal'])) {
      CS_VOICE.stop();
    } else if (check(['help', 'bantuan', 'what can i say', 'commands'])) {
      CS_VOICE.speakHelp();
    } else if (check(['repeat', 'ulang', 'say again', 'repeat that'])) {
      CS_VOICE.repeat();
    } else if (check(['scan book', 'scan', 'capture', 'tangkap'])) {
      CS_VOICE.captureFrame();
    } else if (check(['logout', 'log out', 'keluar', 'sign out'])) {
      CS_VOICE.logout();
    } else if (check(['ask', 'tanya', 'explain', 'terangkan', 'summarise', 'summarize', 'ringkaskan'])) {
      var prompt = input.replace(/^(ask|tanya|explain|terangkan|summarise|summarize|ringkaskan)\s*/i, '');
      if (!prompt) {
        var content = getPageText();
        CS_VOICE.askGemini('Summarise this content briefly for a blind learner: ' + content);
      } else {
        CS_VOICE.askGemini(prompt);
      }
    } else {
      speak('Command not recognised. Say Help to hear available commands.');
    }
  }

  function navigateTo(page) {
    speak('Opening ' + page.replace('.html', '').replace(/-/g, ' '), function () {
      window.location.href = page;
    });
  }

  function getPageText() {
    var main = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
    return main.innerText.slice(0, 1500);
  }

  function handleLoginInput(raw, alternatives) {
    if (loginStep === 'email_collect') {
      var email = raw.replace(/\s+/g, '').replace(/\bat\b/gi, '@').replace(/\bdot\b/gi, '.').replace(/\bDot\b/gi, '.');
      loginData.email = email;
      loginStep = 'email_confirm';
      speak('You said ' + email + '. Is that correct? Say Yes to confirm or No to try again.');
    } else if (loginStep === 'email_confirm') {
      if (matchesAny(raw, ['yes', 'ya', 'correct', 'betul', 'confirm', 'yep'])) {
        loginStep = 'password_collect';
        loginData.password = '';
        speak('Email confirmed. Please say your password letter by letter. Say Capital before a capital letter. Say done when finished.');
        listenForPassword();
      } else {
        loginStep = 'email_collect';
        loginData.email = '';
        speak('Let\'s try again. Please say your email address.');
      }
    } else if (loginStep === 'password_confirm') {
      if (matchesAny(raw, ['yes', 'ya', 'correct', 'betul', 'confirm', 'yep'])) {
        loginStep = null;
        loginFlowActive = false;
        speak('Logging in now.', function () {
          submitLogin(loginData.email, loginData.password);
        });
      } else {
        loginStep = 'password_collect';
        loginData.password = '';
        speak('Let\'s re-enter the password. Say each character. Say done when finished.');
        listenForPassword();
      }
    }
  }

  function listenForPassword() {
    loginStep = 'password_collect';
    loginData.passwordChars = [];
    collectPasswordChar();
  }

  function collectPasswordChar() {
    if (!SpeechRecognition) return;
    var r = new SpeechRecognition();
    r.lang = 'en-US';
    r.continuous = false;
    r.interimResults = false;
    r.onresult = function (event) {
      var said = event.results[0][0].transcript.trim();
      var lower = said.toLowerCase();
      if (lower === 'done' || lower === 'selesai' || lower === 'finish') {
        loginData.password = loginData.passwordChars.join('');
        loginStep = 'password_confirm';
        var masked = loginData.passwordChars.map(function () { return '*'; }).join('');
        speak('Password entered. ' + loginData.passwordChars.length + ' characters. Say Yes to confirm or No to re-enter.');
      } else {
        var char = parsePasswordChar(said);
        loginData.passwordChars.push(char);
        speak(said, function () {
          if (loginStep === 'password_collect') collectPasswordChar();
        });
        return;
      }
    };
    r.onerror = function () {
      speak('Could not hear. Please repeat the character.');
      collectPasswordChar();
    };
    try { r.start(); } catch (e) {}
  }

  function parsePasswordChar(said) {
    var lower = said.toLowerCase().trim();
    var map = {
      'capital a': 'A', 'capital b': 'B', 'capital c': 'C', 'capital d': 'D',
      'capital e': 'E', 'capital f': 'F', 'capital g': 'G', 'capital h': 'H',
      'capital i': 'I', 'capital j': 'J', 'capital k': 'K', 'capital l': 'L',
      'capital m': 'M', 'capital n': 'N', 'capital o': 'O', 'capital p': 'P',
      'capital q': 'Q', 'capital r': 'R', 'capital s': 'S', 'capital t': 'T',
      'capital u': 'U', 'capital v': 'V', 'capital w': 'W', 'capital x': 'X',
      'capital y': 'Y', 'capital z': 'Z',
      'at sign': '@', 'at': '@', 'hash': '#', 'exclamation': '!', 'underscore': '_',
      'dash': '-', 'dot': '.', 'period': '.', 'zero': '0', 'one': '1', 'two': '2',
      'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7',
      'eight': '8', 'nine': '9'
    };
    if (map[lower]) return map[lower];
    if (lower.length === 1) return lower;
    if (/^small ([a-z])$/.test(lower)) return lower.charAt(lower.length - 1);
    if (/^[a-z]$/.test(lower)) return lower;
    return said.charAt(0);
  }

  function submitLogin(email, password) {
    var loginForm = document.querySelector('form[data-voice-login]') || document.querySelector('#loginForm');
    if (loginForm) {
      var emailInput = loginForm.querySelector('input[type="email"], input[name="email"]');
      var passInput = loginForm.querySelector('input[type="password"], input[name="password"]');
      if (emailInput) emailInput.value = email;
      if (passInput) passInput.value = password;
      loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    } else {
      var event = new CustomEvent('cs_voice_login', { detail: { email: email, password: password } });
      window.dispatchEvent(event);
    }
    startListening();
  }

  var CS_VOICE = {

    init: function () {
      if (!SpeechRecognition) {
        console.warn('CelikSense Voice: SpeechRecognition not supported. Keyboard-only mode active.');
        if (synth) {
          speak('Voice recognition is not available in this browser. Keyboard mode is active. All text will be read aloud.');
        }
        return;
      }
      recognition = initRecognition();
      if (!window._csVoiceVisBound) {
        window._csVoiceVisBound = true;
        document.addEventListener('visibilitychange', function () {
          if (!document.hidden && !synth.speaking && !loginFlowActive) {
            setTimeout(startListening, 1000);
          }
        });
      }
    },

    setPageContext: function (pageName, instructions) {
      currentPageName = pageName;
      currentPageInstructions = instructions;
    },

    announcePageContext: function () {
      if (!synth) return;
      var msg = (currentPageName ? currentPageName + ' loaded. ' : '') + (currentPageInstructions || '');
      if (!msg) msg = 'Page loaded. Say Help to hear available commands.';
      stopListening();
      setTimeout(function () {
        speak(msg, function () {
          setTimeout(startListening, 500);
        });
      }, 800);
    },

    speak: speak,
    speakBM: speakBM,

    startGuide: function () {
      var guide = 'Welcome to CelikSense AI. This platform helps you learn with accessibility features. ' +
        'You can navigate by voice. Say Open Dashboard, Open Librarian, Open Reading Companion, Open OCR, Open ADHD, or Open Dyslexia. ' +
        'Say Help at any time to hear commands. Say Login to sign in, or Guest Mode to continue without an account.';
      speak(guide);
    },

    startLoginFlow: function () {
      loginFlowActive = true;
      loginStep = 'email_collect';
      loginData = {};
      stopListening();
      speak('Starting login. Please say your email address.', function () {
        loginFlowActive = true;
      });
    },

    enableGuestMode: function () {
      sessionStorage.setItem('cs_guest_mode', '1');
      speak('Guest mode enabled. You can access OCR, Text to Speech, Library, and Reading features. Say Open Dashboard to begin.', function () {
        var event = new CustomEvent('cs_guest_mode_enabled');
        window.dispatchEvent(event);
        startListening();
      });
    },

    readPage: function () {
      var text = getPageText();
      if (!text.trim()) { speak('No readable content found on this page.'); return; }
      speak(text);
    },

    stop: function () {
      synth.cancel();
      stopListening();
      loginFlowActive = false;
      loginStep = null;
      setTimeout(function () {
        speak('Stopped. Say Help to continue.', function () {
          setTimeout(startListening, 500);
        });
      }, 300);
    },

    speakHelp: function () {
      var helpText = 'Available voice commands: ' +
        'Start Guide. Login. Guest Mode. ' +
        'Open Dashboard. Open Librarian. Open Reading Companion. Open OCR. Open ADHD. Open Dyslexia. ' +
        'Open Sign Language. Open Early Warning. Open Intervention. Open Profile. ' +
        'Read Page. Open Camera. Scan Book. Ask followed by your question. ' +
        'Repeat. Help. Stop. Logout. ' +
        'In Bahasa Malaysia: Pustakawan, Pembantu Membaca, Imbas Buku, Baca Halaman, Bantuan, Berhenti, Ulang, Keluar.';
      speak(helpText);
    },

    repeat: function () {
      if (lastSpoken) {
        speakAuto(lastSpoken);
      } else {
        speak('Nothing to repeat yet.');
      }
    },

    openCamera: function () {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        speak('Camera is not supported in this browser.');
        return;
      }
      if (!videoElement) {
        videoElement = document.createElement('video');
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('autoplay', '');
        videoElement.style.cssText = 'position:fixed;bottom:20px;right:20px;width:240px;height:180px;z-index:9999;border:3px solid #00aaff;border-radius:8px;';
        videoElement.setAttribute('aria-label', 'Camera preview');
        document.body.appendChild(videoElement);
      }
      if (!canvasElement) {
        canvasElement = document.createElement('canvas');
        canvasElement.style.display = 'none';
        document.body.appendChild(canvasElement);
      }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then(function (stream) {
          cameraStream = stream;
          videoElement.srcObject = stream;
          speak('Camera open. Move camera to your document. Say Capture when ready, or Say Scan Book to extract text.');
        })
        .catch(function (err) {
          speak('Could not access camera. Please check your browser permissions.');
        });
    },

    closeCamera: function () {
      if (cameraStream) {
        cameraStream.getTracks().forEach(function (t) { t.stop(); });
        cameraStream = null;
      }
      if (videoElement && videoElement.parentNode) {
        videoElement.parentNode.removeChild(videoElement);
        videoElement = null;
      }
      speak('Camera closed.');
    },

    captureFrame: function () {
      if (!videoElement || !cameraStream) {
        speak('Camera is not open. Say Open Camera first.');
        return;
      }
      speak('Capturing image now.', function () {
        canvasElement.width = videoElement.videoWidth || 640;
        canvasElement.height = videoElement.videoHeight || 480;
        var ctx = canvasElement.getContext('2d');
        ctx.drawImage(videoElement, 0, 0);
        var dataUrl = canvasElement.toDataURL('image/jpeg', 0.85);
        var base64 = dataUrl.split(',')[1];
        var event = new CustomEvent('cs_voice_capture', { detail: { base64: base64, dataUrl: dataUrl } });
        window.dispatchEvent(event);
        var apiKey = localStorage.getItem('gemini_api_key');
        if (apiKey) {
          CS_VOICE.extractTextFromImage(base64, apiKey);
        } else {
          speak('Image captured. No Gemini API key found. Set your API key in settings to extract text automatically.');
          startListening();
        }
      });
    },

    extractTextFromImage: function (base64, apiKey) {
      speak('Analysing image. Please wait.', null);
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;
      var body = {
        contents: [{
          parts: [
            { text: 'Extract and read aloud all text visible in this image. If it is a book or document, read the full content clearly.' },
            { inline_data: { mime_type: 'image/jpeg', data: base64 } }
          ]
        }]
      };
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().catch(function () { return {}; }).then(function (err) {
              throw new Error('Gemini ' + response.status + ': ' + (err.error && err.error.message || 'Unknown'));
            });
          }
          return response.json();
        })
        .then(function (data) {
          var text = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
          if (!text) throw new Error('No text in response');
          var event = new CustomEvent('cs_voice_ocr_result', { detail: { text: text } });
          window.dispatchEvent(event);
          speak(text);
        })
        .catch(function () {
          speak('Failed to analyse image. Please check your internet connection.');
          startListening();
        });
    },

    askGemini: function (prompt) {
      var apiKey = localStorage.getItem('gemini_api_key');
      if (!apiKey) {
        speak('No Gemini API key found. Please add your key in the settings or profile page.');
        return;
      }
      speak('Thinking. Please wait.', null);
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;
      var body = {
        contents: [{
          parts: [{ text: 'You are a helpful assistant for a blind learner. Be concise and clear. ' + prompt }]
        }]
      };
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          var text = '';
          try {
            text = data.candidates[0].content.parts[0].text;
          } catch (e) {
            text = 'Sorry, I could not get a response.';
          }
          speak(text);
        })
        .catch(function () {
          speak('Failed to reach Gemini. Please check your connection.');
          startListening();
        });
    },

    logout: function () {
      speak('Logging out now.', function () {
        sessionStorage.clear();
        localStorage.removeItem('cs_user_token');
        localStorage.removeItem('cs_user_email');
        var event = new CustomEvent('cs_voice_logout');
        window.dispatchEvent(event);
        if (window.location.pathname.indexOf('login') === -1) {
          window.location.href = 'index.html';
        }
      });
    },

    startListening: startListening,
    stopListening: stopListening,

    isSupported: function () {
      return !!SpeechRecognition;
    },

    getLastSpoken: function () {
      return lastSpoken;
    }
  };

  window.CS_VOICE = CS_VOICE;

  document.addEventListener('DOMContentLoaded', function () {
    CS_VOICE.init();
    setTimeout(function () {
      if (currentPageName || currentPageInstructions) {
        CS_VOICE.announcePageContext();
      } else {
        setTimeout(startListening, 1500);
      }
    }, 600);
  });

})();
