const WebSocket = require("ws");

function createWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });
  const connectedSockets = new Set();

  wss.on("connection", (socket) => {
    console.log("WebSocket client connected");
    connectedSockets.add(socket);

    socket.on("message", (message) => {
      console.log(`Received message: ${message}`);
    });
  });

  function sendEventToAll(event, data) {
    connectedSockets.forEach((socket) => {
      socket.send(JSON.stringify({ event, data }));
    });
  }

  return { wss, sendEventToAll };
}

module.exports = createWebSocketServer;
