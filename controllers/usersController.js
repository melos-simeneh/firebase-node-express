const db = require("../config/firebase.js");

const collectionName = "testCollection";

exports.getUsers = async (req, res) => {
  const snapshot = await db.collection(collectionName).get();
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(data);
};

exports.createUser = async (req, res) => {
  const { FirstName, LastName } = req.body;
  if (!FirstName || !LastName) {
    // Here we send a controlled response, not throw an error
    return res
      .status(400)
      .json({ error: "FirstName and LastName are required" });
  }

  const docRef = await db
    .collection(collectionName)
    .add({ FirstName, LastName });
  res.status(201).json({ message: "User added successfully", id: docRef.id });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { FirstName, LastName } = req.body;

  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).json({ error: "User not found" });
  }

  await docRef.update({ FirstName, LastName });
  res.json({ message: "User updated successfully" });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).json({ error: "User not found" });
  }

  await docRef.delete();
  res.json({ message: "User deleted successfully" });
};
