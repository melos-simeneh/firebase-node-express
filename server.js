const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseAdminConfig.json");

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// GET /users - fetch all documents from Firestore
app.get("/users", async (req, res) => {
  const db = admin.firestore();
  const snapshot = await db.collection("testCollection").get();
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

// Global error handler
app.use((err, req, res, next) => {
  res
    .status(err.status ?? 500)
    .json({ error: err.message ?? "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
