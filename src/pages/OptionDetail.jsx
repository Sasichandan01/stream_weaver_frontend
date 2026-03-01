// src/pages/OptionDetail.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWebSocketStore from "../store/websocketStore";
import { useOptionHistory } from "../hooks/useOptionData";
import RiskChart from "../components/RiskChart";
import PriceChart from "../components/PriceChart";
import GreeksChart from "../components/GreeksChart";
import ChartBuilder from "../components/ChartBuilder";
import { getRiskColor } from "../utils/colors";
import { formatExpiry } from "../utils/formatters";
import "../styles/detail.css";

const RANGES = ["1D", "1W", "1M", "MAX"];
const CHARTS = [
  { id: "custom", label: "Custom" },
  { id: "risk", label: "Risk" },
  { id: "price", label: "Price" },
  { id: "greeks", label: "Greeks" },
];

const OptionDetail = () => {
  const { symbol, expiry } = useParams();
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState("1D");
  const [activeChart, setActiveChart] = useState("custom");

  const expiries = useWebSocketStore((state) => state.expiries);
  const liveGreeks = useWebSocketStore((state) => state.liveGreeks);
  const subscribeToOption = useWebSocketStore(
    (state) => state.subscribeToOption,
  );
  const unsubscribe = useWebSocketStore((state) => state.unsubscribe);
  const setActiveOption = useWebSocketStore((state) => state.setActiveOption);

  const {
    data: history,
    isLoading,
    error,
  } = useOptionHistory(symbol, expiry, selectedRange);

useEffect(() => {
  setActiveOption(symbol, expiry, selectedRange);

  // Attempt subscription immediately
  subscribeToOption(symbol, expiry);

  // Also retry after 1 second if WebSocket wasn't ready
  const retryTimeout = setTimeout(() => {
    console.log("🔄 Retry subscription after 1s");
    subscribeToOption(symbol, expiry);
  }, 1000);

  return () => {
    clearTimeout(retryTimeout);
    unsubscribe();
  };
}, [symbol, expiry, selectedRange]);

  const currentOption = useMemo(() => {
    // Priority 1: Live WebSocket Greeks
    if (liveGreeks?.symbol === symbol) {
      return {
        symbol: liveGreeks.symbol,
        ltp: liveGreeks.ltp,
        risk: liveGreeks.overall_risk_score || liveGreeks.risk_score || 0,
        delta: liveGreeks.delta,
        theta: liveGreeks.theta,
        iv: liveGreeks.iv,
        recommendation: liveGreeks.recommendation,
      };
    }

    // Priority 2: Latest history data point (most recent)
    if (history && history.length > 0) {
      const latest = history[history.length - 1];
      const snapshotData = expiries?.[expiry]?.find((o) => o.symbol === symbol);

      return {
        symbol,
        ltp: latest.ltp,
        risk: latest.risk || snapshotData?.risk || 0,
        delta: latest.delta,
        theta: latest.theta,
        iv: latest.iv,
        recommendation: snapshotData?.recommendation || "--",
      };
    }

    // Priority 3: Snapshot data (basic info only)
    return expiries?.[expiry]?.find((o) => o.symbol === symbol);
  }, [liveGreeks, history, expiries, expiry, symbol]);

  const stats = useMemo(() => {
    if (!currentOption) return [];
    return [
      { label: "Symbol", value: symbol },
      { label: "Expiry", value: formatExpiry(expiry) },
      {
        label: "Risk Score",
        value: currentOption.risk,
        isRisk: true,
        color: getRiskColor(currentOption.risk),
      },
      { label: "LTP", value: currentOption.ltp?.toFixed(2) || "--" },
      { label: "Delta", value: currentOption.delta?.toFixed(3) || "--" },
      { label: "Theta", value: currentOption.theta?.toFixed(3) || "--" },
      { label: "IV", value: currentOption.iv?.toFixed(2) || "--" },
      { label: "Action", value: currentOption.recommendation || "--" },
    ];
  }, [currentOption, symbol, expiry]);

  if (!currentOption) {
    return (
      <div className="detail-container">
        <nav className="back-navigation">
          <button className="back-button" onClick={() => navigate("/")}>
            <span>←</span>
            <span>Back to Overview</span>
          </button>
        </nav>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner mb-4" />
            <p className="text-[#737373]">Loading option details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <nav className="back-navigation">
        <button className="back-button" onClick={() => navigate("/")}>
          <span>←</span>
          <span>Back to Overview</span>
        </button>
      </nav>

      <section className="stats-section">
        <div className="detail-stats-grid">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`detail-stat-card ${stat.isRisk ? "risk-card" : ""}`}
              style={
                stat.isRisk
                  ? {
                      backgroundColor: `${stat.color}18`,
                      borderColor: stat.color,
                    }
                  : {}
              }
            >
              <p className="detail-stat-label">{stat.label}</p>
              <p
                className={`detail-stat-value ${stat.isRisk ? "large" : ""}`}
                style={stat.isRisk ? { color: stat.color } : {}}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="chart-controls-section">
        <div className="range-selector">
          <div className="range-button-group">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`range-button ${selectedRange === r ? "active" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-tabs">
          {CHARTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChart(c.id)}
              className={`chart-tab ${activeChart === c.id ? "active" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        {isLoading ? (
          <div className="chart-loading">
            <div className="spinner" />
            <p className="loading-text">Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-[#ef4444]">
              Failed to load chart data. Backend timeout.
            </p>
          </div>
        ) : !history || history.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-[#737373]">
              No historical data available for this range
            </p>
          </div>
        ) : (
          <>
            {activeChart === "custom" && (
              <ChartBuilder data={history} range={selectedRange} />
            )}
            {activeChart === "risk" && (
              <RiskChart data={history} range={selectedRange} />
            )}
            {activeChart === "price" && (
              <PriceChart data={history} range={selectedRange} />
            )}
            {activeChart === "greeks" && (
              <GreeksChart data={history} range={selectedRange} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OptionDetail;
