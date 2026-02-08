// ============================================
// Portfolio JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.padding = '12px 0';
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }

        lastScroll = currentScroll;
    });

    // Smooth reveal animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.skill-card, .project-card, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add revealed class styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Stagger animation for skill cards
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Stagger animation for project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Typing effect for hero (optional enhancement)
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.borderRight = '2px solid var(--accent-primary)';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            } else {
                setTimeout(() => {
                    tagline.style.borderRight = 'none';
                }, 1000);
            }
        };

        setTimeout(typeWriter, 500);
    }

    console.log('🚀 Portfolio loaded successfully!');
});

// ============================================
// Classic Portfolio - Sparkle Particle System
// ============================================

// Sparkle Particle System
const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    class Sparkle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.opacity = 0;
            this.fadeSpeed = Math.random() * 0.02 + 0.01;
            this.maxOpacity = Math.random() * 0.8 + 0.2;
            this.twinkle = Math.random() * Math.PI * 2;
        }

        update() {
            this.y -= this.speedY;
            this.twinkle += 0.05;

            // Fade in and out
            if (this.opacity < this.maxOpacity) {
                this.opacity += this.fadeSpeed;
            } else {
                this.opacity -= this.fadeSpeed * 0.5;
            }

            // Reset when particle goes off screen or fades out
            if (this.y < 0 || this.opacity <= 0) {
                this.reset();
                this.y = canvas.height;
            }
        }

        draw() {
            const twinkleOpacity = this.opacity * (0.5 + Math.sin(this.twinkle) * 0.5);

            // Draw star shape
            ctx.save();
            ctx.translate(this.x, this.y);

            // Glow
            ctx.fillStyle = `rgba(0, 255, 200, ${twinkleOpacity * 0.3})`;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Cross sparkle
            ctx.strokeStyle = `rgba(0, 255, 200, ${twinkleOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-this.size * 2, 0);
            ctx.lineTo(this.size * 2, 0);
            ctx.moveTo(0, -this.size * 2);
            ctx.lineTo(0, this.size * 2);
            ctx.stroke();

            ctx.restore();
        }
    }

    // Create sparkles
    const sparklesArray = [];
    const numberOfSparkles = 80;

    for (let i = 0; i < numberOfSparkles; i++) {
        sparklesArray.push(new Sparkle());
    }

    // Animation loop
    function animateSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        sparklesArray.forEach(sparkle => {
            sparkle.update();
            sparkle.draw();
        });

        requestAnimationFrame(animateSparkles);
    }

    animateSparkles();
}

// ============================================
// Classic Portfolio - Custom Cursor
// ============================================

// Simple Dot Cursor
const cursorDot = document.querySelector('.cursor-dot');
if (cursorDot) {
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    // Cursor hover effect
    const hoverElements = document.querySelectorAll('a, button, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
    });
}

// ============================================
// Smooth Scroll for Classic Portfolio
// ============================================

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
