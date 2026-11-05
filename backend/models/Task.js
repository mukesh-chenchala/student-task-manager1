
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium"
    },

    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },

    dueDate: {
        type: Date
    }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
