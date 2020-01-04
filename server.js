const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app); // criando o protocolo http
const io = require('socket.io')(server); // criando o protocolo wss para o socket

// Preparando para servir arquivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Rotas
app.use('/', (req, res) => {
    res.render('index.html');
});

// Chat logic
let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.emit('receivedMessage', data);
        socket.broadcast.emit('receivedMessage', data); // Envia mensagem para todos na conexao
    });
});

// Iniciando server
server.listen(3000);
