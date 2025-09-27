// Scroll Animations and Intersection Observer
class ScrollAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.animateSkillBars();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, options);

        // Observe all sections and cards
        document.querySelectorAll('section, .project-card, .skill-category, .timeline-item').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        // Add fade-in animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Trigger animation
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });

        // Stagger child elements if they exist
        const children = element.querySelectorAll('.stagger-item, .project-card, .skill-category');
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    this.animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress[data-width]');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    this.animateSkillBar(entry.target);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    animateSkillBar(element) {
        const width = element.dataset.width;
        element.style.width = '0%';

        setTimeout(() => {
            element.style.transition = 'width 1.5s ease-in-out';
            element.style.width = width + '%';
        }, 200);
    }
}

// Particle System
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = {
                x: Math.random() * this.container.offsetWidth,
                y: Math.random() * this.container.offsetHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            };
            this.particles.push(particle);
        }
    }

    animate() {
        // Clear canvas or update particle positions
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.container.offsetWidth;
            if (particle.x > this.container.offsetWidth) particle.x = 0;
            if (particle.y < 0) particle.y = this.container.offsetHeight;
            if (particle.y > this.container.offsetHeight) particle.y = 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Glitch Effect
class GlitchEffect {
    constructor(element) {
        this.element = element;
        this.originalText = element.textContent;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.isGlitching = false;
    }

    start() {
        if (this.isGlitching) return;
        this.isGlitching = true;
        this.glitch();
    }

    async glitch() {
        const iterations = 10;
        const speed = 50;

        for (let i = 0; i < iterations; i++) {
            await this.delay(speed);
            this.element.textContent = this.randomizeText();
        }

        this.element.textContent = this.originalText;
        this.isGlitching = false;
    }

    randomizeText() {
        return this.originalText
            .split('')
            .map(char => Math.random() > 0.8 ? this.getRandomChar() : char)
            .join('');
    }

    getRandomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Smooth Scroll with Offset
class SmoothScroll {
    constructor() {
        this.offset = 80; // Account for fixed navbar
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                }
            });
        });
    }

    scrollToElement(element) {
        const targetPosition = element.offsetTop - this.offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
    }

    updateParallax() {
        const scrolled = window.pageYOffset;

        this.elements.forEach(element => {
            const rate = scrolled * (element.dataset.parallax || 0.5);
            element.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Typing Effect for Hero Terminal
class TypingEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    async start() {
        this.element.textContent = '';

        for (let i = 0; i < this.text.length; i++) {
            this.element.textContent += this.text[i];
            await this.delay(this.speed);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize smooth scroll
    new SmoothScroll();

    // Initialize parallax effect
    new ParallaxEffect();

    // Add glitch effect to brand name
    const brandName = document.querySelector('.brand-name');
    if (brandName) {
        const glitch = new GlitchEffect(brandName);
        brandName.addEventListener('mouseenter', () => glitch.start());
    }

    // Add hover effects to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add pulse effect to CTA buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                btn.style.animation = '';
            }, 600);
        });
    });

    // Add typing effect to section titles on scroll
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.typed) {
                const text = entry.target.textContent;
                const typing = new TypingEffect(entry.target, text, 50);
                typing.start();
                entry.target.dataset.typed = 'true';
            }
        });
    }, { threshold: 0.8 });

    sectionTitles.forEach(title => titleObserver.observe(title));
});

// Export for use in other files
window.Animations = {
    ScrollAnimations,
    GlitchEffect,
    TypingEffect,
    ParticleSystem,
    SmoothScroll,
    ParallaxEffect
};