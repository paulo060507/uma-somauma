const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

app.post('/ask', (req, res) => {
    const question = req.body.question.toLowerCase();
    const dados = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/dados.json'), 'utf8'));
    let resposta = "Desculpe, não encontrei informações sobre isso na base da Somauma.";

    if (question.includes("quem criou")) resposta = dados.somauma.criador;
    else if (question.includes("empreendimentos")) resposta = dados.somauma.empreendimentos;
    else if (question.includes("equipe")) resposta = dados.somauma.equipe;
    else if (question.includes("valores")) resposta = dados.somauma.valores;
    else if (question.includes("somauma")) resposta = dados.somauma.sobre;

    res.json({ answer: resposta });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
