// Imran Ahmed - Portfolio Scripts

// Theme
(function () {
    const stored = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === null ? systemPrefersDark : stored === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const sun = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');
    function applyIcons(dark) {
        sun.style.display = dark ? 'none' : 'block';
        moon.style.display = dark ? 'block' : 'none';
    }
    applyIcons(isDark);
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
        applyIcons(next === 'dark');
    });
})();

// GitHub Stats
async function loadGitHub() {
    const ids = ['gh-repos', 'gh-followers', 'gh-stars', 'gh-forks'];
    try {
        const res = await fetch('https://api.github.com/users/omnitx');
        if (!res.ok) throw new Error('user fetch failed');
        const user = await res.json();
        document.getElementById('gh-repos').textContent = user.public_repos ?? 0;
        document.getElementById('gh-followers').textContent = user.followers ?? 0;

        const reposRes = await fetch('https://api.github.com/users/omnitx/repos?per_page=100');
        if (!reposRes.ok) throw new Error('repos fetch failed');
        const repos = await reposRes.json();
        if (Array.isArray(repos)) {
            document.getElementById('gh-stars').textContent = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
            document.getElementById('gh-forks').textContent = repos.reduce((a, r) => a + (r.forks_count || 0), 0);
        }
    } catch (e) {
        // On failure show 0 rather than dashes so stats section doesn't look broken
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.textContent.trim() === '…') el.textContent = '0';
        });
    }
}

loadGitHub();
document.getElementById('yr').textContent = new Date().getFullYear();

// Custom cursor
(function () {
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    const isWide = window.matchMedia('(min-width: 768px)').matches;
    if (!hasMouse || !isWide) return;
    document.body.classList.add('custom-cursor');
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        dot.classList.add('active'); ring.classList.add('active');
    });
    document.addEventListener('mouseleave', () => {
        dot.classList.remove('active'); ring.classList.remove('active');
    });
    function animate() {
        rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(animate);
    }
    animate();
    document.addEventListener('mouseover', e => {
        if (e.target.closest('a, button')) ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest('a, button')) ring.classList.remove('hovering');
    });
})();
