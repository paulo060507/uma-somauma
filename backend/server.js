
const express = require("express");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const dados = JSON.parse(fs.readFileSync(path.join(__dirname, "../frontend/dados.json")));
const proibidas = ["sexo", "religião", "futebol", "macaco", "viado", "preto", "negrão", "sapatão"];

function responderLocalmente(pergunta) {
    const p = pergunta.toLowerCase();
    if (proibidas.some(palavra => p.includes(palavra))) {
        return "Desculpe, não posso responder a esse tipo de pergunta.";
    }
    if (p.includes("contato")) return dados.contato;
    if (p.includes("empreendimento")) return dados.empreendimentos;
    if (p.includes("quem é a somauma") || p.includes("o que é a somauma")) return dados.empresa;
    if (p.includes("equipe")) return dados.equipe;
    if (p.includes("onde") || p.includes("localiza")) return dados.localizacao;
    if (["oi", "olá", "bom dia", "boa tarde", "boa noite"].some(s => p.includes(s)))
        return "Olá! Eu sou a UMA, assistente virtual da Somauma. Como posso te ajudar hoje?";
    return null;
}

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;
    const resposta = responderLocalmente(userMessage);
    if (resposta) return res.json({ response: resposta });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Você é UMA, a assistente da Somauma. Responda com simpatia, clareza e foco em imóveis e inovação. Nunca fale sobre temas proibidos como religião, sexo, futebol ou ofensas." },
                { role: "user", content: userMessage }
            ]
        });
        return res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        return res.json({ response: "Desculpe, ocorreu um erro ao responder. Tente novamente em instantes." });
    }
});

app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
