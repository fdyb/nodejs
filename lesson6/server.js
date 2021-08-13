const http = require('http');
const io = require('socket.io');
const path = require('path');
const fs = require('fs');
let users = [
    {
        id: '',
        name: 'Big Ben'
    },
    {
        id: '',
        name: 'Harley Davidson'
    },
    {
        id: '',
        name: 'John Doe'
    },
    {
        id: '',
        name: 'Mark Twen'
    }
]
let counter = 0;


const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
          
      const filePath = path.join(__dirname, 'index.html');
  
      readStream = fs.createReadStream(filePath);
  
      readStream.pipe(response);
    } else if (request.method === 'POST') {
      let data = '';
  
      request.on('data', chunk => {
      data += chunk;
      });
  
      request.on('end', () => {
        const parsedData = JSON.parse(data);
        console.log(parsedData);
  
        response.writeHead(200, { 'Content-Type': 'json'});
        response.end(data);
      });
    } else {
        response.statusCode = 405;
        response.end();
    }
  });

const socket = io(app);

socket.on('connection', function (socket) {
  let newOne = users.find(user => user.id === '');
  counter++;
  newOne.id = socket.id;
  console.log(`Client ${newOne.name} just connected to Server`);
  socket.broadcast.emit('NEW_CONN_EVENT', { msg: `${newOne.name} joined chat... Now ${counter} active clients` });
  socket.on('CLIENT_MSG', (data) => {
    let text = data.msg.split('').reverse().join('');
    socket.emit('SERVER_MSG', { msg: text});
    socket.broadcast.emit('SERVER_MSG', { msg: text});
  });
  socket.on("disconnect", (reason) => {
    counter--;
    console.log(`${users.find(user => user.id === socket.id).name} left chat (reason: ${reason}) / Now ${counter} active clients`);
  });
});

app.listen(3000, 'localhost');