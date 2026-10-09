const express = require("express");
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

// GET /api/tasks - list current user's tasks
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks - create a task
router.post("/", async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.create({
      title,
      description,
      completed,
      owner: req.user._id
    });
    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id - get one task
router.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id - update a task
router.put("/:id", async (req, res, next) => {
  try {
    const allowed = ["title", "description", "completed"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated", task });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;