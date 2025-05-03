const express = require('express');
const router = express.Router();
const protect = require("../middleware/authMiddleware")
const Employee = require('../model/employess');


// create employee 
router.post('/employee', protect, async(req, res) => {
    try {
        const {name, email, phone, department, status} = req.body;
        const existing = await Employee.findOne({email});

        if (existing) {
            return res.status(400).json({error: "Email already exists"});
        }
        const employee = await Employee.create({name, email, phone, department, status})
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});

// get all employee 
 
router.get("/getEmployee" , protect, async(req, res) => {
    try {
        const employees = await Employee.find().sort({createdAt: -1});
        res.status(201).json(employees);
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});



// get one employee
router.get("/employee/:id/" , protect, async(req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({error: "Not found"});
        }
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});


// update one 
router.put("/employee/:id/" , protect, async(req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(req.params.id, req.body,{new: true});
        if (!updated) {
            return res.status(404).json({error: "Not found"});
        }
        res.status(201).json(updated);
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
});

//delete One
router.delete('/employee/:id/', protect, async(req, res)=> {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({error: "Not found"});
        }
        res.status(201).json({message: "Employee Deleted"});
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
})

module.exports = router
