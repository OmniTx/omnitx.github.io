// Imran Ahmed - Portfolio Scripts
// Core Theme & Utilities
(function () {
    const stored = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === null ? systemPrefersDark : stored === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    const sun = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');

    function applyIcons(dark) {
        if (sun) sun.style.display = dark ? 'none' : 'block';
        if (moon) moon.style.display = dark ? 'block' : 'none';
    }
    applyIcons(isDark);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setGlobalTheme(next);
        });
    }

    window.setGlobalTheme = function (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        applyIcons(theme === 'dark');
    };
})();

// Dynamic Experience Calculation (from Nov 2019)
(function () {
    const now = new Date();
    const proStart = new Date(2019, 10, 1);
    const years = Math.floor((now - proStart) / (1000 * 60 * 60 * 24 * 365.2425));
    const expEl = document.getElementById('exp-years');
    if (expEl && years > 0) {
        expEl.textContent = `${years}+`;
    }
    const yrEl = document.getElementById('yr');
    if (yrEl) yrEl.textContent = now.getFullYear();
})();

// Animated Number Count-Up
function animateValue(el, target, duration = 1200) {
    if (!el || isNaN(target) || target <= 0) {
        if (el) el.textContent = target || '0';
        return;
    }
    let start = 0;
    const startTime = performance.now();
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        el.textContent = current;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }
    requestAnimationFrame(update);
}

// GitHub Stats Fetch
async function loadGitHub() {
    const ids = ['gh-repos', 'gh-followers', 'gh-stars', 'gh-forks'];
    try {
        const res = await fetch('https://api.github.com/users/omnitx');
        if (!res.ok) throw new Error('user fetch failed');
        const user = await res.json();

        const reposRes = await fetch('https://api.github.com/users/omnitx/repos?per_page=100');
        if (!reposRes.ok) throw new Error('repos fetch failed');
        const repos = await reposRes.json();

        const reposCount = user.public_repos ?? 0;
        const followersCount = user.followers ?? 0;
        let starsCount = 0;
        let forksCount = 0;

        if (Array.isArray(repos)) {
            starsCount = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
            forksCount = repos.reduce((a, r) => a + (r.forks_count || 0), 0);
        }

        animateValue(document.getElementById('gh-repos'), reposCount);
        animateValue(document.getElementById('gh-followers'), followersCount);
        animateValue(document.getElementById('gh-stars'), starsCount);
        animateValue(document.getElementById('gh-forks'), forksCount);
    } catch (e) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.textContent.trim() === '…') el.textContent = '0';
        });
    }
}
loadGitHub();

// Email Copy Helper
const copyBtn = document.getElementById('copy-email');
if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const email = 'imranomnitx@duck.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => showCopied());
        } else {
            const ta = document.createElement('textarea');
            ta.value = email;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                showCopied();
            } catch (err) {}
            document.body.removeChild(ta);
        }
    });
}

function showCopied() {
    if (!copyBtn) return;
    copyBtn.textContent = 'Copied';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
}

// Scope Dispatch Builder
function getScopeText() {
    const focus = document.getElementById('scope-focus')?.value || 'Technical Build';
    const notes = (document.getElementById('scope-notes')?.value || '').trim() || 'Looking to discuss a technical scope.';
    return `Hi Imran,\nFocus: ${focus}\nDetails: ${notes}`;
}

const sendWaBtn = document.getElementById('send-wa');
if (sendWaBtn) {
    sendWaBtn.addEventListener('click', () => {
        const msg = encodeURIComponent(getScopeText());
        window.open(`https://wa.me/8801840538790?text=${msg}`, '_blank', 'noopener');
    });
}

const sendMailBtn = document.getElementById('send-mail');
if (sendMailBtn) {
    sendMailBtn.addEventListener('click', () => {
        const focus = document.getElementById('scope-focus')?.value || 'Technical Build';
        const subject = encodeURIComponent(`Technical Scope: ${focus}`);
        const body = encodeURIComponent(getScopeText());
        window.location.href = `mailto:imranomnitx@duck.com?subject=${subject}&body=${body}`;
    });
}

// Command Palette (Cmd+K / Ctrl+K)
const cmdOverlay = document.getElementById('cmd-overlay');
const cmdSearch = document.getElementById('cmd-search');
const cmdList = document.getElementById('cmd-list');

const commands = [
    { label: 'Jump to Skills', hint: '#skills', action: () => { location.hash = '#skills'; } },
    { label: 'Jump to Projects', hint: '#projects', action: () => { location.hash = '#projects'; } },
    { label: 'Jump to Experience', hint: '#experience', action: () => { location.hash = '#experience'; } },
    { label: 'Jump to Open Source', hint: '#github', action: () => { location.hash = '#github'; } },
    { label: 'Jump to Contact', hint: '#contact', action: () => { location.hash = '#contact'; } },
    { label: 'Download Resume (PDF)', hint: 'CV', action: () => { const a = document.createElement('a'); a.href = '/Imran%20Ahmed%20-%20Resume.pdf'; a.download = ''; a.click(); } },
    { label: 'Toggle Light / Dark Theme', hint: 'Theme', action: () => { const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; setGlobalTheme(next); } },
    { label: 'Copy Email Address', hint: 'Copy', action: () => { if (copyBtn) copyBtn.click(); } },
    { label: 'Open GitHub (@omnitx)', hint: 'External', action: () => window.open('https://github.com/omnitx', '_blank', 'noopener') },
    { label: 'Chat on WhatsApp', hint: 'External', action: () => window.open('https://wa.me/8801840538790', '_blank', 'noopener') }
];

let filteredCmds = [];

function renderCommands(q = '') {
    if (!cmdList) return;
    filteredCmds = commands.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
    cmdList.innerHTML = filteredCmds.map((c, i) => `
        <button type="button" class="cmd-item" data-idx="${i}">
            <span>${c.label}</span>
            <span style="opacity:0.5;font-size:0.6rem;">${c.hint}</span>
        </button>
    `).join('');

    cmdList.querySelectorAll('.cmd-item').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            cmdOverlay.classList.remove('open');
            filteredCmds[i].action();
        });
    });
}

function openCmd() {
    if (!cmdOverlay || !cmdSearch) return;
    cmdSearch.value = '';
    renderCommands();
    cmdOverlay.classList.add('open');
    setTimeout(() => cmdSearch.focus(), 30);
}

const openCmdBtn = document.getElementById('open-cmd');
if (openCmdBtn) openCmdBtn.addEventListener('click', openCmd);
if (cmdSearch) {
    cmdSearch.addEventListener('input', e => renderCommands(e.target.value));
    cmdSearch.addEventListener('keydown', e => {
        if (e.key === 'Enter' && filteredCmds.length > 0) {
            e.preventDefault();
            cmdOverlay.classList.remove('open');
            filteredCmds[0].action();
        }
    });
}
if (cmdOverlay) {
    cmdOverlay.addEventListener('click', e => {
        if (e.target === cmdOverlay) cmdOverlay.classList.remove('open');
    });
}

document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdOverlay && cmdOverlay.classList.contains('open')) {
            cmdOverlay.classList.remove('open');
        } else {
            openCmd();
        }
    } else if (e.key === 'Escape') {
        if (cmdOverlay) cmdOverlay.classList.remove('open');
    }
});

// Custom Cursor (Only Active on Ultra-Wide Screens > 1600px)
(function () {
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    const isUltraWide = window.matchMedia('(min-width: 1600px)').matches;
    if (!hasMouse || !isUltraWide) return;

    document.body.classList.add('custom-cursor');
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
        dot.classList.add('active');
        ring.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        dot.classList.remove('active');
        ring.classList.remove('active');
    });

    function animate() {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mouseover', e => {
        if (e.target.closest('a, button, .project-card, .skill-card, .contact-card, .gh-stat')) {
            ring.classList.add('hovering');
        }
    });

    document.addEventListener('mouseout', e => {
        if (e.target.closest('a, button, .project-card, .skill-card, .contact-card, .gh-stat')) {
            ring.classList.remove('hovering');
        }
    });
})();

// Segmented Fluid Scroll Reveal (Observes individual elements on scroll)
(function () {
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }
})();
