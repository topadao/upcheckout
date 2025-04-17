const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/gerar-pix', async (req, res) => {
  try {
    const tokenRes = await fetch('https://api.pixupbr.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: 'gomes1551_5842553951',
        client_secret: '15833350cb95c397d6d0cf15057644abbb305b5546a7130005f8463caeaea3cf',
      }),
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    const qrRes = await fetch('https://api.pixupbr.com/v2/pix/qrcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        valor: 36.9,
        recebedor: 'padrao',
        descricao: 'Pagamento Cred Amigo',
        expiraEm: 900,
      }),
    });

    const qrData = await qrRes.json();
    res.json(qrData);
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err);
    res.status(500).json({ erro: 'Erro ao gerar QR Code' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});