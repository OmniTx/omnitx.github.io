document.addEventListener('DOMContentLoaded', () => {

    // Dynamic Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Live Time Update
    const timeDisplay = document.getElementById('local-time');

    const updateTime = () => {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (timeDisplay) {
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Staggered Animation for Bento Items
    const items = document.querySelectorAll('.bento-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;

        // Trigger reflow
        void item.offsetWidth;

        // Animate in
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);
    });

    console.log('⚡ Bento Grid Loaded');
});
