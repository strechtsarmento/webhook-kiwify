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

const chave = gerarChave();

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

// SERVIDOR
app.listen(3000, () => {

  console.log('Servidor rodando na porta 3000');

});