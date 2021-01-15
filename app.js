// Importing required modules
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const socketio = require('socket.io');
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

// Initializing the server, PORT and socket.io
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/faculty_uploads', express.static('faculty_uploads'));
app.use('/assignments', express.static('assignments'));
app.use('/submissions', express.static('submissions'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/class', classRoutes);
app.use('/api/discussion', discussionRoutes);
app.use('/api/assignment', assignmentRoutes);

// Socket.io code
io.on('connection', (socket) => {
    console.log("new User Joined");
    socket.on('join', ({name, room}) => {
        socket.join(room);
    });
    socket.on('sendMessage', ({message, user, room}) => {
        io.to(room).emit('message', { user: user, message: message });
    });
});

// Running the Server
server.listen(PORT, () => {
    console.log('SERVER UP AND RUNNING ON ' + PORT);
});
