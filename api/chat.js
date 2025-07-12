// api/chat.js
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { messages } = req.body;
    const apiKey = process.env.OPENAI_API_KEY; // Set this in Vercel dashboard
  
    try {
      // Read knowledge.txt from the public directory
      const knowledgePath = path.join(process.cwd(), 'public', 'knowledge.txt');
      const knowledge = await fs.readFile(knowledgePath, 'utf-8');
      // Prepend the system prompt with knowledge
      const systemPrompt = {
        role: 'system',
        content: `You are a privacy assistant. Use only this knowledge to answer questions:\n${knowledge}`
      };
      const newMessages = [systemPrompt, ...messages.filter(m => m.role !== 'system')];

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        }),
      });
  
      const data = await openaiRes.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'OpenAI request failed' });
    }
  }
