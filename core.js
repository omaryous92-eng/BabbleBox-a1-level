(function() {
    "use strict";

    // ============================================================
    // 1. البيانات (المستويات، الكتب، الخطط)
    // ============================================================
    const levelsData = [
        { id: 'A1', label: 'A1', title: 'مبتدئ', sub: 'Beginner – ابدأ من الصفر', emoji: '🥚', active: true, link: 'unit1.html' },
        { id: 'A2', label: 'A2', title: 'أساسي', sub: 'Elementary – قريباً Soon™️', emoji: '🐣', active: false, link: '#' },
        { id: 'B1', label: 'B1', title: 'متوسط', sub: 'Intermediate – قريباً', emoji: '🐥', active: false, link: '#' },
        { id: 'B2', label: 'B2', title: 'فوق المتوسط', sub: 'Upper Intermediate – قريباً', emoji: '🦅', active: false, link: '#' },
        { id: 'C1', label: 'C1', title: 'متقدم', sub: 'Advanced – قريباً', emoji: '🐉', active: false, link: '#' },
        { id: 'C2', label: 'C2', title: 'متقن', sub: 'Proficient – قريباً', emoji: '👑', active: false, link: '#' }
    ];

    const booksData = [
        { id: 'book1', title: 'The Ultimate Verb Guide – 50 فعل', desc: 'أشهر 50 فعل مع التصريفات والأمثلة', emoji: '📘', available: true, link: '#' },
        { id: 'book2', title: 'كتب جديدة – قريباً', desc: 'المزيد من الكتب قيد الإعداد', emoji: '📚', available: false, link: '#' }
    ];

    const plansData = [
        { id: 'A1', label: 'A1', title: 'أساسياتك الأولى – 12 وحدة – من التحية للماضي البسيط', desc: 'ستتعلم تقديم نفسك، التحدث عن عائلتك، روتينك اليومي، الطعام، الملابس، الطقس، والأماكن.', motivation: '💪 رحلتك لتعلم الإنجليزية تبدأ اليوم. لا تؤجل!' },
        { id: 'A2', label: 'A2', title: 'التوسع في الأزمنة – محادثات أطول', desc: 'التوسع في الأزمنة، تكوين جمل أطول، فهم المحادثات البسيطة.', motivation: '🚀 أنت على الطريق الصحيح. لا تتوقف!' },
        { id: 'B1', label: 'B1', title: 'الطلاقة المتوسطة – التعبير عن الرأي', desc: 'التعبير عن الرأي، التعامل مع مواقف السفر والعمل، مناقشة المواضيع اليومية.', motivation: '🌟 كل كلمة تتعلمها تقربك من حلمك.' },
        { id: 'B2', label: 'B2', title: 'الاحتراف – مناقشة الأفكار المعقدة', desc: 'مناقشة الأفكار المعقدة، كتابة المقالات، فهم الأفلام بدون ترجمة.', motivation: '🔥 الالتزام اليومي هو سر الاحتراف.' },
        { id: 'C1', label: 'C1', title: 'الطلاقة المتقدمة – استخدام أكاديمي ومهني', desc: 'استخدام اللغة بشكل أكاديمي ومهني، فهم الفروق الثقافية الدقيقة.', motivation: '🏆 أنت في القمة. استمر في التحدي.' },
        { id: 'C2', label: 'C2', title: 'الإتقان – التحدث كمتحدث أصلي', desc: 'التحدث كمتحدث أصلي، الكتابة الإبداعية، الخطابة.', motivation: '👑 لا سقف لطموحك.' }
    ];

    // ============================================================
    // 2. عناصر DOM
    // ============================================================
    const levelsGrid = document.getElementById('levelsGrid');
    const booksGrid = document.getElementById('booksGrid');
    const tabsContainer = document.getElementById('tabsContainer');
    const tabTitle = document.getElementById('tabTitle');
    const tabDesc = document.getElementById('tabDesc');
    const tabMotivation = document.getElementById('tabMotivation');

    const darkToggle = document.getElementById('darkModeToggle');
    const sideDarkToggle = document.getElementById('sideDarkToggle');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const body = document.body;

    // ============================================================
    // 3. دوال التوليد
    // ============================================================
    function renderLevels() {
        if (!levelsGrid) return;
        levelsGrid.innerHTML = '';
        levelsData.forEach(level => {
            const card = document.createElement('div');
            card.className = 'level-card reveal';
            card.dataset.level = level.id;
            card.innerHTML = `
                <div class="emoji-big">${level.emoji}</div>
                <div class="level-title">${level.label} – ${level.title}</div>
                <div class="level-sub">${level.sub}</div>
                <button class="btn-level" ${!level.active ? 'disabled' : ''} data-level="${level.id}">
                    ${level.active ? 'ابدأ' : '🔒 قريباً'}
                </button>
            `;
            levelsGrid.appendChild(card);

            const btn = card.querySelector('.btn-level');
            if (btn && !btn.disabled) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    window.location.href = level.link;
                });
            }
        });
    }

    function renderBooks() {
        if (!booksGrid) return;
        booksGrid.innerHTML = '';
        booksData.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card reveal';
            card.innerHTML = `
                <div class="book-emoji">${book.emoji}</div>
                <div class="book-title">${book.title}</div>
                <div class="book-desc">${book.desc}</div>
                <button class="btn-download" ${!book.available ? 'disabled' : ''} data-link="${book.link}">
                    ${book.available ? '📥 تحميل مجاني' : '⏳ قريباً'}
                </button>
            `;
            booksGrid.appendChild(card);

            const btn = card.querySelector('.btn-download');
            if (btn && !btn.disabled) {
                btn.addEventListener('click', function() {
                    const link = this.dataset.link;
                    if (link && link !== '#') window.open(link, '_blank');
                    else alert('رابط التحميل سيتم إضافته قريباً.');
                });
            }
        });
    }

    function renderTabs() {
        if (!tabsContainer) return;
        tabsContainer.innerHTML = '';
        plansData.forEach((plan, index) => {
            const btn = document.createElement('button');
            btn.className = `tab-btn reveal ${index === 0 ? 'active-tab' : ''}`;
            btn.textContent = plan.label;
            btn.dataset.index = index;
            btn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.index);
                const selected = plansData[idx];
                if (tabTitle) tabTitle.textContent = selected.title;
                if (tabDesc) tabDesc.textContent = selected.desc;
                if (tabMotivation) tabMotivation.textContent = selected.motivation;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
                this.classList.add('active-tab');
                localStorage.setItem('selectedTab', idx);
            });
            tabsContainer.appendChild(btn);
        });

        const savedTab = localStorage.getItem('selectedTab');
        if (savedTab !== null && plansData[parseInt(savedTab)]) {
            const btns = tabsContainer.querySelectorAll('.tab-btn');
            if (btns[parseInt(savedTab)]) btns[parseInt(savedTab)].click();
        } else {
            const first = tabsContainer.querySelector('.tab-btn');
            if (first) first.click();
        }
    }

    // ============================================================
    // 4. دارك / لايت مود
    // ============================================================
    function toggleDarkMode() {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('darkMode', isLight ? 'light' : 'dark');
        if (darkToggle) darkToggle.textContent = isLight ? '☀️' : '🌓';
        if (sideDarkToggle) sideDarkToggle.textContent = isLight ? '☀️ الوضع الفاتح' : '🌓 الوضع الداكن';
    }

    function loadDarkMode() {
        const mode = localStorage.getItem('darkMode');
        if (mode === 'light') {
            body.classList.add('light-mode');
            if (darkToggle) darkToggle.textContent = '☀️';
            if (sideDarkToggle) sideDarkToggle.textContent = '☀️ الوضع الفاتح';
        } else {
            body.classList.remove('light-mode');
            if (darkToggle) darkToggle.textContent = '🌓';
            if (sideDarkToggle) sideDarkToggle.textContent = '🌓 الوضع الداكن';
        }
    }

    // ============================================================
    // 5. القائمة الجانبية
    // ============================================================
    function openSideMenu() { if (sideMenu) sideMenu.classList.add('open'); }
    function closeSideMenu() { if (sideMenu) sideMenu.classList.remove('open'); }

    // ============================================================
    // 6. Scroll Reveal
    // ============================================================
    function handleScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 80) {
                el.classList.add('visible');
            }
        });
    }

    // ============================================================
    // 7. تخزين maxUnitUnlocked
    // ============================================================
    function initStorage() {
        if (!localStorage.getItem('maxUnitUnlocked')) {
            localStorage.setItem('maxUnitUnlocked', '1');
        }
    }

    // ============================================================
    // 8. التهيئة
    // ============================================================
    document.addEventListener('DOMContentLoaded', function() {
        renderLevels();
        renderBooks();
        renderTabs();
        loadDarkMode();
        initStorage();

        setTimeout(handleScrollReveal, 200);

        if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
        if (sideDarkToggle) {
            sideDarkToggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDarkMode();
                closeSideMenu();
            });
        }
        if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSideMenu);
        if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeSideMenu);

        if (sideMenu) {
            sideMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeSideMenu);
            });
        }

        window.addEventListener('scroll', handleScrollReveal);
        window.addEventListener('resize', handleScrollReveal);
    });

})();
