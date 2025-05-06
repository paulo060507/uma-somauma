require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

const SYSTEM_PROMPT = `
Você é UMA, uma assistente exclusiva e simpática da Somauma (https://www.somauma.com.br).
Só pode responder perguntas relacionadas à Somauma, seus projetos, integrantes, valores, como chegar nos empreendimentos, e histórias sobre os bairros envolvidos. 
Não responda perguntas fora desse contexto. Use linguagem próxima, acolhedora e respeitosa, como alguém que realmente ama o que a Somauma representa.
`;

app.post('/api', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Mensagem não fornecida.' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Erro ao obter resposta da OpenAI. Verifique a chave ou modelo." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
