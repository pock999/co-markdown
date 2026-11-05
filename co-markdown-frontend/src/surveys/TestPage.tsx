
import { useEffect, useState, useRef } from 'react';

type RoomId = 'room-A' | 'room-B';

interface RoomMessage {
  userId: string;
  message: string;
}

const ROOM_IDS: RoomId[] = ['room-A', 'room-B'];

export default function TestPage() {
  const [myUserId, setMyUserId] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting');

  const [joinedRooms, setJoinedRooms] = useState<RoomId[]>([]);

  const [roomInputs, setRoomInputs] = useState<Record<RoomId, string>>({
    'room-A': '',
    'room-B': '',
  });

  const [clientMessages, setClientMessages] = useState<string[]>([]);

  const [serverMessages, setServerMessages] = useState<
    Record<RoomId, RoomMessage[]>
  >({
    'room-A': [],
    'room-B': [],
  });

  const [systemMessages, setSystemMessages] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.addEventListener('open', () => {
      setConnectionStatus('Connected');
    });

    ws.addEventListener('close', () => {
      setConnectionStatus('Disconnected');
      setJoinedRooms([]);
    });

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const payload = data.payload;

      switch (data.type) {
      case 'INIT':
        setMyUserId(data.userId);
        setSystemMessages((prev) => [
          ...prev,
          `取得 Client ID: ${data.userId}`,
        ]);
        break;

      case 'ROOM_JOINED':
        setJoinedRooms((prev) =>
          prev.includes(payload.roomId)
            ? prev
            : [...prev, payload.roomId],
        );
        setSystemMessages((prev) => [
          ...prev,
          `Joined ${payload.roomId}`,
        ]);
        break;

      case 'ROOM_LEFT':
        setJoinedRooms((prev) =>
          prev.filter((roomId) => roomId !== payload.roomId),
        );
        setSystemMessages((prev) => [
          ...prev,
          `Left ${payload.roomId}`,
        ]);
        break;

      case 'ROOM_MESSAGE':
        setServerMessages((prev) => ({
          ...prev,
          [payload.roomId]: [
            ...prev[payload.roomId as RoomId],
            {
              userId: payload.userId,
              message: payload.message,
            },
          ],
        }));
        break;

      case 'ERROR':
        setSystemMessages((prev) => [
          ...prev,
          `Error: ${payload.message}`,
        ]);
        break;

      default:
        setSystemMessages((prev) => [
          ...prev,
          `Unknown message type: ${data.type}`,
        ]);
        break;
      }
    });

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const sendPayload = (type: string, payload: unknown) => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    ws.send(JSON.stringify({ type, payload }));
    return true;
  };

  const joinRoom = (roomId: RoomId) => {
    if (joinedRooms.includes(roomId)) {
      return;
    }

    sendPayload('JOIN_ROOM', { roomId });
  };

  const leaveRoom = (roomId: RoomId) => {
    if (!joinedRooms.includes(roomId)) {
      return;
    }

    sendPayload('LEAVE_ROOM', { roomId });
  };

  const sendMessage = (roomId: RoomId) => {
    const message = roomInputs[roomId];

    if (!message.trim() || !joinedRooms.includes(roomId)) {
      return;
    }

    const success = sendPayload('ROOM_MESSAGE', {
      roomId,
      message,
    });

    if (!success) {
      return;
    }

    setClientMessages((prev) => [
      ...prev,
      `[${roomId}] ${message}`,
    ]);

    setRoomInputs((prev) => ({
      ...prev,
      [roomId]: '',
    }));
  };

  return (
    <>
      <h2>WebSocket Room Lab</h2>

      <p>Connection: {connectionStatus}</p>
      <p>Client ID: {myUserId || 'Waiting...'}</p>

      <hr />

      <h3>Room Management</h3>

      {ROOM_IDS.map((roomId) => {
        const isJoined = joinedRooms.includes(roomId);

        return (
          <div key={roomId}>
            <h4>{roomId}</h4>

            <p>
              Status: {isJoined ? 'Joined' : 'Not Joined'}
            </p>

            <button
              onClick={() => joinRoom(roomId)}
              disabled={isJoined || connectionStatus !== 'Connected'}
            >
              Join Room
            </button>

            <button
              onClick={() => leaveRoom(roomId)}
              disabled={!isJoined || connectionStatus !== 'Connected'}
            >
              Leave Room
            </button>

            <hr />
          </div>
        );
      })}

      <h3>Room Messages</h3>

      {ROOM_IDS.map((roomId) => (
        <div key={roomId}>
          <h4>{roomId}</h4>

          <input
            value={roomInputs[roomId]}
            onChange={(e) =>
              setRoomInputs((prev) => ({
                ...prev,
                [roomId]: e.target.value,
              }))
            }
            placeholder={`Message to ${roomId}`}
            disabled={!joinedRooms.includes(roomId)}
          />

          <button
            onClick={() => sendMessage(roomId)}
            disabled={!joinedRooms.includes(roomId)}
          >
            Send
          </button>

          <h5>Received Messages:</h5>

          {serverMessages[roomId].map((item, index) => (
            <p key={index}>
              {item.message} | By: {item.userId}
            </p>
          ))}

          <hr />
        </div>
      ))}

      <h3>Client Send Text:</h3>

      {clientMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}

      <hr />

      <h3>System Messages:</h3>

      {systemMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </>
  );
}
