// Terminal Loading Screen and Effects
class TerminalLoader {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.terminalOutput = document.getElementById('terminal-output');
        this.loadingSequence = [
            { type: 'prompt', text: 'oliver@portfolio:~$ ' },
            { type: 'command', text: 'initializing portfolio...', delay: 500 },
            { type: 'output', text: '[INFO] Loading user profile...', delay: 800 },
            { type: 'output', text: '[INFO] Compiling projects...', delay: 1200 },
            { type: 'output', text: '[INFO] Setting up environment...', delay: 1600 },
            { type: 'success', text: '[SUCCESS] Portfolio loaded successfully!', delay: 2000 },
            { type: 'output', text: 'Welcome to Oliver Diaz\'s Portfolio', delay: 2300 },
            { type: 'prompt', text: 'oliver@portfolio:~$ ', delay: 2600 }
        ];

        this.init();
    }

    init() {
        this.runLoadingSequence();
    }

    async runLoadingSequence() {
        for (const item of this.loadingSequence) {
            await this.delay(item.delay || 300);
            this.addTerminalLine(item.type, item.text);
        }

        // Hide loading screen after sequence
        await this.delay(1000);
        this.hideLoadingScreen();
    }

    addTerminalLine(type, text) {
        const line = document.createElement('div');
        line.className = `loading-line ${type}-line`;

        if (type === 'prompt') {
            line.innerHTML = `<span style="color: #00d9ff; font-weight: 600;">${text}</span>`;
        } else if (type === 'command') {
            line.innerHTML = `<span style="color: #39ff14;">${text}</span>`;
        } else if (type === 'success') {
            line.innerHTML = `<span style="color: #39ff14;">${text}</span>`;
        } else {
            line.innerHTML = `<span style="color: #f8f8f2;">${text}</span>`;
        }

        this.terminalOutput.appendChild(line);

        // Auto scroll to bottom
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }

    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');

        // Remove from DOM after transition
        setTimeout(() => {
            if (this.loadingScreen.parentNode) {
                this.loadingScreen.parentNode.removeChild(this.loadingScreen);
            }
        }, 500);

        // Start hero terminal animation
        this.startHeroTerminalAnimation();
    }

    startHeroTerminalAnimation() {
        const typingElements = document.querySelectorAll('.typing-text');

        typingElements.forEach((element, index) => {
            setTimeout(() => {
                this.typeText(element, element.dataset.text);
            }, index * 1500);
        });
    }

    async typeText(element, text) {
        element.textContent = '';

        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.delay(50);
        }

        // Mark as completed
        element.classList.add('completed');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Terminal Contact Animation
class ContactTerminal {
    constructor() {
        this.terminalContact = document.querySelector('.terminal-contact');
        this.init();
    }

    init() {
        // Observe when contact section comes into view
        if (this.terminalContact) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateContactTerminal();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(this.terminalContact);
        }
    }

    async animateContactTerminal() {
        const lines = this.terminalContact.querySelectorAll('.terminal-line.output');

        // Hide all lines initially
        lines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-20px)';
        });

        // Animate each line
        for (let i = 0; i < lines.length; i++) {
            await this.delay(300);
            lines[i].style.transition = 'all 0.5s ease';
            lines[i].style.opacity = '1';
            lines[i].style.transform = 'translateX(0)';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize terminal effects
document.addEventListener('DOMContentLoaded', () => {
    // Only run loading screen on first visit
    if (!sessionStorage.getItem('portfolioVisited')) {
        new TerminalLoader();
        sessionStorage.setItem('portfolioVisited', 'true');
    } else {
        // Hide loading screen immediately if returning user
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

        // Start hero animation
        setTimeout(() => {
            const terminalLoader = new TerminalLoader();
            terminalLoader.startHeroTerminalAnimation();
        }, 100);
    }

    // Initialize contact terminal
    new ContactTerminal();
});

// Global terminal utilities
window.Terminal = {
    // Add typing effect to any element
    typeText: async function(element, text, speed = 50) {
        element.textContent = '';

        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    },

    // Add blinking cursor effect
    addCursor: function(element) {
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.style.marginLeft = '4px';
        element.appendChild(cursor);
    },

    // Simulate terminal command execution
    executeCommand: async function(terminalBody, command, output) {
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `
            <span class="prompt">$</span>
            <span class="command">${command}</span>
        `;
        terminalBody.appendChild(commandLine);

        await new Promise(resolve => setTimeout(resolve, 500));

        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line output';
        outputLine.textContent = output;
        terminalBody.appendChild(outputLine);

        // Auto scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
};