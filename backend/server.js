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

    if (!msg) return res.json({ message: "Por favor, digite algo." });

    if (contemProibida(msg)) {
        return res.json({ message: "Desculpe, não posso responder a esse tipo de pergunta." });
    }

    const systemPrompt = `Você é UMA, a IA da Somauma, empresa de empreendimentos imobiliários no Brasil. Sempre que receber cumprimentos (oi, olá, bom dia), diga: "Olá! Eu sou a UMA, assistente virtual da Somauma. Como posso te ajudar?". Caso perguntem sobre a Somauma, explique que ela atua com imóveis e inovação. Para contatos ou interesse em compra, diga: "Entre em contato via e-mail contato@somauma.com.br ou pelo telefone +55 (11) 99999-9999". Não fale sobre religião, futebol, política, sexo ou qualquer tema ofensivo.`;

    try {
        const resposta = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: modelo,
            messages: [
                { role: 'system', content: systemPrompt },
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
        return res.json({ message: "Houve um erro ao acessar minha inteligência. Tente novamente em breve." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor online na porta ${PORT}`));