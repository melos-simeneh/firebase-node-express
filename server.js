const express = require("express");
const usersRoutes = require("./routes/users.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Users routes
app.use("/users", usersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
