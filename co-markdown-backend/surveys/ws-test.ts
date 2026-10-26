import { WebSocketServer } from 'ws';


const wss = new WebSocketServer({ port: 3001 });

export function startWebSocketServer() {
  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
      const message = data.toString();

      console.log('Received:', message);

      ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    ws.send('Connected to WebSocket Server');
  });

  console.log('WebSocket Server listening on port 3001');

  return wss;
}