const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
    console.log('Connnection Sucessfull to DB');
}).catch((err) => console.log(err))