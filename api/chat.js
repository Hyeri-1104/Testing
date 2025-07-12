// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { messages } = req.body;
    const apiKey = process.env.OPENAI_API_KEY; // Set this in Vercel dashboard
  
    try {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
        }),
      });
  
      const data = await openaiRes.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'OpenAI request failed' });
    }
  }