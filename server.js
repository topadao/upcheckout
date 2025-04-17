const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const client_id = 'gomes1551_5842553951';
const client_secret = '15833350cb95c397d6d0cf15057644abbb305b5546a7130005f8463caeaea3cf';

async function gerarToken() {
  const res = await fetch('https://api.pixupbr.com/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id, client_secret })
  });
  const data = await res.json();
  return data.access_token;
}

app.post('/gerar-pix', async (req, res) => {
  try {
    const token = await gerarToken();

    const resposta = await fetch('https://api.pixupbr.com/v2/pix/qrcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        valor: 36.9,
        descricao: "Pagamento Cred Amigo",
        expiracao: 900
      })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      res.json(dados);
    } else {
      res.status(400).json({ erro: dados });
    }
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err);
    res.status(500).json({ erro: 'Erro interno ao gerar o QR Code' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
