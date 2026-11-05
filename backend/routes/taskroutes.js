
const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authmiddleware");

// ==================================
// ADD TASK
// ==================================
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, priority, status, dueDate } = req.body;

        const task = await Task.create({
            title,
            description,
            priority,
            status,
            dueDate,
            user: req.userId
        });

        res.status(201).json(task);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// ==================================
// GET LOGGED-IN STUDENT'S TASKS
// ==================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// ==================================
// UPDATE OWN TASK
// ==================================
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { user, _id, ...updates } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found or access denied"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// ==================================
// DELETE OWN TASK
// ==================================
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found or access denied"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// ==================================
// EXPORT ROUTER
// ==================================
module.exports = router;
