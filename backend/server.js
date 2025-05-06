const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 10000;

app.use(cors());
app.use(bodyParser.json());

app.post('/ask', (req, res) => {
    const question = req.body.question.toLowerCase();
    const data = JSON.parse(fs.readFileSync(__dirname + '/../frontend/dados.json', 'utf8'));

    let answer = "Desculpe, não tenho uma resposta para isso.";

    if (question.includes("equipe")) {
        answer = data.equipe;
    } else if (question.includes("quem criou") || question.includes("fundador")) {
        answer = data.quem_criou;
    } else if (question.includes("empreendimento") || question.includes("projeto")) {
        answer = data.empreendimentos;
    }

    res.json({ answer });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
