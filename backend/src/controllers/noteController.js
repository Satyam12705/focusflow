const Note = require("../models/Note");

exports.list = async (_req, res, next) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: "Text is required" });
    const note = await Note.create({ text: text.trim() });
    res.status(201).json(note);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
