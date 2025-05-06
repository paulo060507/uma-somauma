const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('frontend'));

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    const messages = [
        {
            role: "system",
            content: "Você é UMA, a assistente dedicada exclusivamente à Somauma. Responda apenas perguntas relacionadas à Somauma, seus projetos, integrantes, imóveis e regiões de atuação. Se a pergunta não for sobre isso, diga educadamente que só pode responder sobre a Somauma."
        },
        {
            role: "user",
            content: userMessage
        }
    ];

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.7
            })
        });

        const data = await response.json();

        const resposta = data.choices && data.choices[0]?.message?.content?.trim();
        if (resposta) {
            res.json({ reply: resposta });
        } else {
            res.json({ reply: 'Erro: resposta vazia. Verifique o modelo, a chave ou os créditos disponíveis.' });
        }
    } catch (err) {
        res.status(500).json({ reply: 'Erro ao acessar a API da OpenAI. Verifique sua conexão ou chave.' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
