// src/components/ChartBuilder.jsx
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../utils/colors";
import { formatTime } from "../utils/formatters";

const METRICS = [
  { id: "risk", label: "Risk Score", color: COLORS.risk, yAxisId: "left" },
  { id: "ltp", label: "Price (LTP)", color: COLORS.ltp, yAxisId: "right" },
  { id: "delta", label: "Delta", color: COLORS.delta, yAxisId: "left" },
  { id: "theta", label: "Theta", color: COLORS.theta, yAxisId: "left" },
  { id: "iv", label: "IV", color: COLORS.iv, yAxisId: "right" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-time">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="tooltip-value">
          {p.name}: {p.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
};

const ChartBuilder = ({ data }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(["risk", "ltp"]);

  const toggleMetric = (metricId) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId],
    );
  };

  const hasLeftAxis = selectedMetrics.some(
    (id) => METRICS.find((m) => m.id === id)?.yAxisId === "left",
  );
  const hasRightAxis = selectedMetrics.some(
    (id) => METRICS.find((m) => m.id === id)?.yAxisId === "right",
  );

  return (
    <div className="chart-builder">
      {/* Metric Selector */}
      <div className="metric-selector">
        <p className="metric-selector-label">Select Metrics:</p>
        <div className="metric-buttons">
          {METRICS.map((metric) => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={`metric-button ${selectedMetrics.includes(metric.id) ? "active" : ""}`}
              style={
                selectedMetrics.includes(metric.id)
                  ? {
                      backgroundColor: `${metric.color}20`,
                      borderColor: metric.color,
                      color: metric.color,
                    }
                  : {}
              }
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {selectedMetrics.length === 0 ? (
        <div className="chart-empty">
          <p>Select at least one metric to display the chart</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#737373"
              tick={{ fontSize: 12 }}
            />
            {hasLeftAxis && (
              <YAxis yAxisId="left" stroke="#737373" tick={{ fontSize: 12 }} />
            )}
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#737373"
                tick={{ fontSize: 12 }}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "13px" }} />

            {selectedMetrics.map((metricId) => {
              const metric = METRICS.find((m) => m.id === metricId);
              return (
                <Line
                  key={metricId}
                  yAxisId={metric.yAxisId}
                  type="monotone"
                  dataKey={metricId}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={false}
                  name={metric.label}
                  activeDot={{
                    r: 4,
                    fill: metric.color,
                    stroke: "#fff",
                    strokeWidth: 1,
                  }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ChartBuilder;
