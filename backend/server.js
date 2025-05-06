
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const forbiddenWords = ["sexo", "religião", "futebol", "preto", "macaco", "viado", "sapatão", "negrão",
                        "merda", "caralho", "porra", "buceta", "puta", "babaca", "imbecil", "otário"];

const greetings = ["oi", "olá", "bom dia", "boa tarde", "boa noite"];

const baseConhecimento = {
    "quem é a somauma": "A Somauma é uma empresa dedicada ao desenvolvimento de empreendimentos inovadores e sustentáveis.",
    "me fale sobre os empreendimentos": "Atualmente, a Somauma possui empreendimentos em desenvolvimento nas regiões mais promissoras de São Paulo.",
    "como faço contato": "Você pode entrar em contato pelo e-mail: contato@somauma.com.br ou telefone: +55 (11) 99999-9999."
};

app.post('/api', async (req, res) => {
    const question = req.body.message.toLowerCase();

    if (forbiddenWords.some(w => question.includes(w))) {
        return res.json({ response: "Desculpe, não posso responder a esse tipo de pergunta." });
    }

    if (greetings.some(g => question.includes(g))) {
        return res.json({ response: "Olá! Eu sou a UMA, a assistente da Somauma. Em que posso ajudar?" });
    }

    const resposta = Object.entries(baseConhecimento).find(([chave]) => question.includes(chave));
    if (resposta) {
        return res.json({ response: resposta[1] });
    }

    try {
        const openaiRes = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = openaiRes.data.choices[0].message.content;
        return res.json({ response: reply });
    } catch (err) {
        return res.json({ response: "Desculpe, houve um problema ao acessar minha inteligência externa." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
