require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const taskRoutes = require("./routes/taskRoutes");
const noteRoutes = require("./routes/noteRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 FocusFlow API on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
