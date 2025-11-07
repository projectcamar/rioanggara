const { Resend } = require('resend');

// In-memory storage for IP play tracking
const ipPlayClicks = new Map();

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
        // Get the visitor's IP address (all IPs in chain for display)
        const visitorIPFull = event.headers['x-forwarded-for'] || 
                              event.headers['x-nf-client-connection-ip'] || 
                              'unknown';
        
        // Extract the actual client IP (first IP in x-forwarded-for chain)
        // Format: "client_ip, proxy1_ip, proxy2_ip"
        const clientIP = visitorIPFull.split(',')[0].trim();

        // Track play button clicks by IP
        const currentClicks = ipPlayClicks.get(clientIP) || 0;
        const clickNumber = currentClicks + 1;
        ipPlayClicks.set(clientIP, clickNumber);

        // Get geolocation data based on actual client IP
        const geolocation = await getGeolocation(clientIP);

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
            subject: `🎵 Play Button Clicked #${clickNumber}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #D04A02 0%, #FFB600 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                        .header h2 { margin: 0; font-size: 24px; }
                        .content { background: #f9f9f9; padding: 25px; border: 1px solid #e0e0e0; border-top: none; }
                        .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #D04A02; }
                        .info-label { font-weight: bold; color: #555; font-size: 14px; }
                        .info-value { color: #333; font-size: 15px; margin-top: 5px; }
                        .highlight-box { background: #fff3e0; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #FFB600; }
                        .footer { background: #333; color: #999; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
                        .badge { background: #D04A02; color: white; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: bold; }
                        .music-icon { font-size: 48px; text-align: center; margin: 15px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>🎵 Play Button Clicked!</h2>
                        </div>
                        <div class="content">
                            <div class="music-icon">🎶</div>
                            
                            <div class="highlight-box">
                                <div class="info-label">📊 Play Button Click</div>
                                <div class="info-value">A visitor clicked the play button to listen to the music on your password gateway!</div>
                            </div>
                            
                            <div class="info-box">
                                <div class="info-label">Click Number</div>
                                <div class="info-value"><span class="badge">#${clickNumber}</span></div>
                            </div>
                            
                            <div class="info-box">
                                <div class="info-label">📍 Visitor IP Address</div>
                                <div class="info-value">
                                    <strong>Client IP:</strong> ${clientIP}<br>
                                    <span style="font-size: 12px; color: #666;">Full Chain: ${visitorIPFull}</span>
                                </div>
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
                            ` : `
                            <div class="info-box" style="background: #fff3cd; border-left-color: #ffc107;">
                                <div class="info-label">⚠️ Geolocation Info</div>
                                <div class="info-value">Geolocation data could not be retrieved for IP: ${clientIP}</div>
                            </div>
                            `}
                            
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
                            You're receiving this because someone clicked the play button on your password gate.
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        console.log('Play button notification email sent successfully:', emailData);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                clickNumber: clickNumber,
                clientIP: clientIP,
                ipChain: visitorIPFull,
                geolocation: geolocation
            })
        };
    } catch (error) {
        console.error('Error sending play button notification:', error);
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
