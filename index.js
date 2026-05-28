const express = require('express');
const admin = require('firebase-admin');
const { Resend } = require('resend');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());

// FIREBASE
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// GERAR CHAVE
function gerarChave() {

  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let resultado = '';

  for (let i = 0; i < 16; i++) {

    resultado += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );

  }

  return (
    Math.floor(1000 + Math.random() * 9000) +
    '-' +
    resultado
  );
}

// WEBHOOK
app.post('/webhook', async (req, res) => {

  try {

    console.log('Webhook recebido');

    const data = req.body;

    console.log(JSON.stringify(data, null, 2));

    // GERAR CHAVE
    const chave = gerarChave();

    // SALVAR FIRESTORE
    await db.collection('chaves').doc(chave).set({

      chave: chave,

      nome: data.Customer?.full_name || '',

      email: data.Customer?.email || '',

      produto:
        data.Product?.product_name ||
        data.Product?.name ||
        '',

      status: 'ativo',

      order_id: data.order_id || '',

      subscription_id: data.subscription_id || '',

      criadoEm: new Date()

    });

await resend.emails.send({

  from: 'onboarding@resend.dev',

  to: data.Customer?.email,

  subject: 'Sua chave de acesso',

  html: `

    <h1>Compra aprovada ✅</h1>

    <p>Olá ${data.Customer?.full_name}</p>

    <p>Sua chave de acesso:</p>

    <h2>${chave}</h2>

    <p>Status: ativo</p>

  `
});

    console.log('Dados salvos no Firestore');

    res.status(200).send('OK');

  } catch (error) {

    console.error('ERRO FIREBASE:');

    console.error(error);

    res.status(500).send(error);

  }

});

// SERVIDOR
app.listen(3000, () => {

  console.log('Servidor rodando na porta 3000');

});