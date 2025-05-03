const express = require('express');
const router = express.Router();
const protect = require("../middleware/authMiddleware")
const Task = require('../model/taskSchema');
const Employee = require('../model/employess');


// createTask
router.post('/task', protect, async(req, res)=> {
    try {
        const {title, description, assignedTo, priority, deadline, status} = req.body

        const employee = await Employee.findById(assignedTo);
        if (!employee) return res.status(400).json({error: "Employee not found"});

        const task = await Task.create({
            title,
            description,
            assignedTo,
            priority, 
            deadline, 
            status
        });

        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});


// get all task 

router.get('/getTask', protect, async(req, res)=> {
    try {
        const tasks = await Task.find().populate('assignedTo', "name email")
        res.status(201).json(tasks)

    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});


// get single Task

router.get('/task/:id', protect, async(req, res)=> {
    try {
        
        const task = await Task.findById(req.params.id).populate('assignedTo', "name email");
        if(!task) {
            return res.status(404).json({error: "Task Not Found"});

        }

        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});

// update task 

router.put('/task/:id', protect, async(req, res)=> {
    try {
        
        const {title, description, assignedTo, priority, deadline, status} = req.body

        let task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({error:"Task not found"});

        task.status = status || task.status;
        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.deadline = deadline || task.deadline;

        if (assignedTo) {
            const employee = await  Employee.findById(assignedTo);
            if(!employee) return res.status(400).json({error: "Employee not found"});
            task.assignedTo = assignedTo;

        }

        task = await task.save();

        res.status(200).json(task)
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});


// delete task 

router.delete('/task/:id', protect, async(req, res)=> {
    try {
        
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if(!deleted) {
            return res.status(404).json({error: "Task Not Found"});

        }

        res.status(201).json({message: "Task Deleted"});
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});

module.exports = router