import { WebSocket as WSWebSocket } from 'ws';

export interface ClientInfo {
  userId: string; // isGuest 為 true 就是 guest id
  isGuest: boolean;
  joinedAt: Date;
}

export interface Room {
  documentId: string;
  clientMap: Map<WSWebSocket, ClientInfo>;
  content: string; // 由 Room 管理並儲存目前的文件內容
}