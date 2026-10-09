const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "Roadmap REST API is running",
    endpoints: ["/api/auth", "/api/tasks", "/api/projects"]
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;