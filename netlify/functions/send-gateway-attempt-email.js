const { Resend } = require('resend');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { ip, attemptNumber, password, timestamp } = JSON.parse(event.body);

        // Initialize Resend with API key from environment variable
        const resend = new Resend(process.env.RESEND_API_KEY);

        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not configured - email notification skipped');
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Email skipped (API key not configured)' 
                })
            };
        }

        // Send email notification
        const emailData = await resend.emails.send({
            from: 'Gateway Alert <onboarding@resend.dev>', // Resend default sender
            to: ['rioanggaraclub@gmail.com'],
            subject: `🚨 Gateway Access Attempt #${attemptNumber} - IP: ${ip}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D04A02;">Gateway Access Attempt Notification</h2>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>📍 IP Address:</strong> ${ip}</p>
                        <p><strong>🔢 Attempt Number:</strong> ${attemptNumber}</p>
                        <p><strong>🔑 Password Entered:</strong> ${password || '(empty)'}</p>
                        <p><strong>⏰ Timestamp:</strong> ${new Date(timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        This is an automated notification from your portfolio gateway.
                    </p>
                </div>
            `,
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Email notification sent',
                emailId: emailData.id
            })
        };
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't fail the request even if email fails
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: false,
                message: 'Email notification failed but request continues',
                error: error.message
            })
        };
    }
};
