const { Resend } = require('resend');

// In-memory storage for IP attempt tracking
// In production, you might want to use a database
const ipAttempts = new Map();

// Function to get geolocation from IP address
async function getGeolocation(ip) {
    try {
        // Skip geolocation for unknown or local IPs
        if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return null;
        }

        // Use ip-api.com for free geolocation lookup (no API key required)
        // Limit: 45 requests per minute
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        const data = await response.json();
        
        if (data.status === 'success') {
            return {
                country: data.country,
                countryCode: data.countryCode,
                region: data.regionName,
                city: data.city,
                zip: data.zip,
                latitude: data.lat,
                longitude: data.lon,
                timezone: data.timezone,
                isp: data.isp,
                org: data.org,
                as: data.as
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        return null;
    }
}

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get the attempted password from request body
        const { attemptedPassword } = JSON.parse(event.body || '{}');
        
        // Get the visitor's IP address
        const visitorIP = event.headers['x-forwarded-for'] || 
                         event.headers['x-nf-client-connection-ip'] || 
                         'unknown';

        // Track attempts by IP
        const currentAttempts = ipAttempts.get(visitorIP) || 0;
        const attemptNumber = currentAttempts + 1;
        ipAttempts.set(visitorIP, attemptNumber);

        // Get geolocation data based on IP address
        const geolocation = await getGeolocation(visitorIP);

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

        // Format timestamp
        const timestamp = new Date().toLocaleString('id-ID', {
            dateStyle: 'full',
            timeStyle: 'long',
            timeZone: 'Asia/Jakarta'
        });

        // Send email notification with simple styling
        const emailData = await resend.emails.send({
            from: 'Gateway Alert <onboarding@resend.dev>',
            to: 'rioanggaraclub@gmail.com',
            subject: `🚨 Password Gateway Access Attempt #${attemptNumber}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                        .header h2 { margin: 0; font-size: 24px; }
                        .content { background: #f9f9f9; padding: 25px; border: 1px solid #e0e0e0; border-top: none; }
                        .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea; }
                        .info-label { font-weight: bold; color: #555; font-size: 14px; }
                        .info-value { color: #333; font-size: 15px; margin-top: 5px; }
                        .attempt-box { background: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #ffc107; }
                        .attempt-password { font-family: 'Courier New', monospace; background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 16px; color: #d32f2f; font-weight: bold; margin-top: 8px; word-break: break-all; }
                        .footer { background: #333; color: #999; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
                        .badge { background: #667eea; color: white; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>🚨 Gateway Access Attempt Detected</h2>
                        </div>
                        <div class="content">
                            <div class="info-box">
                                <div class="info-label">Attempt Number</div>
                                <div class="info-value"><span class="badge">#${attemptNumber}</span></div>
                            </div>
                            
                            <div class="attempt-box">
                                <div class="info-label">⚠️ What Visitor Filled (Attempted Password)</div>
                                <div class="attempt-password">${attemptedPassword || '(empty)'}</div>
                            </div>
                            
                            <div class="info-box">
                                <div class="info-label">📍 Visitor IP Address</div>
                                <div class="info-value">${visitorIP}</div>
                            </div>
                            
                            ${geolocation ? `
                            <div class="info-box">
                                <div class="info-label">🌍 Visitor Geolocation</div>
                                <div class="info-value">
                                    <strong>📍 Location:</strong> ${geolocation.city || 'Unknown'}${geolocation.region ? ', ' + geolocation.region : ''}, ${geolocation.country || 'Unknown'} ${geolocation.countryCode ? '(' + geolocation.countryCode + ')' : ''}<br>
                                    ${geolocation.zip ? `<strong>📮 ZIP:</strong> ${geolocation.zip}<br>` : ''}
                                    ${geolocation.timezone ? `<strong>🕐 Timezone:</strong> ${geolocation.timezone}<br>` : ''}
                                    ${geolocation.latitude && geolocation.longitude ? `<strong>📌 Coordinates:</strong> ${geolocation.latitude}, ${geolocation.longitude}<br>` : ''}
                                    ${geolocation.isp ? `<strong>🌐 ISP:</strong> ${geolocation.isp}<br>` : ''}
                                    ${geolocation.org ? `<strong>🏢 Organization:</strong> ${geolocation.org}` : ''}
                                </div>
                            </div>
                            ` : ''}
                            
                            <div class="info-box">
                                <div class="info-label">🕐 Timestamp</div>
                                <div class="info-value">${timestamp}</div>
                            </div>
                            
                            <div class="info-box">
                                <div class="info-label">🖥️ User Agent</div>
                                <div class="info-value" style="font-size: 13px; word-break: break-word;">${event.headers['user-agent'] || 'Unknown'}</div>
                            </div>
                        </div>
                        <div class="footer">
                            This is an automated notification from your portfolio gateway.<br>
                            You're receiving this because someone attempted to access your protected content.
                        </div>
                    </div>
                </body>
                </html>
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
                ip: visitorIP,
                geolocation: geolocation
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
