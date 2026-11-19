
import { WebSocketServer, WebSocket as WSWebSocket } from 'ws';

import {
  addConnection,
  removeConnection,
  getConnectionCount,
} from './connection-manager.js';
import {
  leaveAllRooms
} from './room-manager.js';
import type { WebSocketMessage } from './types/message.js';
import { handleMessage } from './message-handler.js';

// const wss = new WebSocketServer({ port: 3001 });

// const wsMap = new Map<WSWebSocket, { id: string }>();

// // Room ID -> Clients
// const rooms = new Map<string, Set<WSWebSocket>>();

// // Client -> Room IDs
// const clientRooms = new Map<WSWebSocket, Set<string>>();

// function joinRoom(roomId: string, ws: WSWebSocket): void {
//   if (!rooms.has(roomId)) {
//     rooms.set(roomId, new Set());
//   }

//   rooms.get(roomId)!.add(ws);

//   if (!clientRooms.has(ws)) {
//     clientRooms.set(ws, new Set());
//   }

//   clientRooms.get(ws)!.add(roomId);
// }

// function leaveRoom(roomId: string, ws: WSWebSocket): void {
//   const room = rooms.get(roomId);

//   if (!room) return;

//   room.delete(ws);

//   if (room.size === 0) {
//     rooms.delete(roomId);
//   }

//   const joinedRooms = clientRooms.get(ws);

//   joinedRooms?.delete(roomId);

//   if (joinedRooms?.size === 0) {
//     clientRooms.delete(ws);
//   }
// }

// function broadcastToRoom(
//   roomId: string,
//   payload: object,
//   sender?: WSWebSocket,
// ): void {
//   const room = rooms.get(roomId);

//   if (!room) return;

//   room.forEach((client) => {
//     if (
//       client.readyState === WSWebSocket.OPEN
//     ) {
//       client.send(JSON.stringify(payload));
//     }
//   });
// }

// function sendError(ws: WSWebSocket, message: string): void {
//   ws.send(JSON.stringify({
//     type: 'ERROR',
//     payload: { message },
//   }));
// }

// export function startWebSocketServer() {
//   wss.on('connection', (ws) => {
//     console.log('Client connected');

//     const mockUserId = Math.random().toString(16).slice(2, 6).padStart(4, '0');

//     wsMap.set(ws, { id: mockUserId });

//     console.log(`User: ${mockUserId} is ready!!!`);

//     ws.send(JSON.stringify({
//       type: 'INIT',
//       userId: mockUserId,
//       message: 'Connected to WebSocket Server',
//     }));

//     ws.on('message', (data) => {
//       console.log(`Received: ${data.toString()}`);

//       try {
//         const request = JSON.parse(data.toString());

//         const { type, payload } = request;

//         switch (type) {
//           case 'JOIN_ROOM': {
//             const { roomId } = payload ?? {};

//             if (typeof roomId !== 'string' || !roomId) {
//               sendError(ws, 'Invalid Room ID');
//               break;
//             }

//             joinRoom(roomId, ws);

//             ws.send(JSON.stringify({
//               type: 'ROOM_JOINED',
//               payload: { roomId },
//             }));

//             console.log(`User ${mockUserId} joined ${roomId}`);
//             break;
//           }

//           case 'LEAVE_ROOM': {
//             const { roomId } = payload ?? {};

//             if (typeof roomId !== 'string' || !roomId) {
//               sendError(ws, 'Invalid Room ID');
//               break;
//             }

//             leaveRoom(roomId, ws);

//             ws.send(JSON.stringify({
//               type: 'ROOM_LEFT',
//               payload: { roomId },
//             }));

//             console.log(`User ${mockUserId} left ${roomId}`);
//             break;
//           }

//           case 'ROOM_MESSAGE': {
//             const { roomId, message } = payload ?? {};

//             if (typeof roomId !== 'string' || !roomId) {
//               sendError(ws, 'Invalid Room ID');
//               break;
//             }

//             if (typeof message !== 'string' || !message) {
//               sendError(ws, 'Invalid message');
//               break;
//             }

//             if (!clientRooms.get(ws)?.has(roomId)) {
//               sendError(ws, 'You have not joined this Room');
//               break;
//             }

//             broadcastToRoom(roomId, {
//               type: 'ROOM_MESSAGE',
//               payload: {
//                 roomId,
//                 userId: mockUserId,
//                 message,
//               },
//             }, ws);

//             break;
//           }

//           default:
//             sendError(ws, `Unknown message type: ${type}`);
//         }
//       } catch {
//         sendError(ws, 'Invalid message format');
//       }
//     });

//     ws.on('close', () => {
//       console.log(`Client disconnected: ${mockUserId}`);

//       // Remove Client from all joined Rooms
//       const joinedRooms = clientRooms.get(ws);

//       joinedRooms?.forEach((roomId) => {
//         leaveRoom(roomId, ws);
//       });

//       clientRooms.delete(ws);
//       wsMap.delete(ws);
//     });

//     ws.on('error', (error) => {
//       console.error('WebSocket error:', error);
//     });
//   });

//   console.log('WebSocket Server listening on port 3001');

//   return wss;
// }



export function startWebSocketServer() {
  // wss => WebSocket Server
  // ws => 單一 Client WebSocket Connection
  const wss = new WebSocketServer({ port: 3001 });

  // 連線建立
  wss.on('connection', (ws) => {

    // TODO: 要換成真正的 user
    addConnection(ws, {
      type: 'USER',
      id: 'user-001',
    });

    console.log('Client connected');
    console.log('Connection count:', getConnectionCount());

    // 資料傳遞進來
    ws.on('message', (data) => {
      handleMessage(ws, data);
    });

    // 關閉連線
    ws.on('close', () => {
      leaveAllRooms(ws);
      removeConnection(ws);

      console.log('Client disconnected');
      console.log('Connection count:', getConnectionCount());
    });

    // 連線出問題
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket Server listening on port 3001');

  return wss;
}