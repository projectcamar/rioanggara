const fetch = require('node-fetch');

// In-memory store for tracking attempts per IP
// Note: This resets on function cold starts, but good enough for basic tracking
const attemptTracker = {};

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { password } = JSON.parse(event.body);

        // Get visitor IP address
        const ip = event.headers['x-forwarded-for'] || 
                   event.headers['x-real-ip'] || 
                   'unknown';

        // Track attempts per IP
        if (!attemptTracker[ip]) {
            attemptTracker[ip] = 0;
        }
        attemptTracker[ip]++;

        const attemptNumber = attemptTracker[ip];

        // Send email notification asynchronously (don't wait for it)
        // This runs in background and doesn't block the password verification
        sendEmailNotification(ip, attemptNumber, password).catch(err => {
            console.error('Email notification failed:', err);
            // Don't fail the request if email fails
        });

        // Password stored securely in environment variable
        // Set PORTFOLIO_PASSWORD in Netlify dashboard: Site settings -> Environment variables
        // Fallback to default password if environment variable is not set
        const correctPassword = process.env.PORTFOLIO_PASSWORD || 'rario555';

        // Verify password
        const isCorrect = password === correctPassword;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: isCorrect,
                attemptNumber: attemptNumber
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to verify password',
                details: error.message
            })
        };
    }
};

// Helper function to send email notification
async function sendEmailNotification(ip, attemptNumber, password) {
    try {
        const response = await fetch(`${process.env.URL || 'http://localhost:8888'}/.netlify/functions/send-gateway-attempt-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ip: ip,
                attemptNumber: attemptNumber,
                password: password,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Email notification failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to send email notification:', error);
        throw error;
    }
}
