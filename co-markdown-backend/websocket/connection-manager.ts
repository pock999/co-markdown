import { WebSocket as WSWebSocket } from 'ws';
import type { Connection } from './types/connection.js';

// connections Map
const connectionMap = new Map<WSWebSocket, Connection>();

// addConnection()
export function addConnection(
  ws: WSWebSocket,
  connection: Connection,
) {
  connectionMap.set(ws, connection);
}

// getConnection()
export function getConnection(ws: WSWebSocket):
  Connection | undefined {
  return connectionMap.get(ws);
}

// removeConnection()
export function removeConnection(ws: WSWebSocket): boolean {
  return connectionMap.delete(ws);
}

// getAllConnections()
export function getAllConnections(): [WSWebSocket, Connection][] {
  return Array.from(connectionMap.entries());
}

// getConnectionCount()
export function getConnectionCount(): number {
  return connectionMap.size;
}