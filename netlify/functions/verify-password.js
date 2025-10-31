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
                success: isCorrect
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
