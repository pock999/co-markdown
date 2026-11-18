import { WebSocket as WSWebSocket } from 'ws';
import type { WebSocketMessage } from './types/message.js';

function sendError(ws: WSWebSocket, message: string): void {
  // ws.send 送出資料
  ws.send(JSON.stringify({
    type: 'ERROR',
    payload: { message },
  }));
}

export function handleMessage(
  ws: WSWebSocket,
  data: WSWebSocket.RawData,
): void {
  try {

    const messagePayload: WebSocketMessage = JSON.parse(data.toString());

    // TODO: 改使用 zod 檢查
    if (
      typeof messagePayload !== 'object' ||
      messagePayload === null ||
      typeof messagePayload.type !== 'string' ||
      !('payload' in messagePayload)
    ) {
      // 回傳錯誤訊息
      sendError(ws, 'Invalid payload format');
      return;
    }

    console.log(messagePayload);

    // TODO: 後續完善具體功能與 type
    switch (messagePayload.type) {
      case 'JOIN_ROOM':
        console.log('Join Room');
        break;

      case 'LEAVE_ROOM':
        console.log('Leave Room');
        break;

      case 'UPDATE':
        console.log('Update Document');
        break;

      default:
        sendError(ws, 'Unknown message type');
        break;
    }

  } catch {
    sendError(ws, 'Invalid JSON format');
  }
}