import { useEffect, useState, useRef } from 'react';


export default function TestPage() {
  const [inputText, setInputText] = useState('');
  const [clientMessages, setClientMessages] = useState<string[]>([]);
  const [serverMessages, setServerMessages] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    wsRef.current = ws;

    ws.addEventListener('message', (event) => {
      setServerMessages((prev) => [...prev, String(event.data)]);
    });

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const sendMessage = () => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.send(inputText);

    setClientMessages((prev) => [...prev, inputText]);
    setInputText('');
  };

  return (
    <>
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