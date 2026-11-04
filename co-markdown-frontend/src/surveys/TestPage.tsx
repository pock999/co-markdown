import { useEffect, useState, useRef } from 'react';

export default function TestPage() {
  const [myUserId, setMyUserId] = useState<string>(''); // 存放後端給的 ID
  const [inputText, setInputText] = useState('');
  const [clientMessages, setClientMessages] = useState<string[]>([]);
  const [serverMessages, setServerMessages] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'INIT') {
        setMyUserId(data.userId); // 拿到後端發給我的身份 ID
        setServerMessages((prev) => [...prev, `成功取得後端分配的 ID : ${data.userId}`]);
      } else if (data.type === 'CHAT') {
        // 收到聊天廣播，把整筆物件（包含是誰寫的、寫了什麼）塞進陣列
        setServerMessages((prev) => [...prev, `${data.message} | By: ${data.userId}`]);
      }
    });

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const sendMessage = () => {
    if (!inputText) {
      return;
    }

    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const payload = {
      message: inputText,
    };

    ws.send(JSON.stringify(payload));

    setClientMessages((prev) => [...prev, inputText]);
    setInputText('');
  };

  return (
    <>
      <p>User ID: {myUserId}</p>
      <input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></input>
      <button onClick={sendMessage}>
        Send
      </button>

      <hr />

      <div>
        <h3>Client Send Text:</h3>
        {clientMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

      <hr />

      <div>
        <h3>Server Send Text:</h3>
        {serverMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

    </>
  );
}