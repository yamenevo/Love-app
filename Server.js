
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));

let sharedState = {
  hearts: 0,
  message: "أحبك ❤️",
  lastAction: "بدأت قصتنا"
};

io.on('connection', (socket) => {
  socket.emit('update', sharedState);
  
  socket.on('addHeart', () => {
    sharedState.hearts++;
    sharedState.lastAction = "أرسل قلب جديد ❤️";
    io.emit('update', sharedState);
  });
  
  socket.on('sendMessage', (msg) => {
    sharedState.message = msg;
    sharedState.lastAction = "رسالة جديدة 💌";
    io.emit('update', sharedState);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server on ${PORT}`));
