import { WebSocketServer, WebSocket as WSWebSocket } from 'ws';


const wss = new WebSocketServer({ port: 3001 });

const wsMap = new Map<WSWebSocket, { id: string }>();

export function startWebSocketServer() {
  wss.on('connection', (ws) => {
    console.log('Client connected');

    const mockUserId = Math.random().toString(16).slice(2, 6).padStart(4, '0');
    wsMap.set(ws, { id: mockUserId });

    console.log(`User: ${mockUserId} is ready!!!`);

    ws.send(JSON.stringify({
      type: 'INIT',
      userId: mockUserId,
      message: 'Connected to WebSocket Server',
    }));

    ws.on('message', (data) => {
      const payload = JSON.parse(data.toString());

      console.log(`Received: ${data.toString()}`);

      wsMap.forEach((info, client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'CHAT',
            ...payload,
            userId: mockUserId,
          }));
        }
      });
    });

    ws.on('close', () => {
      console.log(`Client disconnected: ${mockUserId}`);
      wsMap.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

  });

  console.log('WebSocket Server listening on port 3001');

  return wss;
}