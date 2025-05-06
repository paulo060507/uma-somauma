const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

app.post('/ask', (req, res) => {
    const question = req.body.question.toLowerCase();
    const dados = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/dados_somauma.json'), 'utf8'));
    let resposta = "Desculpe, ainda estou aprendendo sobre isso.";

    if (question.includes("quem criou") || question.includes("fundador")) {
        resposta = dados.empresa.descricao;
    } else if (question.includes("empreendimento") || question.includes("projeto")) {
        resposta = dados.empreendimentos.map(function(e) {
            return `🏢 ${e.nome}: ${e.descricao}`;
        }).join("\n\n");
    } else if (question.includes("equipe") || question.includes("quem trabalha")) {
        resposta = dados.equipe.map(function(p) {
            return `${p.nome} - ${p.cargo}: ${p.descricao}`;
        }).join("\n\n");
    } else if (question.includes("missão")) {
        resposta = dados.empresa.missao;
    } else if (question.includes("visão")) {
        resposta = dados.empresa.visao;
    } else if (question.includes("valores")) {
        resposta = dados.empresa.valores.join(", ");
    } else if (
        question.includes("contato") || question.includes("email") || question.includes("telefone") ||
        question.includes("comprar") || question.includes("adquirir") || question.includes("interesse") ||
        question.includes("investir") || question.includes("alugar") || question.includes("preço") || question.includes("valor")
    ) {
        resposta = `Fico feliz com seu interesse! Para conhecer mais detalhes ou adquirir um empreendimento da Somauma, entre em contato pelo e-mail: ${dados.empresa.contato.email} ou telefone: ${dados.empresa.contato.telefone}`;
    } else if (question.includes("local") || question.includes("como chegar")) {
        resposta = `A Somauma está localizada em: ${dados.empresa.localizacao}`;
    }

    res.json({ answer: resposta });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
