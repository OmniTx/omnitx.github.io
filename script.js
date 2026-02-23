// --- Configuration ---
const GITHUB_USERNAME = 'omnitx';

// --- Theme Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// --- Helper: Escape HTML ---
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// --- Intersection Observer for ALL Reveal Elements ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

// Function to observe elements
function observeElements(selector) {
    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });
}

// --- Data Fetching ---
async function fetchGitHubData() {
    const projectGrid = document.getElementById('project-grid');

    try {
        // Fetch Profile
        const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!profileRes.ok) throw new Error('Profile not found');
        const profile = await profileRes.json();

        updateProfile(profile);

        // Fetch Repos
        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        const repos = await reposRes.json();

        // Calculate stats
        const stats = repos.reduce((acc, repo) => {
            acc.stars += repo.stargazers_count;
            acc.forks += repo.forks_count;
            return acc;
        }, { stars: 0, forks: 0 });

        updateStats(profile, stats);

        if (repos && repos.length > 0) {
            renderProjects(repos);
        } else {
            projectGrid.innerHTML = '<p class="col-span-2 text-center" style="color: var(--fg-muted);">No public repositories found.</p>';
        }

    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        document.getElementById('hero-bio').textContent = "IT Manager & Developer. (Could not load GitHub data).";
        projectGrid.innerHTML = `
          <div class="col-span-2 p-6 rounded-xl text-center" style="background: var(--card); border: 1px solid var(--border);">
            <p class="font-mono text-sm" style="color: var(--fg-muted);">GitHub data unavailable.</p>
          </div>
        `;
    }
}

function updateProfile(user) {
    const nameEl = document.getElementById('hero-name');
    nameEl.textContent = user.name || user.login;

    const navName = document.getElementById('nav-name');
    navName.innerHTML = `
        <span class="w-3 h-3 rounded-sm" style="background: var(--accent);"></span>
        ${escapeHtml(user.name || user.login)}
      `;

    const bioEl = document.getElementById('hero-bio');
    bioEl.textContent = user.bio || "IT Manager & Developer specializing in WordPress, UI/UX, and IT Infrastructure.";

    const avatarEl = document.getElementById('avatar-img');
    const avatarSkeleton = document.getElementById('avatar-skeleton');
    avatarEl.src = user.avatar_url;
    avatarEl.onload = () => {
        avatarEl.classList.remove('opacity-0');
        avatarSkeleton.style.display = 'none';
    };
}

function updateStats(user, stats) {
    animateValue('stat-repos', 0, user.public_repos, 1000);
    animateValue('stat-followers', 0, user.followers, 1000);
    animateValue('stat-stars', 0, stats.stars, 1500);
    animateValue('stat-forks', 0, stats.forks, 1500);
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function renderProjects(repos) {
    const container = document.getElementById('project-grid');
    container.innerHTML = '';

    repos.forEach((repo, index) => {
        const card = document.createElement('a');
        card.href = repo.html_url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.className = "reveal project-card rounded-xl overflow-hidden group p-6";
        card.style.cssText = `background: var(--card); border: 1px solid var(--border); transition-delay: ${index * 0.1}s;`;

        const description = escapeHtml(repo.description || 'No description provided.');
        const langColor = getLanguageColor(repo.language);

        card.innerHTML = `
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">${escapeHtml(repo.name)}</h3>
            <span class="font-mono text-xs px-2 py-1 rounded flex items-center gap-1" style="background: var(--bg-alt); border: 1px solid var(--border);">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
              ${repo.stargazers_count}
            </span>
          </div>
          <p class="mb-4 text-sm line-clamp-2" style="color: var(--fg-muted); min-height: 40px;">
            ${description}
          </p>
          <div class="flex items-center gap-4 font-mono text-xs" style="color: var(--fg-muted);">
            ${repo.language ? `
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 rounded-full" style="background: ${langColor};"></span>
                ${escapeHtml(repo.language)}
              </span>
            ` : ''}
            <span>Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
        `;
        container.appendChild(card);
        // Observe the newly added card
        observer.observe(card);
    });
}

function getLanguageColor(lang) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Vue': '#41b883',
        'Java': '#b07219',
        'PHP': '#4F5D95'
    };
    return colors[lang] || '#cccccc';
}

// --- Initialization ---
// 1. Set dynamic year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// 2. Observe all static elements
observeElements('.reveal');

// 3. Fetch dynamic data
fetchGitHubData();
