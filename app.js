/* =====================================================================
   BABBLE BOX ACADEMY — SHARED APP LOGIC (app.js)
   حمّل هذا الملف في كل صفحات الموقع بسطر واحد قبل إغلاق </body>:
   <script src="app.js" defer></script>

   كل دالة هنا "دفاعية" (defensive): بتتأكد إن العنصر موجود في الصفحة
   قبل ما تتعامل معاه. يعني تقدر تحط الملف ده في أي صفحة (index أو
   أي unit) وهيشتغل بس مع العناصر الموجودة فعلاً، من غير أخطاء في الـ console.
   ===================================================================== */

(function () {
  'use strict';

  /* =====================================================================
     0) SECURITY HELPERS — أدوات أمان أساسية يستخدمها باقي الكود
     ===================================================================== */
  const Security = {
    // تنظيف أي نص قبل عرضه كـ HTML (يمنع هجمات XSS البسيطة)
    escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = String(str ?? '');
      return div.innerHTML;
    },

    // تحقق بسيط من صيغة البريد الإلكتروني قبل الإرسال
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
    },

    // Rate limiting بسيط على المتصفح: يمنع إرسال نفس الفورم أكتر من مرة
    // كل فترة زمنية معينة (يقلل من السبام والإرسال المتكرر بالخطأ)
    canSubmit(key, cooldownMs) {
      const last = Number(sessionStorage.getItem('rl_' + key) || 0);
      const now = Date.now();
      if (now - last < cooldownMs) return false;
      sessionStorage.setItem('rl_' + key, String(now));
      return true;
    },

    // فحص حقل الـ Honeypot: لو اتملى يبقى غالباً بوت
    isHoneypotTriggered(form) {
      const hp = form.querySelector('.hp-field input, [data-honeypot]');
      return !!(hp && hp.value && hp.value.trim().length > 0);
    }
  };
  window.BabbleSecurity = Security; // إتاحتها لأي صفحة تحتاجها

  /* =====================================================================
     1) ANALYTICS HOOK — نقطة واحدة لإرسال أي حدث تحليلي
     ===================================================================== */
  // بدّل جسم هذه الدالة لاحقاً بأداة تحليلات حقيقية (Plausible / GA4 / Umami)
  // بدون ما تغيّر أي مكان تاني في الكود بيستدعيها.
  function trackEvent(eventName, params) {
    try {
      if (typeof window.plausible === 'function') {
        window.plausible(eventName, { props: params || {} });
      } else if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      } else {
        // Fallback: تسجيل محلي فقط أثناء التطوير (لا يرسل أي بيانات لأي مكان)
        console.debug('[analytics]', eventName, params || {});
      }
    } catch (e) { /* لا تكسر الموقع أبداً بسبب خطأ في التحليلات */ }
  }
  window.trackEvent = trackEvent;

  /* =====================================================================
     2) اللغة (AR / EN)
     ===================================================================== */
  const htmlEl = document.documentElement;
  let currentLang = localStorage.getItem('babbleLang') || 'ar';

  function applyLanguage(lang) {
    currentLang = lang;
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('babbleLang', lang);

    document.querySelectorAll('[data-lang-ar][data-lang-en]').forEach((el) => {
      const text = lang === 'ar' ? el.getAttribute('data-lang-ar') : el.getAttribute('data-lang-en');
      el.textContent = text;
    });

    const toggle = document.getElementById('lang-toggle');
    if (toggle) toggle.textContent = lang === 'ar' ? 'AR | EN' : 'EN | AR';
  }
  window.applyLanguage = applyLanguage;

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
      trackEvent('language_toggle', { lang: currentLang });
    });
  }
  applyLanguage(currentLang);

  /* =====================================================================
     3) الوضع الداكن / الفاتح
     ===================================================================== */
  const themeToggle = document.getElementById('theme-toggle') || document.getElementById('themeToggle');
  const themeIcon = document.getElementById('theme-icon');
  let currentTheme = localStorage.getItem('babbleTheme') || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    document.body.classList.toggle('light-mode', theme === 'light');
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
    else if (themeToggle) themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('babbleTheme', theme);
  }
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  /* =====================================================================
     4) قائمة الموبايل
     ===================================================================== */
  const burgerBtn = document.getElementById('burger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  /* =====================================================================
     5) شاشة البداية (Splash) + رسالة الترحيب (Toast)
     ===================================================================== */
  window.addEventListener('load', () => {
    const splash = document.getElementById('splash');
    const toast = document.getElementById('toast');
    if (splash) {
      setTimeout(() => {
        splash.classList.add('fade-out');
        if (toast) {
          setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
          }, 700);
        }
      }, 1200);
    } else if (toast) {
      setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
      }, 500);
    }
  });

  /* =====================================================================
     6) العدادات المتحركة (Animated Counters)
     ===================================================================== */
  const counters = document.querySelectorAll('.counter-num');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1600;
      const startTime = performance.now();
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = '+' + value.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
        if (progress < 1) requestAnimationFrame(step);
        else counter.textContent = '+' + target.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
      }
      requestAnimationFrame(step);
    });
  }

  const heroEl = document.getElementById('hero');
  if (heroEl && counters.length) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      });
    }, { threshold: 0.4 });
    heroObserver.observe(heroEl);
  }

  /* =====================================================================
     7) Reveal on Scroll
     ===================================================================== */
  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* =====================================================================
     8) حلقات التقدم (Progress Rings) — تُقرأ من localStorage
     ===================================================================== */
  function initProgressRings() {
    document.querySelectorAll('.ring-fg').forEach((circle) => {
      const key = circle.getAttribute('data-progress-key');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = circumference;

      let stored = localStorage.getItem(key);
      if (stored === null) {
        stored = '0';
        localStorage.setItem(key, stored);
      }
      const percent = Math.max(0, Math.min(100, parseInt(stored, 10) || 0));
      const offset = circumference - (percent / 100) * circumference;

      circle.style.strokeDashoffset = circumference;
      setTimeout(() => { circle.style.strokeDashoffset = offset; }, 300);

      const label = document.querySelector('[data-percent-for="' + key + '"]');
      if (label) label.textContent = percent + '%';
    });
  }
  initProgressRings();

  /* =====================================================================
     9) الكونفيتي (بدون مكتبات)
     ===================================================================== */
  function launchConfetti() {
    const colors = ['#FFD700', '#ffffff', '#f1c40f', '#fff2a8', '#e0b400'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 1.8) + 's';
      piece.style.opacity = String(0.7 + Math.random() * 0.3);
      piece.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }
  }
  window.launchConfetti = launchConfetti;

  const ctaStart = document.getElementById('cta-start');
  if (ctaStart) {
    ctaStart.addEventListener('click', () => {
      launchConfetti();
      trackEvent('cta_start_click');
      const levelsSection = document.getElementById('levels');
      if (levelsSection) levelsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* =====================================================================
     10) نموذج التواصل / الشكاوى — إرسال آمن عبر Formspree
     ===================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const messages = {
        sending: { ar: 'جارٍ الإرسال...', en: 'Sending...' },
        ok: { ar: '✅ تم إرسال رسالتك بنجاح!', en: '✅ Your message was sent successfully!' },
        err: { ar: '❌ حدث خطأ، حاول مرة أخرى.', en: '❌ Something went wrong, please try again.' },
        spam: { ar: '⚠️ تم رفض الطلب.', en: '⚠️ Request rejected.' },
        rate: { ar: '⏳ من فضلك انتظر قليلاً قبل الإرسال مرة أخرى.', en: '⏳ Please wait a moment before submitting again.' },
        invalidEmail: { ar: '⚠️ من فضلك أدخل بريداً إلكترونياً صحيحاً.', en: '⚠️ Please enter a valid email address.' },
      };

      // 1) فحص الـ Honeypot (حماية من البوتات)
      if (Security.isHoneypotTriggered(contactForm)) {
        formStatus.className = 'form-status err';
        formStatus.textContent = messages.spam[currentLang];
        return; // لا يرسل أي شيء فعلياً
      }

      // 2) فحص Rate limiting (منع الإرسال المتكرر خلال 20 ثانية)
      if (!Security.canSubmit('contact_form', 20000)) {
        formStatus.className = 'form-status err';
        formStatus.textContent = messages.rate[currentLang];
        return;
      }

      // 3) فحص صحة البريد الإلكتروني قبل الإرسال
      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && !Security.isValidEmail(emailField.value)) {
        formStatus.className = 'form-status err';
        formStatus.textContent = messages.invalidEmail[currentLang];
        return;
      }

      const formData = new FormData(contactForm);
      formStatus.className = 'form-status';
      formStatus.textContent = messages.sending[currentLang];

      const submitBtn = contactForm.querySelector('.submit-btn');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          formStatus.className = 'form-status ok';
          formStatus.textContent = messages.ok[currentLang];
          contactForm.reset();
          trackEvent('contact_form_submit', { status: 'ok' });
        } else {
          formStatus.className = 'form-status err';
          formStatus.textContent = messages.err[currentLang];
          trackEvent('contact_form_submit', { status: 'error' });
        }
      } catch (err) {
        formStatus.className = 'form-status err';
        formStatus.textContent = messages.err[currentLang];
        trackEvent('contact_form_submit', { status: 'network_error' });
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* =====================================================================
     11) حماية بسيطة من محاولات الـ Self-XSS عبر الـ Console
     ===================================================================== */
  try {
    const warnStyle = 'color:#e74c3c;font-size:22px;font-weight:800;';
    console.log('%c⚠️ توقف!', warnStyle);
    console.log(
      '%cهذه الميزة في المتصفح مخصصة للمطورين. لو حد طلب منك تنسخ/تلصق كود هنا للحصول على مميزات أو اختراق حساب، فهذه عملية احتيال (Self-XSS) وهتعرض حسابك للخطر.',
      'font-size:14px;color:#fff;background:#111;padding:6px;border-radius:6px;'
    );
  } catch (e) { /* بيئات بدون console.log نادرة، تجاهل بأمان */ }

})();