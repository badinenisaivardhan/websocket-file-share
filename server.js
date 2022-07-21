const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.get('/send', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/rec', (req, res) => {
  res.sendFile(__dirname + '/reciever.html');
});

io.on('connection', (socket) => {
  socket.on('sender-id',(data) => {
    socket.join(data.uid);
  });
  socket.on("receiver-join",(data)=>{
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init",data.uid);
  });
    socket.on("file-meta",(data)=>{
      socket.in(data.uid).emit("fs-meta",data.metadata);
  })
  socket.on("fs-start",(data)=>{
        socket.in(data.uid).emit("fs-share")
    })
  socket.on("file-raw",(data)=>{
          socket.in(data.uid).emit("fs-share",data.buffer)
      })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});