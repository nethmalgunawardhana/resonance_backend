const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json"); // Adjust the path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
