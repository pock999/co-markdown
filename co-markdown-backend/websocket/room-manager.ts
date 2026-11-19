import { type Room, type ClientInfo } from './types/room.js';
import { WebSocket as WSWebSocket } from 'ws';
import { DocumentDao } from '../daos/document.dao.js';

// room map
const roomMap = new Map<string, Room>();
// 建立中的 room map
const pendingRoomMap = new Map<string, Promise<Room | null>>();

const documentDao = new DocumentDao();

// 取得 Room
export function getRoom(documentId: string): Room | undefined {
  return roomMap.get(documentId);
}

// 建立 Room
export function createRoom(room: Room): void {
  roomMap.set(room.documentId, room);
}

// 刪除 Room
export function destroyRoom(documentId: string): void {
  roomMap.delete(documentId);
}

// 取得建立中 Room
export function getPendingRoom(documentId: string): Promise<Room | null> | undefined {
  return pendingRoomMap.get(documentId);
}

// 從 db 找，然後建立 room
export async function initRoom(documentId: string): Promise<Room | null> {
  const document = await documentDao.findById(documentId);
  if (!document) {
    return null;
  }

  const room: Room = {
    documentId,
    content: document.content,
    clientMap: new Map(),
  };

  createRoom(room);

  return room;
}

// 取得 Room，找不到會建立
export async function getOrCreateRoom(documentId: string): Promise<Room | null> {

  const existingRoom = getRoom(documentId);

  if (existingRoom) {
    return existingRoom;
  }

  const existingPendingRoom = getPendingRoom(documentId);
  // 確保同一份文件在初始化期間，多個請求共用同一個 Promise，避免重複初始化 Room
  if (existingPendingRoom) {
    return await existingPendingRoom;
  }

  const pendingRoom = initRoom(documentId);
  pendingRoomMap.set(documentId, pendingRoom);

  try {
    return await pendingRoom;
  } finally {
    pendingRoomMap.delete(documentId);
  }
}

export async function joinRoom(documentId: string, ws: WSWebSocket): Promise<Room | null> {
  const room = await getOrCreateRoom(documentId);
  if (room) {
    // TODO: User info 要放真的
    room.clientMap.set(ws, {
      userId: '',
      isGuest: true,
      joinedAt: new Date(),
    });
  }
  return room;
}

export function leaveRoom(documentId: string, ws: WSWebSocket) {
  const room = getRoom(documentId);

  if (room && room.clientMap.has(ws)) {
    room.clientMap.delete(ws);
  }

}

export function leaveAllRooms(ws: WSWebSocket) {
  for (const room of roomMap.values()) {
    leaveRoom(room.documentId, ws);

    if (room.clientMap.size === 0) {
      destroyRoom(room.documentId);
    }
  }
}