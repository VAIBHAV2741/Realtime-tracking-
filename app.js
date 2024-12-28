const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Serve index page
app.get('/', (req, res) => {
    res.render('index');
});

// Handling a new connection
io.on('connection', (socket) => {

    socket.on("send-loaction",function(data){
       io.emit("receive-location",{id:socket.id,...data})
    });
    console.log('A user connected');
    
    // Send a welcome message to the connected user
    socket.emit('message', 'Welcome to the real-time chat app!');
    
    // Listen for messages from the client and broadcast it to everyone
    socket.on('chatMessage', (msg) => {
        console.log('Message received: ' + msg);
        io.emit('message', msg); // Broadcast message to all clients
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
