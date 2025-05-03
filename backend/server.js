const express = require("express");
const app = express();
require("dotenv").config();

const path = require('path')


require('./db/conn');

const adminroute = require('./routes/adminRoutes')
const employeeroute = require('./routes/employessRoute')
const taskroute = require('./routes/taskRoutes')



app.use(express.json());
// app.use(adminroute);
// app.use(employeeroute);
// app.use(taskroute);
app.use("/api/admin", adminroute);
app.use("/api/employees", employeeroute);
app.use("/api/tasks", taskroute);



const PORT = process.env.PORT || 5000;

// const _dirname = path.resolve();
// app.use(express.static(path.join(_dirname, '/frontend/build')));
// app.get('*', (req, res) =>
//     res.sendFile(path.join(_dirname, '/frontend/build/index.html'))
// );

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static("frontend/build"));
// }

const buildPath = path.resolve(__dirname, 'frontend', 'build');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
