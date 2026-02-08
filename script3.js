// File System Data
const fileSystem = {
    'home': {
        name: 'README.md',
        content: `
<div class="md-h1"># Hello, I'm OmniTx</div>
<div class="md-p">
    > Full Stack Developer & <span class="token keyword">Creative Technologist</span>
</div>
<div class="md-p">
    I build digital experiences that live on the internet. My focus is on writing clean, elegant, and efficient code.
</div>
<div class="md-p">
    <span class="token comment">// Navigate using the sidebar to explore more -></span>
</div>
        `
    },
    'about': {
        name: 'about.json',
        content: `
<pre>
<span class="token keyword">const</span> <span class="token variable">developer</span> = {
    <span class="token property">name</span>: <span class="token string">"OmniTx"</span>,
    <span class="token property">role</span>: <span class="token string">"Full Stack Developer"</span>,
    <span class="token property">location</span>: <span class="token string">"Earth"</span>,
    <span class="token property">hobbies</span>: [
        <span class="token string">"Coding"</span>,
        <span class="token string">"Gaming"</span>,
        <span class="token string">"Coffee"</span>
    ],
    <span class="token property">availableForWork</span>: <span class="token keyword">true</span>
};
</pre>
        `
    },
    'stack': {
        name: 'skills.yml',
        content: `
<pre>
<span class="token comment"># Tech Stack Configuration</span>

<span class="token keyword">frontend:</span>
  - HTML5 & CSS3
  - JavaScript (ES6+)
  - React.js / Next.js
  - TailwindCSS

<span class="token keyword">backend:</span>
  - Node.js
  - Python
  - PostgreSQL

<span class="token keyword">tools:</span>
  - Git / GitHub
  - VS Code
  - Docker
</pre>
        `
    },
    'projects': {
        name: 'projects.js',
        content: `
<pre>
<span class="token keyword">export const</span> <span class="token variable">projects</span> = [
    {
        <span class="token property">id</span>: 1,
        <span class="token property">name</span>: <span class="token string">"Project Alpha"</span>,
        <span class="token property">description</span>: <span class="token string">"Real-time web dashboard"</span>,
        <span class="token property">stack</span>: [<span class="token string">"React"</span>, <span class="token string">"Firebase"</span>],
        <span class="token property">status</span>: <span class="token string">"Live"</span>
    },
    {
        <span class="token property">id</span>: 2,
        <span class="token property">name</span>: <span class="token string">"Project Beta"</span>,
        <span class="token property">description</span>: <span class="token string">"E-commerce solution"</span>,
        <span class="token property">stack</span>: [<span class="token string">"Next.js"</span>, <span class="token string">"Stripe"</span>],
        <span class="token property">status</span>: <span class="token string">"Development"</span>
    }
];

<span class="token comment">// Check console for more details...</span>
</pre>
        `
    },
    'contact': {
        name: 'contact.sh',
        content: `
<pre>
<span class="token comment">#!/bin/bash</span>

<span class="token function">echo</span> <span class="token string">"Initializing contact protocol..."</span>

<span class="token comment"># Email</span>
<span class="token keyword">mailto:</span> <a href="mailto:imranomnitx@duck.com" class="md-link">imranomnitx@duck.com</a>

<span class="token comment"># Socials</span>
<span class="token keyword">github:</span> <a href="https://github.com/omnitx" class="md-link">github.com/omnitx</a>

<span class="token function">echo</span> <span class="token string">"Message successfully primed. Waiting for input..."</span>
</pre>
        `
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const viewport = document.getElementById('viewport');
    const files = document.querySelectorAll('.file-item');
    const input = document.getElementById('cmd-input');
    const terminalOutput = document.querySelector('.terminal-input-area');
    const tabsBar = document.querySelector('.tabs-bar'); // New Selector

    // Define icons for easier mapping (optional, or just update data structure)
    const getIcon = (key) => {
        switch (key) {
            case 'home': return '📝';
            case 'about': return '👤';
            case 'stack': return '⚙️';
            case 'projects': return '📦';
            case 'contact': return '📧';
            default: return '📄';
        }
    };

    // Render Tabs Function
    const renderTabs = () => {
        tabsBar.innerHTML = '';
        Object.keys(fileSystem).forEach(key => {
            const file = fileSystem[key];
            const tab = document.createElement('div');
            tab.className = 'tab';
            if (key === 'home') tab.classList.add('active'); // Default active
            tab.setAttribute('data-tab', key);
            tab.innerHTML = `<span class="file-icon">${getIcon(key)}</span> ${file.name}`;

            tab.addEventListener('click', () => loadFile(key));
            tabsBar.appendChild(tab);
        });
    };

    // Load File Function
    const loadFile = (fileKey) => {
        // Update Sidebar Active Class
        files.forEach(f => f.classList.remove('active'));
        const activeItem = document.querySelector(`[data-file="${fileKey}"]`);
        if (activeItem) activeItem.classList.add('active');

        // Update Tabs Active Class
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`[data-tab="${fileKey}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            // Auto-scroll tab into view on mobile
            activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        // Render Content
        if (fileSystem[fileKey]) {
            viewport.innerHTML = fileSystem[fileKey].content;
        }
    };

    // Click Event for Files (Sidebar)
    files.forEach(file => {
        file.addEventListener('click', () => {
            const key = file.getAttribute('data-file');
            loadFile(key);
        });
    });

    // Terminal Commands
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            const outputDiv = document.createElement('div');
            outputDiv.className = 'output-line';

            // Add command history line
            outputDiv.innerHTML = `<span class="prompt">omnitx@dev:~$</span> ${cmd}`;
            terminalOutput.insertBefore(outputDiv, input.parentElement);

            // Process Command
            const responseDiv = document.createElement('div');
            responseDiv.className = 'output-line';

            switch (cmd) {
                case 'help':
                    responseDiv.innerHTML = `Available commands: <span class="token keyword">ls, open [file], clear, whoami, date</span>`;
                    break;
                case 'ls':
                    responseDiv.innerHTML = Object.keys(fileSystem).map(k => fileSystem[k].name).join('  ');
                    break;
                case 'whoami':
                    responseDiv.innerHTML = `omnitx (root)`;
                    break;
                case 'date':
                    responseDiv.innerHTML = new Date().toString();
                    break;
                case 'clear':
                case 'cls':
                case 'clean':
                    document.querySelectorAll('.output-line').forEach(el => el.remove());
                    // Clear the variable holding the history line to prevent it from being re-added or something?
                    // Actually, outputDiv was inserted before.
                    // This selector targets ALL .output-line elements in document, which includes the one we just added.
                    input.value = '';
                    return; // Exit early
                default:
                    if (cmd.startsWith('open ')) {
                        const fileName = cmd.split(' ')[1];
                        // Simple check for filenames mapping to keys
                        const key = Object.keys(fileSystem).find(k => fileSystem[k].name === fileName);
                        if (key) {
                            loadFile(key);
                            responseDiv.innerHTML = `<span class="output-success">Opened ${fileName}</span>`;
                        } else {
                            responseDiv.innerHTML = `<span class="output-error">File not found: ${fileName}</span>`;
                        }
                    } else if (cmd === '') {
                        // Do nothing
                        responseDiv.remove();
                        outputDiv.remove();
                        return;
                    } else {
                        responseDiv.innerHTML = `<span class="output-error">Command not found: ${cmd}</span>`;
                    }
            }

            if (responseDiv.innerHTML) {
                terminalOutput.insertBefore(responseDiv, input.parentElement);
            }

            // Scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            input.value = '';
        }
    });

    // Initial Load
    renderTabs();
    loadFile('home');

    // Mobile: Add Swipe Navigation
    let touchStartX = 0;
    let touchEndX = 0;
    const editorArea = document.querySelector('.editor-area');

    editorArea.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    editorArea.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        const threshold = 50; // min distance for swipe
        const fileKeys = Object.keys(fileSystem);
        const currentKey = document.querySelector('.tab.active')?.getAttribute('data-tab');
        const currentIndex = fileKeys.indexOf(currentKey);

        if (touchEndX < touchStartX - threshold) {
            // Swiped Left -> Next Tab
            if (currentIndex < fileKeys.length - 1) {
                loadFile(fileKeys[currentIndex + 1]);
            }
        } else if (touchEndX > touchStartX + threshold) {
            // Swiped Right -> Prev Tab
            if (currentIndex > 0) {
                loadFile(fileKeys[currentIndex - 1]);
            }
        }
    };

    // Mobile: Add a hint
    if (window.innerWidth <= 768) {
        // Ensure no old hints exist if re-running script (though unlikely)
        const existingHint = document.querySelector('.mobile-nav-hint');
        if (existingHint) existingHint.remove();

        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav-hint';
        mobileNav.innerHTML = `<span style="color: #666; font-size: 0.8rem; display: block; padding: 10px; text-align: center;">Tap tabs above or swipe to navigate</span>`;
        document.querySelector('.terminal-input-area').insertBefore(mobileNav, document.querySelector('.command-line'));
    }
});
