// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
// const mysql = require('mysql');


const db = require('./config/database');

// Initializing database
db.connect((err) => {
    if(err) throw err;
    console.log('Connected to the database');
});

// Importing custom files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const classRoutes = require('./routes/class');
const discussionRoutes = require('./routes/discussion');
const assignmentRoutes = require('./routes/assignment');

// Initializing the server and PORT
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/faculty_uploads', express.static('faculty_uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/class', classRoutes);
app.use('/api/discussion', discussionRoutes);
app.use('/api/assignment', assignmentRoutes);

// Running the Server
app.listen(PORT, () => {
    console.log('SERVER UP AND RUNNING ON ' + PORT);
});
