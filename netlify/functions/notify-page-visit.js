const { Resend } = require('resend');

// In-memory storage for IP visit tracking per page
const ipPageVisits = new Map();

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

// Function to get page emoji and title
function getPageInfo(pageName) {
    const pageMap = {
        'index': { emoji: '🏠', title: 'Home Page', description: 'Main landing page' },
        'about-me': { emoji: '👤', title: 'About Me Page', description: 'Personal information page' },
        'contact': { emoji: '📧', title: 'Contact Page', description: 'Contact information page' },
        'past-works': { emoji: '💼', title: 'Past Works Page', description: 'Portfolio and projects page' }
    };
    return pageMap[pageName] || { emoji: '📄', title: 'Unknown Page', description: 'Page visit' };
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
        // Get page information from request body
        const { pageName, pageUrl } = JSON.parse(event.body || '{}');
        
        // Get the visitor's IP address (all IPs in chain for display)
        const visitorIPFull = event.headers['x-forwarded-for'] || 
                              event.headers['x-nf-client-connection-ip'] || 
                              'unknown';
        
        // Extract the actual client IP (first IP in x-forwarded-for chain)
        // Format: "client_ip, proxy1_ip, proxy2_ip"
        const clientIP = visitorIPFull.split(',')[0].trim();

        // Track visits by IP and page
        const visitKey = `${clientIP}-${pageName}`;
        const currentVisits = ipPageVisits.get(visitKey) || 0;
        const visitNumber = currentVisits + 1;
        ipPageVisits.set(visitKey, visitNumber);

        // Get total visits across all pages for this IP
        let totalVisits = 0;
        ipPageVisits.forEach((count, key) => {
            if (key.startsWith(clientIP)) {
                totalVisits += count;
            }
        });

        // Get geolocation data based on actual client IP
        const geolocation = await getGeolocation(clientIP);

        // Get page information
        const pageInfo = getPageInfo(pageName);

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
            from: 'Website Visitor Alert <onboarding@resend.dev>',
            to: 'rioanggaraclub@gmail.com',
            subject: `${pageInfo.emoji} New Visitor on ${pageInfo.title} - rioanggara.com`,
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
                        .highlight-box { background: #e8f5e9; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #4caf50; }
                        .footer { background: #333; color: #999; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
                        .badge { background: #667eea; color: white; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: bold; }
                        .page-icon { font-size: 48px; text-align: center; margin: 15px 0; }
                        .stats-container { display: flex; gap: 10px; margin: 15px 0; }
                        .stat-box { flex: 1; background: #f0f0f0; padding: 12px; border-radius: 6px; text-align: center; }
                        .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
                        .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>${pageInfo.emoji} New Visitor Detected!</h2>
                        </div>
                        <div class="content">
                            <div class="page-icon">${pageInfo.emoji}</div>
                            
                            <div class="highlight-box">
                                <div class="info-label">📊 Page Visit Notification</div>
                                <div class="info-value">A visitor accessed <strong>${pageInfo.title}</strong> on your website rioanggara.com</div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
                                <div class="stat-box">
                                    <div class="stat-number">#${visitNumber}</div>
                                    <div class="stat-label">Visit to This Page</div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-number">${totalVisits}</div>
                                    <div class="stat-label">Total Visits (All Pages)</div>
                                </div>
                            </div>
                            
                            <div class="info-box">
                                <div class="info-label">🌐 Page Information</div>
                                <div class="info-value">
                                    <strong>Page Name:</strong> ${pageInfo.title}<br>
                                    <strong>Description:</strong> ${pageInfo.description}<br>
                                    <strong>URL:</strong> ${pageUrl || 'rioanggara.com/' + pageName}
                                </div>
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

                            <div class="info-box">
                                <div class="info-label">📱 Device Information</div>
                                <div class="info-value">
                                    <strong>Referrer:</strong> ${event.headers['referer'] || 'Direct visit'}<br>
                                    <strong>Accept Language:</strong> ${event.headers['accept-language'] || 'Unknown'}
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            This is an automated notification from rioanggara.com<br>
                            You're receiving this because someone visited your website.
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        console.log('Page visit notification email sent successfully:', emailData);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                visitNumber: visitNumber,
                totalVisits: totalVisits,
                clientIP: clientIP,
                ipChain: visitorIPFull,
                geolocation: geolocation,
                pageName: pageName,
                pageInfo: pageInfo
            })
        };
    } catch (error) {
        console.error('Error sending page visit notification:', error);
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
