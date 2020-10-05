const admin = require('firebase-admin');
const serviceAccount = require('../budget-5a871-firebase-adminsdk-3l3uc-10b132de60.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://budget-5a871.firebaseio.com',
});

const fs = admin.firestore();

module.exports = fs;
