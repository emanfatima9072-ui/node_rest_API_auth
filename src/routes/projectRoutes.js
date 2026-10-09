const express = require("express");
const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect);

// GET /api/projects
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ count: projects.length, projects });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects
router.post("/", async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const project = await Project.create({
      name,
      description,
      status,
      owner: req.user._id
    });
    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ project });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id
router.put("/:id", async (req, res, next) => {
  try {
    const allowed = ["name", "description", "status"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project updated", project });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;