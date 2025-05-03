const express = require("express");
const dotenv = require('dotenv');

const path = require('path')

const app = express();
dotenv.config();
require('./db/conn');


app.use(express.json());


app.use(require('./routes/adminRoutes'));
app.use(require('./routes/employessRoute'));
app.use(require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, '/frontend/build')));
app.get('*', (req, res) =>
    res.sendFile(path.join(_dirname, '/frontend/build/index.html'))
);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static("frontend/build"));
}

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
