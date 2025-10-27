require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

// Password validation endpoint
app.post('/api/validate-password', (req, res) => {
  try {
    const { password } = req.body;
    const correctPassword = process.env.PORTFOLIO_PASSWORD || 'riora354';
    
    if (password === correctPassword) {
      res.json({ valid: true, message: 'Password correct' });
    } else {
      res.json({ valid: false, message: 'Password incorrect' });
    }
  } catch (error) {
    console.error('Password validation error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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