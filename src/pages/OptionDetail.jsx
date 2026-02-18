// src/pages/OptionDetail.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWebSocketStore from "../store/websocketStore";
import { useMockOptionHistory } from "../hooks/useMockOptionData";
import RiskChart from "../components/RiskChart";
import PriceChart from "../components/PriceChart";
import GreeksChart from "../components/GreeksChart";
import CombinedChart from "../components/CombinedChart";
import { getRiskColor } from "../utils/colors";
import { formatExpiry } from "../utils/formatters";
import ChartBuilder from "../components/ChartBuilder";
import "../styles/detail.css";

const RANGES = ["1D", "1W", "MAX"];
const CHARTS = [
  { id: "custom", label: "Custom" },
  { id: "risk", label: "Risk" },
  { id: "price", label: "Price" },
  { id: "greeks", label: "Greeks" },
];

const OptionDetail = () => {
  const { strike, expiry } = useParams();
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState("1D");
  const [activeChart, setActiveChart] = useState("combined");

  const { liveData } = useWebSocketStore();
  const currentOption = liveData[expiry]?.find((o) => o.strike === strike);

  const { data: history, isLoading } = useMockOptionHistory(
    strike,
    expiry,
    selectedRange,
  );

  const stats = currentOption
    ? [
        { label: "Strike", value: strike },
        { label: "Expiry", value: formatExpiry(expiry) },
        {
          label: "Risk Score",
          value: currentOption.risk,
          isRisk: true,
          color: getRiskColor(currentOption.risk),
        },
        { label: "LTP", value: currentOption.ltp.toFixed(2) },
        { label: "Delta", value: currentOption.delta.toFixed(3) },
        { label: "Theta", value: currentOption.theta.toFixed(3) },
        { label: "IV", value: currentOption.iv.toFixed(2) },
        { label: "Action", value: currentOption.recommendation },
      ]
    : [];

  return (
    <div className="detail-container">
      {/* Back Navigation */}
      <nav className="back-navigation">
        <button className="back-button" onClick={() => navigate("/")}>
          <span>←</span>
          <span>Back to Overview</span>
        </button>
      </nav>

      {/* Stats Grid */}
      {currentOption && (
        <section className="stats-section">
          <div className="detail-stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
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
      )}

      {/* Chart Controls */}
      <div className="chart-controls-section">
        {/* Range Selector */}
        <div className="range-selector">
          <div className="range-button-group">
            {RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`range-button ${selectedRange === range ? "active" : ""}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Tabs */}
        <div className="chart-tabs">
          {CHARTS.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`chart-tab ${activeChart === chart.id ? "active" : ""}`}
            >
              {chart.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div className="chart-container">
        {isLoading ? (
          <div className="chart-loading">
            <div className="spinner" />
            <p className="loading-text">Loading chart data...</p>
          </div>
        ) : (
          <>
            {activeChart === "custom" && <ChartBuilder data={history} />}
            {activeChart === "risk" && <RiskChart data={history} />}
            {activeChart === "price" && <PriceChart data={history} />}
            {activeChart === "greeks" && <GreeksChart data={history} />}
          </>
        )}
      </div>
    </div>
  );
};

export default OptionDetail;
