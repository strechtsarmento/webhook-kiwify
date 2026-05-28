const express = require('express');
const admin = require('firebase-admin');

const app = express();

app.use(express.json());

// IMPORTAR CHAVE FIREBASE
const serviceAccount = require('./serviceAccountKey.json');

// INICIAR FIREBASE
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

    console.log(data);

    // ID DA COMPRA
    const orderId = data.order_id || Date.now().toString();

    // SALVAR FIRESTORE
    await db.collection('chaves').doc(orderId).set({

      nome: data.Customer?.full_name || '',
      email: data.Customer?.email || '',
      produto: data.Product?.name || '',
      status: data.order_status || '',
      criadoEm: new Date()

    });

    console.log('Dados salvos no Firestore');

    res.status(200).send('OK');

  } catch (error) {

    console.error(error);

    res.status(500).send(error);

  }

});

// SERVIDOR
app.listen(3000, () => {

  console.log('Servidor rodando na porta 3000');

});