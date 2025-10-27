// Authentication utility for portfolio pages
class PortfolioAuth {
    constructor() {
        this.isAuthenticated = this.checkAuthStatus();
        this.init();
    }

    init() {
        if (!this.isAuthenticated) {
            this.showPasswordGate();
        } else {
            this.showContent();
        }
    }

    checkAuthStatus() {
        // Check if user is authenticated (session storage)
        return sessionStorage.getItem('portfolio_authenticated') === 'true';
    }

    showPasswordGate() {
        // Hide all content
        const content = document.querySelector('main, .container');
        if (content) {
            content.style.display = 'none';
        }

        // Create password gate
        this.createPasswordGate();
    }

    createPasswordGate() {
        const gateHTML = `
            <div id="passwordGate" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                ">
                    <div style="margin-bottom: 2rem;">
                        <h2 style="
                            color: #2D2D2D;
                            font-size: 1.8rem;
                            margin-bottom: 1rem;
                            font-weight: 600;
                        ">Welcome to Rio's Portfolio</h2>
                        <p style="
                            color: #7D7D7D;
                            font-size: 1rem;
                            line-height: 1.5;
                        ">
                            This page is specially made for <strong>HR professionals and selected guests</strong>. 
                            If you're here after <strong>receiving my CV</strong>, you'll find the 
                            <strong>password included there</strong> to <strong>unlock the full content</strong>.
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <p style="color: #7D7D7D; margin-bottom: 1rem;">Put the password below 🙌</p>
                        <div style="position: relative;">
                            <input type="password" id="passwordInput" placeholder="Enter password" style="
                                font-family: 'Inter', sans-serif;
                                font-size: 1rem;
                                width: 100%;
                                padding: 12px 40px 12px 12px;
                                border: 2px solid #DEDEDE;
                                border-radius: 6px;
                                outline: none;
                                transition: border-color 0.3s;
                            ">
                            <span id="togglePassword" style="
                                position: absolute;
                                right: 12px;
                                top: 50%;
                                transform: translateY(-50%);
                                cursor: pointer;
                                color: #7D7D7D;
                                font-size: 1.2rem;
                            ">👁️</span>
                        </div>
                    </div>
                    
                    <button id="submitPassword" style="
                        font-family: 'Inter', sans-serif;
                        font-weight: 500;
                        background: #D04A02;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 1rem;
                        width: 100%;
                        transition: background-color 0.3s;
                    ">Enter</button>
                    
                    <div id="errorMessage" style="
                        margin-top: 1rem;
                        color: #DB536A;
                        font-size: 0.9rem;
                        min-height: 20px;
                    "></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', gateHTML);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const passwordInput = document.getElementById('passwordInput');
        const submitBtn = document.getElementById('submitPassword');
        const toggleBtn = document.getElementById('togglePassword');

        // Submit on Enter key
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.validatePassword();
            }
        });

        // Submit button click
        submitBtn.addEventListener('click', () => {
            this.validatePassword();
        });

        // Toggle password visibility
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
        });

        // Focus on input
        passwordInput.focus();
    }

    async validatePassword() {
        const password = document.getElementById('passwordInput').value;
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = document.getElementById('submitPassword');

        if (!password) {
            this.showError('Please enter a password');
            return;
        }

        // Show loading state
        submitBtn.textContent = 'Checking...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/validate-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.valid) {
                // Password correct
                sessionStorage.setItem('portfolio_authenticated', 'true');
                this.showContent();
            } else {
                // Password incorrect
                this.showError(this.getRandomErrorMessage());
                document.getElementById('passwordInput').value = '';
            }
        } catch (error) {
            console.error('Password validation error:', error);
            this.showError('Connection error. Please try again.');
        } finally {
            submitBtn.textContent = 'Enter';
            submitBtn.disabled = false;
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.color = '#DB536A';
    }

    getRandomErrorMessage() {
        const messages = [
            'Wrong Password, curious enough? <a href="https://www.linkedin.com/in/rionggara/" target="_blank" style="color: #D04A02;">ask Rio personally</a>',
            'Oops, wrong password. Still curious? Maybe just <a href="https://www.linkedin.com/in/rionggara/" target="_blank" style="color: #D04A02;">ask Rio</a>?',
            'Hmm, that password didn\'t work either. Don\'t give up! Or... you could just <a href="https://www.linkedin.com/in/rionggara/" target="_blank" style="color: #D04A02;">ask Rio personally</a>.',
            'Password incorrect again! This is getting tough.. Why not save yourself the trouble and <a href="https://www.linkedin.com/in/rionggara/" target="_blank" style="color: #D04A02;">ask Rio on LinkedIn</a>?',
            'Still locked out? This password game is tricky! A quick message to <a href="https://www.linkedin.com/in/rionggara/" target="_blank" style="color: #D04A02;">Rio</a> might be easier.',
            'Incorrect password. Perhaps fate is telling you to bypass the gate and <a href="https://www.linkedin.com/in/rionggara/" target="_blank" style="color: #D04A02;">reach out directly</a>? 😉',
            'Another wrong one! Maybe the password likes to play hard to get. Rio is much easier to find on <a href="https://www.linkedin.com/in/rionggara/" target="_blank" style="color: #D04A02;">LinkedIn</a>!'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    showContent() {
        // Remove password gate
        const gate = document.getElementById('passwordGate');
        if (gate) {
            gate.remove();
        }

        // Show all content
        const content = document.querySelector('main, .container');
        if (content) {
            content.style.display = 'block';
        }

        // Show header
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'block';
        }
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAuth();
});