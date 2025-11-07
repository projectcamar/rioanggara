// Content for index.html - Loaded only after authentication
window.indexContent = `
        <header>
            <div class="container nav">
                <div class="logo">RIO ANGGARA</div>
                <div class="nav-links">
                    <a href="about-me.html">My Journey</a>
                    <a href="past-works.html">Portfolio</a>
                    <a href="contact.html">Let's Connect</a>
                </div>
            </div>
        </header>

        <section class="hero container">
            <div class="hero-content">
                <h1>Rio Anggara</h1>
                <p>I am an Applied Bachelor in International Business student at Universitas Padjadjaran with a focus on product development and business strategy. I combine academic excellence with practical experience in consulting, banking, and technology sectors.</p>
                <p>Based in Jakarta, Indonesia, I'm passionate about creating innovative solutions and driving business growth through strategic thinking and technology. Contact me at +62 888 0114 6881 or rioanggaraclub@gmail.com</p>
                <a href="#chat-section" class="btn">Get in touch & Ask Rio Anything</a>
            </div>
            <div class="hero-image">
                <img src="assets/foto-akmal.jpeg" alt="Rio Anggara" />
                <div class="squares">
                    <div class="square-1"></div>
                    <div class="square-2"></div>
                    <div class="square-3"></div>
                    <div class="square-4"></div>
                    <div class="square-5"></div>
                    <div class="square-6"></div>
                </div>
            </div>
        </section>

        <section class="areas">
            <div class="container">
                <h2 class="section-title">Field of Interest</h2>
                <div class="experience-grid">
                    <div class="experience-item">
                        <h3>Product Development</h3>
                        <p>I develop and implement strategic solutions in investment and technology, specializing in digital banking products and browser extensions. Currently leading Learnitab, an EdTech platform helping students in career preparation.</p>
                    </div>
                    <div class="experience-item">
                        <h3>Business Strategy</h3>
                        <p>I lead initiatives in business development and strategic planning, with proven success in international business competitions and consulting projects. Notable achievements include winning ISMC 2024 and Wall Street Business Challenge.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="education-accolades container">
            <div class="education">
                <h2 class="section-title">Education</h2>
                <div class="education-item">
                    <h3><a href="https://www.unpad.ac.id/" class="hover-link">Universitas Padjadjaran</a></h3>
                    <p class="subtitle">Applied Bachelor in International Business (Sep 2020 – Nov 2025)</p>
                    <p>GPA: 3.72/4.00</p>
                </div>
                <div class="education-item">
                    <h3><a href="https://www.ajou.ac.kr/en/index.do" class="hover-link">Ajou University (아주대학교)</a></h3>
                    <p class="subtitle">Inter-University Non-degree Exchange Program (Feb 2024 – June 2024)</p>
                    <p>Suwon, South Korea | College of Business Administration, Major of E-Business</p>
                    <p>GPA: 81.7/100</p>
                </div>
            </div>
            <div class="accolades">
                <h2 class="section-title">Recent Achievements</h2>
                <div class="accolade-item">
                    <h3><a href="https://yli.or.id" class="hover-link">Young Leaders for Indonesia</a></h3>
                    <p>McKinsey & Company Leadership Program</p>
                </div>
                <div class="accolade-item">
                    <h3><a href="https://cleanrecyclinginitiative.com/competition/" class="hover-link">International Competition Winner</a></h3>
                    <p>ISMC 2024 & Wall Street Business Challenge</p>
                </div>
            </div>
        </section>

        <section class="experience">
            <div class="container">
                <h2 class="section-title">Key Experiences</h2>
                <div class="work-grid">
                    <div class="work-item" onclick="window.location.href='https://pwc.com'">
                        <h3>Business Development VE</h3>
                        <p>PwC Indonesia | Sep 2025 – Dec 2025 (Expected)</p>
                        <p class="key-points">Conducting market research, supporting lead generation, preparing client proposals, and managing CRM systems for strategic pursuits.</p>
                    </div>

                    <div class="work-item" onclick="window.location.href='https://jago.com'">
                        <h3>Strategy & Product Development Intern</h3>
                        <p>Bank Jago | Aug 2024 – Feb 2025</p>
                        <p class="key-points">Led comprehensive market analysis across banking functions, supported internal control procedures, and spearheaded competitive analysis of 20+ financial institutions.</p>
                    </div>

                    <div class="work-item" onclick="window.location.href='https://learnitab.com'">
                        <h3>Founder & Full-stack Developer</h3>
                        <p>Learnitab | Jun 2024 - Present</p>
                        <p class="key-points">Built & launched cross-browser EdTech extension (600+ installs with 250 active users), integrating 10+ tools to streamline student job-readiness.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="chat-section" class="chat-section container">
            <h2 class="chat-title">Chat with Rio Anggara AI to know more!</h2>
            <div class="chat-container">
                <div class="chat-main-wrapper">
                    <div class="quick-buttons">
                        <div class="context-header">
                            <span>Question Box</span>
                            <button class="minimize-question-box">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                        </div>
                        <div class="questions-container">
                            <button class="quick-btn" onclick="askQuestion('Who is Rio Anggara?')">
                                Who is Rio Anggara?
                                <span class="question-category">Profile</span>
                            </button>
                            <button class="quick-btn" onclick="askQuestion('What are Rio\'s technical skills?')">
                                What are Rio's technical skills?
                                <span class="question-category">Skills</span>
                            </button>
                            <button class="quick-btn" onclick="askQuestion('What projects has Rio worked on?')">
                                What projects has Rio worked on?
                                <span class="question-category">Projects</span>
                            </button>
                            <button class="quick-btn" onclick="askQuestion('What is Rio\'s educational background?')">
                                What is Rio's education?
                                <span class="question-category">Education</span>
                            </button>
                            <button class="quick-btn" onclick="askQuestion('How can I contact Rio?')">
                                How can I contact Rio?
                                <span class="question-category">Contact</span>
                            </button>
                            <button class="quick-btn" onclick="askQuestion('What is Rio\'s work experience?')">
                                What is Rio's work experience?
                                <span class="question-category">Experience</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-main">
                        <div class="chat-header">
                            <div class="bot-profile">
                                <img src="assets/foto-akmal.jpeg" alt="Rio AI" class="bot-avatar">
                                <div class="bot-info">
                                    <h4>Rio AI Assistant</h4>
                                    <span class="status">Online</span>
                                </div>
                            </div>
                            <div class="chat-actions">
                                <button class="clear-chat" onclick="clearChat()">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div id="chatMessages"></div>
                        <div class="chat-input-container">
                            <div class="input-group">
                                <input type="text" id="userInput" placeholder="Ask something here...">
                                <button id="sendButton" onclick="sendMessage()">
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                            <p class="disclaimer">Note: AI responses may not always be accurate... that's why you should interview the real Rio instead! 😉</p>
                            <div class="typing-indicator" style="display: none;">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer>
            <div class="container">
                <p>Connect with me</p>
                <div class="social-links">
                    <a href="contact.html"><i class="fas fa-envelope"></i></a>
                    <a href="https://www.linkedin.com/in/rionggara"><i class="fab fa-linkedin"></i></a>
                    <a href="https://bit.ly/PortofolioRio-2025"><i class="fas fa-folder"></i></a>
                </div>
            </div>
        </footer>

        <div class="floating-chat">
            <div class="floating-chat-header">
                <img src="assets/foto-akmal.jpeg" alt="Rio AI">
                <div class="floating-chat-header-text">
                    <h4>Chat with Rio AI</h4>
                    <p>Ask me anything!</p>
                </div>
                <button class="minimize-btn">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="floating-chat-input">
                <input type="text" placeholder="Type your question..." id="floatingInput">
                <button onclick="handleFloatingChat()">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
`;
