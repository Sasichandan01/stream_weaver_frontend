// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useWebSocket from "./hooks/useWebSocket";
import useWebSocketStore from "./store/websocketStore";
import { fetchSnapshot, checkHealth } from "./utils/api";
import Overview from "./pages/Overview";
import OptionDetail from "./pages/OptionDetail";
import Alerts from "./pages/Alerts";

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await checkHealth();
        const snapshot = await fetchSnapshot();

        if (!mounted) return;

        if (!snapshot.type) snapshot.type = "snapshot";
        useWebSocketStore.getState().handleSnapshot(snapshot);

        setIsReady(true);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Only connect WebSocket AFTER data is loaded
  useWebSocket(isReady);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ef4444] mb-4">⚠️ {error}</p>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 bg-[#3b82f6] text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/option/:symbol/:expiry" element={<OptionDetail />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
