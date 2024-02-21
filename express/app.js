const express = require('express');
const app = express();
const mongoConnection = require('./configs/mongoConnection');
const indexRouter = require('./handlers/handler');
const cookieSession = require('cookie-session');

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use('/', indexRouter);

wss.on('connection', function connection(ws) {
  console.log('New WebSocket connection');

  ws.on('message', function incoming(message) {
    console.log('Received:', message);
  });

  ws.send('You connected!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
