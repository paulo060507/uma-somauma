const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('frontend'));

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    const somaumaPrompt = `Responda apenas se a pergunta for sobre a Somauma, seus integrantes, seus projetos ou os bairros, prédios e eventos onde atuam. Caso contrário, diga: 'Desculpe, só posso responder sobre a Somauma.'\n\nUsuário: ${userMessage}\nIA:`;

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: somaumaPrompt,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].text.trim() });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao acessar a OpenAI API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
