document.addEventListener('DOMContentLoaded', function () {
    const socket = new WebSocket('ws://localhost:3000/');
    
    socket.addEventListener('open', function (event) {
      console.log('Connected to WebSocket Server');
    });
    
    socket.addEventListener('message', function (event) {
      console.log('Message from server:', event.data);

    });
    
    socket.addEventListener('close', function (event) {
      console.log('Disconnected from WebSocket Server');
    });
    
    socket.addEventListener('error', function (event) {
      console.error('WebSocket Error:', event);
    });
  });
  