/**
 * CelikSense AI – Learning Personalisation System
 * window.CS_PERSONALISE
 */
(function (window) {
  'use strict';

  var STORAGE_KEY = 'cs_learning_profile';
  var HISTORY_KEY = 'cs_agent_history';
  var SESSION_KEY = 'cs_session_start';

  var DEFAULT_PROFILE = {
    preferredMode: 'text',
    audioUsageCount: 0,
    ocrUsageCount: 0,
    typedTextCount: 0,
    signUsageCount: 0,
    brailleUsageCount: 0,
    avgSessionMinutes: 0,
    sessionCount: 0,
    preferredTimeOfDay: 'morning',
    accessibilityMode: 'general',
    preferredLang: 'en',
    quizScores: [],
    readingCompletionRate: 0,
    completedReadings: 0,
    mostUsedAgent: '',
    agentUsageCounts: {},
    contentTypePreference: 'text',
    readingDifficulty: 'medium',
    lastActive: '',
    streak: 0,
    totalReadingMinutes: 0,
    insights: [],
    recommendations: []
  };

  var AGENT_SLUGS = [
    'reading-companion',
    'ocr-agent',
    'blind-audio',
    'sign-language',
    'adhd-agent',
    'dyslexia-agent',
    'ai-librarian',
    'braille',
    'personalisation'
  ];

  function CS_PERSONALISE() {}

  CS_PERSONALISE.prototype.getProfile = function () {
    var stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      stored = null;
    }
    if (!stored) {
      return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    }
    var profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    for (var key in stored) {
      if (Object.prototype.hasOwnProperty.call(stored, key)) {
        profile[key] = stored[key];
      }
    }
    return profile;
  };

  CS_PERSONALISE.prototype.saveProfile = function (profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('CS_PERSONALISE: Could not save profile.', e);
    }
  };

  CS_PERSONALISE.prototype.trackAgentUse = function (agentName) {
    var profile = this.getProfile();
    if (!profile.agentUsageCounts) {
      profile.agentUsageCounts = {};
    }
    if (!profile.agentUsageCounts[agentName]) {
      profile.agentUsageCounts[agentName] = 0;
    }
    profile.agentUsageCounts[agentName]++;

    var maxCount = 0;
    var maxAgent = profile.mostUsedAgent || '';
    for (var agent in profile.agentUsageCounts) {
      if (Object.prototype.hasOwnProperty.call(profile.agentUsageCounts, agent)) {
        if (profile.agentUsageCounts[agent] > maxCount) {
          maxCount = profile.agentUsageCounts[agent];
          maxAgent = agent;
        }
      }
    }
    profile.mostUsedAgent = maxAgent;

    this.saveProfile(profile);
  };

  CS_PERSONALISE.prototype.trackMode = function (mode) {
    var profile = this.getProfile();

    if (mode === 'audio') {
      profile.audioUsageCount = (profile.audioUsageCount || 0) + 1;
    } else if (mode === 'ocr') {
      profile.ocrUsageCount = (profile.ocrUsageCount || 0) + 1;
    } else if (mode === 'text') {
      profile.typedTextCount = (profile.typedTextCount || 0) + 1;
    } else if (mode === 'sign') {
      profile.signUsageCount = (profile.signUsageCount || 0) + 1;
    } else if (mode === 'braille') {
      profile.brailleUsageCount = (profile.brailleUsageCount || 0) + 1;
    }

    var counts = {
      text: profile.typedTextCount || 0,
      audio: profile.audioUsageCount || 0,
      ocr: profile.ocrUsageCount || 0,
      sign: profile.signUsageCount || 0,
      braille: profile.brailleUsageCount || 0
    };

    var highestMode = profile.preferredMode;
    var highestCount = 0;
    for (var m in counts) {
      if (Object.prototype.hasOwnProperty.call(counts, m)) {
        if (counts[m] > highestCount) {
          highestCount = counts[m];
          highestMode = m;
        }
      }
    }
    profile.preferredMode = highestMode;

    this.saveProfile(profile);
  };

  CS_PERSONALISE.prototype.startSession = function () {
    try {
      sessionStorage.setItem(SESSION_KEY, String(Date.now()));
    } catch (e) {
      console.warn('CS_PERSONALISE: Could not set session start.', e);
    }

    var hour = new Date().getHours();
    var profile = this.getProfile();

    if (hour >= 6 && hour <= 11) {
      profile.preferredTimeOfDay = 'morning';
    } else if (hour >= 12 && hour <= 16) {
      profile.preferredTimeOfDay = 'afternoon';
    } else if (hour >= 17 && hour <= 20) {
      profile.preferredTimeOfDay = 'evening';
    } else {
      profile.preferredTimeOfDay = 'night';
    }

    this.saveProfile(profile);
  };

  CS_PERSONALISE.prototype.endSession = function () {
    var startStr = null;
    try {
      startStr = sessionStorage.getItem(SESSION_KEY);
    } catch (e) {
      return;
    }
    if (!startStr) return;

    var start = parseInt(startStr, 10);
    if (isNaN(start)) return;

    var durationMs = Date.now() - start;
    var durationMinutes = durationMs / 60000;

    var profile = this.getProfile();

    var prevAvg = profile.avgSessionMinutes || 0;
    var prevCount = profile.sessionCount || 0;
    var newCount = prevCount + 1;
    profile.avgSessionMinutes = ((prevAvg * prevCount) + durationMinutes) / newCount;
    profile.sessionCount = newCount;
    profile.totalReadingMinutes = (profile.totalReadingMinutes || 0) + durationMinutes;

    var today = new Date().toISOString().slice(0, 10);
    var lastActive = profile.lastActive || '';

    if (lastActive === today) {
      // same day, streak unchanged
    } else {
      var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastActive === yesterday) {
        profile.streak = (profile.streak || 0) + 1;
      } else {
        profile.streak = 1;
      }
      profile.lastActive = today;
    }

    this.saveProfile(profile);

    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  };

  CS_PERSONALISE.prototype.trackReadingCompletion = function (completed) {
    var profile = this.getProfile();
    if (completed) {
      profile.completedReadings = (profile.completedReadings || 0) + 1;
      var total = profile.sessionCount || 1;
      profile.readingCompletionRate = Math.round((profile.completedReadings / total) * 100);
    }
    this.saveProfile(profile);
  };

  CS_PERSONALISE.prototype.trackQuizScore = function (score) {
    var profile = this.getProfile();
    if (!profile.quizScores) profile.quizScores = [];
    profile.quizScores.push(score);
    if (profile.quizScores.length > 10) {
      profile.quizScores = profile.quizScores.slice(profile.quizScores.length - 10);
    }
    this.saveProfile(profile);
  };

  CS_PERSONALISE.prototype.generateInsights = function (lang) {
    var profile = this.getProfile();
    var isMs = lang === 'ms';
    var insights = [];

    if ((profile.audioUsageCount || 0) > 2) {
      insights.push(isMs
        ? 'Anda kerap menggunakan bacaan audio. Mod Audio akan dicadangkan secara automatik.'
        : 'You often use audio reading. Audio Mode will be recommended automatically.');
    }

    if ((profile.ocrUsageCount || 0) > 2) {
      insights.push(isMs
        ? 'Anda lebih suka bacaan OCR. Ejen OCR akan diletakkan dahulu.'
        : 'You prefer OCR reading. OCR Agent will be placed first.');
    }

    var avg = profile.avgSessionMinutes || 0;
    if (avg > 0 && avg < 12) {
      insights.push(isMs
        ? 'Anda lebih fokus semasa sesi bacaan pendek.'
        : 'You focus better during short reading sessions.');
    }

    if (avg > 20) {
      insights.push(isMs
        ? 'Anda boleh mengekalkan sesi bacaan yang lebih panjang. Kandungan lanjutan mungkin sesuai untuk anda.'
        : 'You can sustain longer reading sessions. Advanced content may suit you.');
    }

    var tod = profile.preferredTimeOfDay;
    if (tod === 'evening' || tod === 'night') {
      insights.push(isMs
        ? 'Anda biasanya belajar pada waktu malam. Peringatan malam dicadangkan.'
        : 'You usually study in the evening/night. Evening reminders are recommended.');
    }

    if (tod === 'morning') {
      insights.push(isMs
        ? 'Anda paling produktif pada waktu pagi. Sesi pagi dicadangkan.'
        : 'You are most productive in the morning. Morning sessions recommended.');
    }

    if (profile.accessibilityMode === 'adhd') {
      insights.push(isMs
        ? 'Sesi mikro-bacaan 10 minit adalah yang terbaik untuk anda.'
        : 'Short 10-minute micro-reading sessions work best for you.');
    }

    if (profile.accessibilityMode === 'dyslexia') {
      insights.push(isMs
        ? 'Anda membaca lebih baik dengan teks ringkas dan sokongan audio.'
        : 'You read better with simplified text and audio support.');
    }

    if (profile.accessibilityMode === 'blind') {
      insights.push(isMs
        ? 'Navigasi suara dan bacaan OCR adalah alat paling berkesan anda.'
        : 'Voice navigation and OCR reading are your most effective tools.');
    }

    if (profile.accessibilityMode === 'deaf') {
      insights.push(isMs
        ? 'Kandungan visual dan sokongan bahasa isyarat meningkatkan pembelajaran anda.'
        : 'Visual content and sign language support enhance your learning.');
    }

    if ((profile.readingCompletionRate || 0) > 70) {
      insights.push(isMs
        ? 'Konsisten yang baik! Anda menyelesaikan kebanyakan sesi bacaan.'
        : 'Great consistency! You complete most of your reading sessions.');
    }

    var scores = profile.quizScores || [];
    if (scores.length > 0) {
      var sum = 0;
      for (var i = 0; i < scores.length; i++) sum += scores[i];
      var avgScore = sum / scores.length;
      if (avgScore > 70) {
        insights.push(isMs
          ? 'Prestasi kuiz anda bagus. Pertimbangkan kandungan yang lebih mencabar.'
          : 'Your quiz performance is strong. Consider advancing to harder content.');
      }
    }

    var streak = profile.streak || 0;
    if (streak > 3) {
      insights.push(isMs
        ? 'Anda telah membaca selama ' + streak + ' hari berturut-turut. Teruskan!'
        : 'You have read for ' + streak + ' days in a row. Keep it up!');
    }

    return insights.slice(0, 5);
  };

  CS_PERSONALISE.prototype.generateRecommendations = function (lang) {
    var profile = this.getProfile();
    var isMs = lang === 'ms';
    var recs = [];

    if (profile.accessibilityMode === 'blind') {
      recs.push({
        icon: '🎙️',
        title: isMs ? 'Bacaan Suara Dahulu' : 'Voice-First Reading',
        desc: isMs ? 'Gunakan navigasi suara + OCR untuk hasil terbaik.' : 'Use voice navigation + OCR for best results.',
        link: 'blind-audio.html'
      });
    }

    if (profile.accessibilityMode === 'deaf') {
      recs.push({
        icon: '🖐️',
        title: isMs ? 'Sokongan Bahasa Isyarat' : 'Sign Language Support',
        desc: isMs ? 'Tukar bacaan kepada bahasa isyarat BIM.' : 'Convert readings to BIM sign language.',
        link: 'sign-language.html'
      });
    }

    if (profile.accessibilityMode === 'adhd') {
      recs.push({
        icon: '⚡',
        title: isMs ? 'Sesi Fokus 10 Minit' : '10-Minute Focus Sessions',
        desc: isMs ? 'Gunakan Mod Fokus ADHD untuk mikro-bacaan.' : 'Use ADHD Focus Mode for micro-reading.',
        link: 'adhd-agent.html'
      });
    }

    if (profile.accessibilityMode === 'dyslexia') {
      recs.push({
        icon: '📖',
        title: isMs ? 'Bacaan Mesra Disleksia' : 'Dyslexia-Friendly Reading',
        desc: isMs ? 'Fon OpenDyslexic + audio + lapisan warna.' : 'OpenDyslexic font + audio + color overlay.',
        link: 'dyslexia-agent.html'
      });
    }

    if ((profile.ocrUsageCount || 0) > (profile.audioUsageCount || 0)) {
      recs.push({
        icon: '📷',
        title: isMs ? 'Ejen Bacaan OCR' : 'OCR Reading Agent',
        desc: isMs ? 'Anda lebih suka OCR. Lancarkan ejen OCR terus.' : 'You prefer OCR. Launch OCR agent directly.',
        link: 'ocr-agent.html'
      });
    }

    if ((profile.audioUsageCount || 0) > 2) {
      recs.push({
        icon: '🔊',
        title: isMs ? 'Mod Bacaan Audio' : 'Audio Reading Mode',
        desc: isMs ? 'Mod pilihan anda. Pergi ke Rakan Membaca.' : 'Your preferred mode. Go to Reading Companion.',
        link: 'reading-companion.html'
      });
    }

    var avg = profile.avgSessionMinutes || 0;
    if (avg > 0 && avg < 12) {
      recs.push({
        icon: '⏱️',
        title: isMs ? 'Strategi Sesi Pendek' : 'Short Session Strategy',
        desc: isMs ? 'Sesi di bawah 12 minit untuk fokus terbaik.' : 'Keep sessions under 12 minutes for best focus.',
        link: 'adhd-agent.html'
      });
    }

    recs.push({
      icon: '🤖',
      title: isMs ? 'Pustakawan AI' : 'AI Librarian',
      desc: isMs ? 'Cari bahan bacaan yang diperibadikan.' : 'Find personalised reading materials.',
      link: 'ai-librarian.html'
    });

    return recs;
  };

  CS_PERSONALISE.prototype.getAdaptiveDashboardOrder = function () {
    var profile = this.getProfile();
    var counts = profile.agentUsageCounts || {};

    var slugs = AGENT_SLUGS.slice();
    slugs.sort(function (a, b) {
      var countA = counts[a] || 0;
      var countB = counts[b] || 0;
      return countB - countA;
    });

    return slugs;
  };

  CS_PERSONALISE.prototype.getTodayRecommendation = function (lang) {
    var profile = this.getProfile();
    var isMs = lang === 'ms';
    var agent = profile.mostUsedAgent || 'AI Librarian';

    var agentDisplayNames = {
      'reading-companion': isMs ? 'Rakan Membaca' : 'Reading Companion',
      'ocr-agent': isMs ? 'Ejen OCR' : 'OCR Agent',
      'blind-audio': isMs ? 'Sokongan Audio Buta' : 'Blind Audio Support',
      'sign-language': isMs ? 'Bahasa Isyarat' : 'Sign Language',
      'adhd-agent': isMs ? 'Ejen ADHD' : 'ADHD Agent',
      'dyslexia-agent': isMs ? 'Ejen Disleksia' : 'Dyslexia Agent',
      'ai-librarian': isMs ? 'Pustakawan AI' : 'AI Librarian',
      'braille': isMs ? 'Braille' : 'Braille',
      'personalisation': isMs ? 'Peribadikan' : 'Personalisation'
    };

    var displayName = agentDisplayNames[agent] || agent;

    if (isMs) {
      return 'Cadangan untuk anda hari ini: ' + displayName;
    }
    return 'Recommended for you today: ' + displayName;
  };

  CS_PERSONALISE.prototype.getTeacherInsights = function (lang) {
    var profile = this.getProfile();
    var isMs = lang === 'ms';
    var insights = [];

    var modeLabel = profile.preferredMode || 'text';
    insights.push(isMs
      ? 'Pelajar lebih suka bacaan berasaskan ' + modeLabel + '.'
      : 'The learner prefers ' + modeLabel + '-based reading.');

    var avg = Math.round(profile.avgSessionMinutes || 0);
    if (avg > 0 && avg < 15) {
      insights.push(isMs
        ? 'Pelajar menyelesaikan lebih banyak tugasan apabila sesi di bawah 15 minit.'
        : 'The learner completes more tasks when sessions are under 15 minutes.');
    }

    if ((profile.ocrUsageCount || 0) > (profile.typedTextCount || 0)) {
      insights.push(isMs
        ? 'Pelajar menggunakan OCR lebih kerap berbanding teks taip.'
        : 'The learner uses OCR more frequently than typed text.');
    }

    if (profile.preferredMode !== 'audio') {
      insights.push(isMs
        ? 'Pelajar mungkin mendapat manfaat daripada sokongan ringkasan visual.'
        : 'The learner may benefit from visual summary support.');
    }

    insights.push(isMs
      ? 'Purata tempoh sesi: ' + avg + ' minit.'
      : 'Average session duration: ' + avg + ' minutes.');

    insights.push(isMs
      ? 'Kadar penyelesaian bacaan: ' + (profile.readingCompletionRate || 0) + '%.'
      : 'Reading completion rate: ' + (profile.readingCompletionRate || 0) + '%.');

    var mostUsed = profile.mostUsedAgent || (isMs ? 'Tiada' : 'None');
    insights.push(isMs
      ? 'Ejen paling kerap digunakan: ' + mostUsed + '.'
      : 'Most used agent: ' + mostUsed + '.');

    var accMode = profile.accessibilityMode || 'general';
    insights.push(isMs
      ? 'Profil kebolehcapaian yang dicadangkan: ' + accMode + '.'
      : 'Recommended accessibility profile: ' + accMode + '.');

    return insights;
  };

  CS_PERSONALISE.prototype.resetProfile = function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    window.location.reload();
  };

  CS_PERSONALISE.prototype.injectStyles = function () {
    if (document.getElementById('cs-personalise-styles')) return;
    var style = document.createElement('style');
    style.id = 'cs-personalise-styles';
    style.textContent = [
      '.ps-card { background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(16,185,129,0.05)); border:1.5px solid rgba(99,102,241,0.2); border-radius:18px; padding:22px; margin:12px 0; }',
      '.ps-card-title { font-size:16px; font-weight:800; color:#1e293b; margin-bottom:6px; }',
      '.ps-insight { background:#f0fdf4; border-left:4px solid #10b981; border-radius:8px; padding:10px 14px; margin:7px 0; font-size:14px; color:#065f46; }',
      '.ps-rec { display:flex; align-items:flex-start; gap:14px; background:#fff; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px; margin:8px 0; transition:box-shadow .2s; }',
      '.ps-rec:hover { box-shadow:0 4px 18px rgba(99,102,241,0.12); }',
      '.ps-rec-icon { font-size:28px; flex-shrink:0; }',
      '.ps-rec-title { font-weight:800; color:#1e293b; font-size:15px; }',
      '.ps-rec-desc { font-size:13px; color:#64748b; margin-top:3px; }',
      '.ps-rec-link { display:inline-block; margin-top:8px; background:#6366f1; color:#fff; padding:6px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; }',
      '.ps-rec-link:hover { background:#4f46e5; }',
      '.ps-today-banner { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border-radius:16px; padding:16px 22px; margin:0 0 18px; font-weight:800; font-size:15px; display:flex; align-items:center; gap:10px; }',
      '.ps-stat { text-align:center; }',
      '.ps-stat-num { font-size:28px; font-weight:900; color:#6366f1; }',
      '.ps-stat-label { font-size:12px; color:#64748b; margin-top:2px; }',
      '.ps-mode-badge { display:inline-block; background:#ddd6fe; color:#4f46e5; padding:3px 12px; border-radius:20px; font-size:12px; font-weight:700; }',
      '.ps-privacy { background:#fef9c3; border:1px solid #fde68a; border-radius:10px; padding:10px 16px; font-size:13px; color:#78350f; margin:16px 0; }',
      '.ps-teacher-insight { background:#f0f9ff; border-left:4px solid #0ea5e9; border-radius:8px; padding:10px 14px; margin:7px 0; font-size:14px; color:#0c4a6e; }'
    ].join('\n');
    document.head.appendChild(style);
  };

  CS_PERSONALISE.prototype.init = function () {
    var self = this;

    this.startSession();

    window.addEventListener('beforeunload', function () {
      self.endSession();
    });

    var profile = this.getProfile();
    var accMode = profile.accessibilityMode || 'general';
    if (document.body) {
      document.body.classList.add('cs-mode-' + accMode);
    }

    this.injectStyles();
  };

  window.CS_PERSONALISE = new CS_PERSONALISE();

}(window));
