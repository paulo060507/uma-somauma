require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
    const question = req.body.question;
    const apiKey = process.env.OPENAI_API_KEY;
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Você é UMA, uma IA que só responde sobre a Somauma, seus empreendimentos, equipe, história, valores, formas de chegar e informações do entorno dos prédios. Fale de forma humana, gentil e útil." },
                { role: "user", content: question }
            ]
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });
        res.json({ answer: response.data.choices[0].message.content });
    } catch (error) {
        res.json({ answer: "Erro: resposta vazia da OpenAI. Verifique a chave ou modelo." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});