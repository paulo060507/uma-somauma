const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = `Responda como se fosse a UMA, uma assistente da Somauma. Responda com educação, humanidade e só fale sobre a Somauma, seus empreendimentos, equipe e projetos. Se o assunto não for relacionado à Somauma, diga com jeitinho que não pode ajudar. Mensagem: "${message}"`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const resposta = response.data.choices[0].message.content;
    res.json({ resposta });
  } catch (error) {
    console.error('Erro na OpenAI:', error.response?.data || error.message);
    res.status(500).json({ resposta: 'Erro ao processar a resposta. Verifique a chave da API e tente novamente.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
