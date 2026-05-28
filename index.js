const express = require('express');
const admin = require('firebase-admin');

const app = express();

app.use(express.json());

// IMPORTAR CHAVE FIREBASE
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// FIRESTORE
const db = admin.firestore();

// WEBHOOK
app.post('/webhook', async (req, res) => {

  try {

    console.log('Webhook recebido');

   const data = req.body;

console.log('Webhook recebido');
console.log(JSON.stringify(data, null, 2));

    // ID DA COMPRA
    const chave = Math.floor(1000 + Math.random() * 9000) + '-' +
    Math.random().toString(36).substring(2, 18);

    // SALVAR FIRESTORE
    await db.collection('chaves').doc(chave).set({

      nome: data.Customer?.full_name || '',
      email: data.Customer?.email || '',
      produto: data.Product?.name || '',
      status: 'ativo', || '',
      criadoEm: new Date()

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