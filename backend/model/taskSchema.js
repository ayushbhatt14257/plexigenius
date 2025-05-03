const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String, 
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', "medium", "high"],
        default: "medium"
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        defalut: 'pending',
    }
}, {timestamps: true});

module.exports = mongoose.model('Task', taskSchema);