const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const path = require('path')


require('./db/conn');

const adminroute = require('./routes/adminRoutes')
const employeeroute = require('./routes/employessRoute')
const taskroute = require('./routes/taskRoutes')



app.use(express.json());
app.use(adminroute);
app.use(employeeroute);
app.use(taskroute);



const PORT = process.env.PORT || 5000;

const _dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(_dirname, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(_dirname, '/frontend/build/index.html'));
    });
}


app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
