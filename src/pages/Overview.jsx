// src/pages/Overview.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocketStore from "../store/websocketStore";
import Heatmap from "../components/Heatmap";
import ExpirySelector from "../components/ExpirySelector";
import EmailAlerts from "../components/EmailAlerts";
import { formatTime } from "../utils/formatters";
import "../styles/layout.css";

const Overview = () => {
  const navigate = useNavigate();
  const [riskFilter, setRiskFilter] = useState("all");

  // Separate selectors - stable
  const expiries = useWebSocketStore((state) => state.expiries);
  const selectedExpiry = useWebSocketStore((state) => state.selectedExpiry);
  const alerts = useWebSocketStore((state) => state.alerts);
  const timestamp = useWebSocketStore((state) => state.timestamp);
  const isConnected = useWebSocketStore((state) => state.isConnected);

  const currentOptions = expiries?.[selectedExpiry] || [];

  const filteredOptions = currentOptions.filter((option) => {
    if (riskFilter === "safe") return option.risk <= 50;
    if (riskFilter === "high") return option.risk > 75;
    return true;
  });

  const handleOptionClick = useCallback(
    (symbol, expiry) => {
      const store = useWebSocketStore.getState();
      store.setActiveOption(symbol, expiry, "1D");
      store.subscribeToOption(symbol, expiry);
      navigate(`/option/${symbol}/${expiry}`);
    },
    [navigate],
  );

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <header className="page-header">
          <div className="header-top">
            <h1 className="header-title">Options Risk Monitor</h1>
            <div className="header-controls">
              <EmailAlerts />
              <div className="status-badge">
                {timestamp ? formatTime(timestamp) : "--:--"}
              </div>
              <div className="status-badge">
                <span
                  className={`status-indicator ${isConnected ? "live" : "offline"}`}
                />
                {isConnected ? "Live" : "Disconnected"}
              </div>
            </div>
          </div>
          {alerts.length > 0 && (
            <div className="alert-banner">
              <div className="alert-content">
                <span className="status-indicator live" />
                <span className="alert-text">
                  {alerts.length} option{alerts.length > 1 ? "s" : ""} in high
                  risk zone
                </span>
              </div>

            </div>
          )}
        </header>

        <div className="expiry-selector">
          <ExpirySelector />
        </div>

        <div className="filter-container">
          <div className="filter-group">
            {["all", "safe", "high"].map((filter) => (
              <button
                key={filter}
                onClick={() => setRiskFilter(filter)}
                className={`filter-button ${riskFilter === filter ? "active" : ""}`}
              >
                {filter === "all"
                  ? "All Options"
                  : filter === "safe"
                    ? "Safe (≤50)"
                    : "High Risk (>75)"}
              </button>
            ))}
          </div>
        </div>

        <section className="section-gap-lg">
          <Heatmap
            options={filteredOptions}
            onOptionClick={handleOptionClick}
            expiry={selectedExpiry}
          />
        </section>
      </div>
    </div>
  );
};

export default Overview;
