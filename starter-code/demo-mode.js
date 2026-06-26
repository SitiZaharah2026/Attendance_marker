/**
 * demo-mode.js — CelikSense AI Demo Mode Manager
 * Enables a full offline demo without a Gemini API key.
 * Usage: window.CS_DEMO.enable() / window.CS_DEMO.disable()
 */

(function (window) {
  "use strict";

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  var DEMO_FLAG_KEY = "cs_demo_mode";
  var BANNER_ID = "cs-demo-banner";

  var SAMPLE_DATA = {
    signLangText: "Hello my name is Amirah",
    ocrExtractedText:
      "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of glucose. This process takes place mainly in the leaves, inside structures called chloroplasts, which contain a green pigment called chlorophyll.",
    cs_learning_profile: JSON.stringify({
      streak: 5,
      lastSeen: new Date().toISOString(),
      agentUsage: {
        bilingual: 12,
        blind: 7,
        adhd: 9,
        dyslexia: 4,
        signLang: 3,
        ocr: 6,
        cognitive: 8,
        speechTherapy: 2,
      },
      preferredLang: "en",
      totalSessions: 47,
    }),
  };

  // ---------------------------------------------------------------------------
  // Mock Responses
  // ---------------------------------------------------------------------------
  var MOCK_RESPONSES = {
    generateQuiz: [
      {
        question:
          "What is the main purpose of photosynthesis in plants?",
        options: [
          "A. To absorb water from the soil",
          "B. To produce oxygen and glucose using sunlight",
          "C. To release carbon dioxide into the air",
          "D. To grow new leaves during spring",
        ],
        answer: "B",
        explanation:
          "Photosynthesis converts sunlight, water, and CO₂ into glucose and oxygen — the plant's primary energy source.",
      },
      {
        question: "Where does photosynthesis mainly take place?",
        options: [
          "A. In the roots",
          "B. In the stem",
          "C. In the flowers",
          "D. In the leaves, inside chloroplasts",
        ],
        answer: "D",
        explanation:
          "Chloroplasts in leaf cells contain chlorophyll, which captures light energy to drive photosynthesis.",
      },
      {
        question: "Which pigment gives leaves their green colour?",
        options: [
          "A. Melanin",
          "B. Carotene",
          "C. Chlorophyll",
          "D. Anthocyanin",
        ],
        answer: "C",
        explanation:
          "Chlorophyll absorbs red and blue light while reflecting green light, giving plants their characteristic green colour.",
      },
    ],

    explain:
      "Photosynthesis is how plants make their own food. Think of it like a tiny solar-powered kitchen inside each leaf. The plant takes in sunlight through its green pigment (chlorophyll), pulls in carbon dioxide from the air through tiny pores called stomata, and absorbs water through its roots. These three ingredients are combined to produce glucose — sugar that fuels the plant's growth — and oxygen, which is released into the air for us to breathe. Without photosynthesis, almost no life on Earth could survive.",

    motivate:
      "You are doing an amazing job! Every page you read and every question you answer brings you one step closer to your goal. Learning is not a race — it is a journey, and you are already on the right path. Keep going, stay curious, and remember: small progress every day adds up to big results. CelikSense believes in you!",

    ocrExtract:
      "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of glucose. This process takes place mainly in the leaves, inside structures called chloroplasts, which contain a green pigment called chlorophyll. The overall equation for photosynthesis is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂.",

    riskAssess: JSON.stringify({
      riskScore: 38,
      riskLevel: "Low",
      flags: [],
      recommendation:
        "Learner is progressing well. Continue with current adaptive strategy.",
      generatedAt: new Date().toISOString(),
    }),
  };

  // ---------------------------------------------------------------------------
  // Language helper
  // ---------------------------------------------------------------------------
  function getLang() {
    return (localStorage.getItem("cs_lang") || "en").toLowerCase();
  }

  var STRINGS = {
    en: {
      bannerText: "🎟️ Demo Mode — No API key needed",
      exitBtn: "Exit Demo",
      toastOn: "Demo mode enabled. All AI responses are simulated.",
      toastOff: "Demo mode disabled.",
    },
    bm: {
      bannerText: "🎟️ Mod Demo — Tiada kunci API diperlukan",
      exitBtn: "Keluar Demo",
      toastOn: "Mod demo diaktifkan. Semua respons AI adalah simulasi.",
      toastOff: "Mod demo dinyahaktifkan.",
    },
  };

  function t(key) {
    var lang = getLang();
    var set = STRINGS[lang] || STRINGS.en;
    return set[key] || STRINGS.en[key] || key;
  }

  // ---------------------------------------------------------------------------
  // Toast helper (graceful — works even if CS.ui is unavailable)
  // ---------------------------------------------------------------------------
  function showToast(msg) {
    if (window.CS && window.CS.ui && typeof window.CS.ui.toast === "function") {
      window.CS.ui.toast(msg);
      return;
    }
    var el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);" +
      "background:#333;color:#fff;padding:10px 18px;border-radius:8px;" +
      "font-size:14px;z-index:99999;pointer-events:none;opacity:1;" +
      "transition:opacity 0.4s ease;";
    document.body.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      setTimeout(function () { el.parentNode && el.parentNode.removeChild(el); }, 500);
    }, 3000);
  }

  // ---------------------------------------------------------------------------
  // Banner
  // ---------------------------------------------------------------------------
  function injectDemoBanner() {
    if (document.getElementById(BANNER_ID)) return;

    var banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    banner.style.cssText =
      "position:fixed;top:0;left:0;width:100%;z-index:99998;" +
      "background:#f5a623;color:#1a1a1a;display:flex;align-items:center;" +
      "justify-content:center;gap:16px;padding:8px 16px;" +
      "font-family:inherit;font-size:14px;font-weight:600;" +
      "box-shadow:0 2px 8px rgba(0,0,0,0.18);";

    var label = document.createElement("span");
    label.textContent = t("bannerText");

    var btn = document.createElement("button");
    btn.textContent = t("exitBtn");
    btn.style.cssText =
      "background:#1a1a1a;color:#f5a623;border:none;border-radius:5px;" +
      "padding:4px 12px;cursor:pointer;font-size:13px;font-weight:700;" +
      "transition:background 0.2s;";
    btn.addEventListener("mouseenter", function () {
      btn.style.background = "#333";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.background = "#1a1a1a";
    });
    btn.addEventListener("click", function () {
      window.CS_DEMO.disable();
    });

    banner.appendChild(label);
    banner.appendChild(btn);
    document.body.insertBefore(banner, document.body.firstChild);

    // Push page content down so banner does not overlap
    document.body.style.paddingTop =
      (parseInt(document.body.style.paddingTop || "0", 10) + 42) + "px";
  }

  function removeDemoBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) {
      banner.parentNode.removeChild(banner);
      document.body.style.paddingTop =
        Math.max(0, parseInt(document.body.style.paddingTop || "0", 10) - 42) + "px";
    }
  }

  // ---------------------------------------------------------------------------
  // Gemini patcher
  // ---------------------------------------------------------------------------
  var _originalGeminiCall = null;

  function pickMockResponse(prompt) {
    var p = (prompt || "").toLowerCase();
    if (p.indexOf("quiz") !== -1) {
      return JSON.stringify(MOCK_RESPONSES.generateQuiz);
    }
    if (p.indexOf("explain") !== -1 || p.indexOf("terang") !== -1) {
      return MOCK_RESPONSES.explain;
    }
    if (p.indexOf("motivat") !== -1 || p.indexOf("semangat") !== -1) {
      return MOCK_RESPONSES.motivate;
    }
    if (
      p.indexOf("extract") !== -1 ||
      p.indexOf("ocr") !== -1 ||
      p.indexOf("read") !== -1
    ) {
      return MOCK_RESPONSES.ocrExtract;
    }
    if (p.indexOf("risk") !== -1 || p.indexOf("assess") !== -1) {
      return MOCK_RESPONSES.riskAssess;
    }
    // Default fallback
    return MOCK_RESPONSES.explain;
  }

  function patchGemini() {
    if (!window.CS || !window.CS.gemini) return;

    if (typeof window.CS.gemini._call === "function" && !_originalGeminiCall) {
      _originalGeminiCall = window.CS.gemini._call.bind(window.CS.gemini);
    }

    window.CS.gemini._call = function (prompt, options) {
      return new Promise(function (resolve) {
        // Simulate a short network delay for realism
        setTimeout(function () {
          resolve(pickMockResponse(prompt));
        }, 320 + Math.floor(Math.random() * 280));
      });
    };
  }

  function restoreGemini() {
    if (window.CS && window.CS.gemini && _originalGeminiCall) {
      window.CS.gemini._call = _originalGeminiCall;
      _originalGeminiCall = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Sample data preloader
  // ---------------------------------------------------------------------------
  function preloadSampleData() {
    Object.keys(SAMPLE_DATA).forEach(function (key) {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, SAMPLE_DATA[key]);
      }
    });
  }

  function clearSampleData() {
    Object.keys(SAMPLE_DATA).forEach(function (key) {
      // Only clear keys that still hold the demo value so we do not wipe user data
      var current = localStorage.getItem(key);
      if (current === SAMPLE_DATA[key]) {
        localStorage.removeItem(key);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  var CS_DEMO = {
    isDemoMode: function () {
      return localStorage.getItem(DEMO_FLAG_KEY) === "1";
    },

    enable: function () {
      localStorage.setItem(DEMO_FLAG_KEY, "1");
      preloadSampleData();
      injectDemoBanner();
      patchGemini();
      showToast(t("toastOn"));
    },

    disable: function () {
      localStorage.removeItem(DEMO_FLAG_KEY);
      removeDemoBanner();
      restoreGemini();
      clearSampleData();
      showToast(t("toastOff"));
    },

    /** Returns the full mock responses object for inspection / testing. */
    getMockResponses: function () {
      return MOCK_RESPONSES;
    },

    /** Force-pick a mock response by category key without needing live mode. */
    getMock: function (category) {
      return MOCK_RESPONSES[category] || null;
    },

    init: function () {
      if (CS_DEMO.isDemoMode()) {
        preloadSampleData();
        injectDemoBanner();
        patchGemini();
      }
    },
  };

  // ---------------------------------------------------------------------------
  // Auto-init on DOMContentLoaded
  // ---------------------------------------------------------------------------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      CS_DEMO.init();
    });
  } else {
    // DOM already ready (script loaded defer / at bottom of body)
    CS_DEMO.init();
  }

  // Export
  window.CS_DEMO = CS_DEMO;
})(window);
