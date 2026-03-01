// src/hooks/useWebSocket.js
import { useEffect, useRef } from "react";
import useWebSocketStore from "../store/websocketStore";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";

const useWebSocket = (enabled = true) => {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const connect = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        useWebSocketStore.getState().setConnected(true);
        useWebSocketStore.getState().setWebSocket(wsRef.current);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const store = useWebSocketStore.getState();

        if (data.type === "snapshot" || data.expiries) {
          store.handleSnapshot(data);
        } else if (data.type === "greeks") {
          store.handleGreeks(data);
        }
      };

      wsRef.current.onclose = () => {
        useWebSocketStore.getState().setConnected(false);
        reconnectRef.current = setTimeout(connect, 3000);
      };

      wsRef.current.onerror = () => wsRef.current?.close();
    };

    connect();

    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [enabled]);
};

export default useWebSocket;
