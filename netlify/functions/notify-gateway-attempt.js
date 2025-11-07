const { Resend } = require('resend');

// In-memory storage for IP attempt tracking
// In production, you might want to use a database
const ipAttempts = new Map();

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get the visitor's IP address
        const visitorIP = event.headers['x-forwarded-for'] || 
                         event.headers['x-nf-client-connection-ip'] || 
                         'unknown';

        // Track attempts by IP
        const currentAttempts = ipAttempts.get(visitorIP) || 0;
        const attemptNumber = currentAttempts + 1;
        ipAttempts.set(visitorIP, attemptNumber);

        // Initialize Resend with API key from environment variable
        const resendApiKey = process.env.RESEND_API_KEY;
        
        if (!resendApiKey) {
            console.error('RESEND_API_KEY not configured');
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: 'Email service not configured',
                    success: false 
                })
            };
        }

        const resend = new Resend(resendApiKey);

        // Send email notification
        const emailData = await resend.emails.send({
            from: 'Gateway Alert <onboarding@resend.dev>',
            to: 'rioanggaraclub@gmail.com',
            subject: `Password Gateway Access Attempt #${attemptNumber}`,
            html: `
                <h2>Gateway Access Attempt Detected</h2>
                <p><strong>Attempt Number:</strong> ${attemptNumber}</p>
                <p><strong>Visitor IP:</strong> ${visitorIP}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <p><strong>User Agent:</strong> ${event.headers['user-agent'] || 'Unknown'}</p>
                <hr>
                <p style="color: #666; font-size: 12px;">This is an automated notification from your portfolio gateway.</p>
            `
        });

        console.log('Email sent successfully:', emailData);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                attemptNumber: attemptNumber,
                ip: visitorIP
            })
        };
    } catch (error) {
        console.error('Error sending notification:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send notification',
                details: error.message,
                success: false
            })
        };
    }
};
