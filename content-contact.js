// Content for contact.html - Loaded only after authentication
window.contactContent = `
    <header>
        <div class="container nav">
            <a href="index.html" class="logo">RIO ANGGARA</a>
            <div class="nav-links">
                <a href="about-me.html">My Journey</a>
                <a href="past-works.html">Portfolio</a>
                <a href="contact.html" class="active">Let's Connect</a>
            </div>
        </div>
    </header>

    <main class="container contact-section">
        <h1>Let's Connect</h1>
        <p class="subtitle">I'm always interested in hearing about new opportunities and collaborations. Contact me at +62 888 0114 6881 or rioanggaraclub@gmail.com</p>

        <form class="contact-form" id="contactForm" onsubmit="sendEmail(event)">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" class="submit-btn">Send Message</button>
        </form>
    </main>

    <script>
        function sendEmail(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const mailtoLink = \`mailto:rioanggaraclub@gmail.com?subject=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(
\`Name: \${name}
Email: \${email}

Message:
\${message}\`)}\`;

            window.location.href = mailtoLink;
        }
    </script>

    <script type="module">
        import { HuggingFaceInferenceEmbeddings } from 'https://esm.sh/@langchain/community/embeddings/hf';
        import { HuggingFaceInference } from 'https://esm.sh/@langchain/community/llms/hf';
        
        const model = new HuggingFaceInference({
            model: "gpt2",
            temperature: 0.7,
            maxTokens: 50
        });

        async function generateResponse(input) {
            try {
                const response = await model.call(input);
                return response;
            } catch (error) {
                console.error('Error:', error);
                return "I apologize, but I'm having trouble generating a response right now.";
            }
        }

        window.generateResponse = generateResponse;
    </script>

    <script>
        async function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            input.value = '';

            try {
                const loadingMessage = 'Thinking...';
                addMessage(loadingMessage, 'bot');

                const response = await generateResponse(message);

                const messages = document.getElementById('chatMessages');
                messages.removeChild(messages.lastChild);
                addMessage(response, 'bot');
            } catch (error) {
                console.error('Error:', error);
                addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        }
    </script>
`;
