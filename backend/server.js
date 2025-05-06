const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const apiKey = process.env.OPENAI_API_KEY;
const modelo = 'gpt-4o-mini';

const bloqueios = ['sexo', 'religião', 'futebol', 'preto', 'macaco', 'viado', 'sapatão', 'negrão', 'merda', 'caralho', 'porra', 'buceta', 'puta', 'babaca', 'imbecil', 'otário'];

function contemProibida(msg) {
    return bloqueios.some(p => msg.toLowerCase().includes(p));
}

app.post('/api/chat', async (req, res) => {
    const msg = req.body.message;

    if (!msg) return res.json({ message: "Por favor, digite algo para que eu possa te ajudar." });

    if (contemProibida(msg)) {
        return res.json({ message: "Peço desculpas, mas não posso responder esse tipo de conteúdo. Estou aqui para ajudar com informações sobre a Somauma!" });
    }

    const prompt = `
Você é UMA, a assistente virtual da Somauma. 
Sua missão é responder com educação, simpatia e clareza, como uma atendente experiente que conhece bem a empresa. 
Sempre que alguém disser "oi", "olá", "bom dia", etc., responda: 
"Olá! Eu sou a UMA, assistente virtual da Somauma. Como posso te ajudar hoje?"

Se alguém perguntar sobre:
- "quem é a Somauma", diga que é uma empresa brasileira com atuação em projetos imobiliários inovadores e sustentáveis.
- "empreendimentos", fale que há projetos em andamento em várias regiões do Brasil e que, para saber mais, basta entrar em contato.
- "como comprar" ou "quero comprar", oriente: "Entre em contato via e-mail contato@somauma.com.br ou telefone +55 (11) 99999-9999".
- Nunca responda sobre religião, política, futebol, sexualidade ou ofensas. 
Se não entender algo, diga que está aqui para responder somente dúvidas relacionadas à Somauma.

Seja natural, como se estivesse conversando com um visitante interessado no site da Somauma.
`;

    try {
        const resposta = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: modelo,
            messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: msg }
            ],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return res.json({ message: resposta.data.choices[0].message.content });
    } catch (err) {
        console.error(err.response?.data || err.message);
        return res.json({ message: "Houve um erro ao tentar responder. Por favor, tente novamente em instantes." });
    }
});

app.listen(3000, () => console.log("Servidor UMA online na porta 3000"));