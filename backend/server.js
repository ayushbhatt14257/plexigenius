const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors')


const path = require("path")


require('./db/conn');

if (process.env.NODE_ENV !== 'production') {
    app.use(cors({
      origin: "http://localhost:5000", 
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    }));
}
  

const adminroute = require('./routes/adminRoutes')
const employeeroute = require('./routes/employessRoute')
const taskroute = require('./routes/taskRoutes')



app.use(express.json());
app.use(adminroute);
app.use(employeeroute);
app.use(taskroute);



const PORT = process.env.PORT || 5000;

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, '/frontend/build')));
app.get('/', (req, res) =>
    res.sendFile(path.join(_dirname, '/frontend/build/index.html'))
);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static("frontend/build"));
}

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
