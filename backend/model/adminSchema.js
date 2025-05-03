const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    email:{
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    }
},{timestamps:true});

adminSchema.pre("save", async function (next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

module.exports = mongoose.model('Admin', adminSchema)