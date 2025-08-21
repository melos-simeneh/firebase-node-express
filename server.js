const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseAdminConfig.json");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const collectionName = "testCollection";

// Get all users
app.get("/users", async (req, res, next) => {
  try {
    const snapshot = await db.collection(collectionName).get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Insert a new user (POST)
app.post("/users", async (req, res, next) => {
  try {
    const { FirstName, LastName } = req.body;
    if (!FirstName || !LastName) {
      return res
        .status(400)
        .json({ error: "FirstName and LastName are required" });
    }

    const docRef = await db
      .collection(collectionName)
      .add({ FirstName, LastName });
    res.status(201).json({ message: "User added successfully", id: docRef.id });
  } catch (error) {
    next(error);
  }
});

// Update a user (PUT)
app.put("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { FirstName, LastName } = req.body;

    const docRef = db.collection(collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await docRef.update({ FirstName, LastName });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
});

// Delete a user (DELETE)
app.delete("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const docRef = db.collection(collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await docRef.delete();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// 404 Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
