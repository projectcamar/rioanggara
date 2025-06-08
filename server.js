require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

// Store the hashed password (in production, this should be in a secure database)
const hashedPassword = process.env.HASHED_PASSWORD || '$2b$10$YourHashedPasswordHere';

// Password verification endpoint
app.post('/verify-password', async (req, res) => {
    try {
        const { password } = req.body;
        
        // Compare the provided password with the stored hash
        const isValid = await bcrypt.compare(password, hashedPassword);
        
        if (isValid) {
            // Generate a session token or JWT here if needed
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) {
        console.error('Password verification error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Move API call to server-side
app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-2024-07-18",
        messages: req.body.messages,
        temperature: 1,
        max_tokens: 2048
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 