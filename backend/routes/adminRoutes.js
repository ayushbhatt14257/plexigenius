const express = require('express');
const router = express.Router();
const Admin = require('../model/adminSchema');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const protect = require("../middleware/authMiddleware")


// registartion api
router.post("/register", async(req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name, !email, !password) {
            return res.status(400).json({error: "All the field are required"});
        }
        
        const existingAdmin = await Admin.findOne({email});
        
        if (existingAdmin) {
            return res.status(400).json({error: "Admin already exists"});
        }
        
        const newAdmin = await Admin.create({name, email, password});
        const token = generateToken(newAdmin._id);

        res.status(201).json({
            message: "Admin register successfully",
            token,
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
            },

        });
    } catch (error) {
        res.status(500).json({error:"Server error", error: error.message});
    }
});

// login api 
router.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body;

        const admin = await Admin.findOne({email:email});

        if (!admin){
            return res.status(401).json({error: "User Not Found"});
        }
        
        const isMatch = await bcrypt.compare(password, admin.password);
        
        if(!isMatch) {
            return res.status(401).json({error: "Invalid Credintals"});
        }

        const token = generateToken(admin._id);

        res.status(200).json({
            message: "Login Successfull",
            token,
            admin:{
                id: admin._id,
                name: admin.name,
                email:admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
});




// auth test 
// router.get('/dash', protect, (req, res) => {
//     res.json({message: "Welcome", admin: req.admin});
// })

module.exports = router;