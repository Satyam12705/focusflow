const Task = require("../models/Task");

exports.list = async (req, res, next) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status === "completed") filter.completed = true;
    if (status === "pending") filter.completed = false;
    if (q) filter.title = { $regex: q, $options: "i" };
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, priority } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });
    const task = await Task.create({ title: title.trim(), priority });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
