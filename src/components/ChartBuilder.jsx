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
import { formatTimestamp } from "../utils/chartUtils";

const METRICS = [
  { id: "ltp", label: "Price (LTP)", color: COLORS.ltp, yAxisId: "left" },
  { id: "risk", label: "Risk Score", color: COLORS.risk, yAxisId: "right" },
  { id: "delta", label: "Delta", color: COLORS.delta, yAxisId: "right" },
  { id: "theta", label: "Theta", color: COLORS.theta, yAxisId: "right" },
  { id: "iv", label: "IV", color: COLORS.iv, yAxisId: "right" },
];

const CustomTooltip = ({ active, payload, range }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  if (data.ltp === null || data.ltp === undefined) return null;

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#141414] border-2 border-[#3b82f6] rounded-xl p-4 shadow-2xl min-w-[200px]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2a2a2a]">
        <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse"></div>
        <p className="text-[#3b82f6] text-sm font-bold tracking-wide">
          {formatTimestamp(data.timestamp, range)}
        </p>
      </div>
      <div className="space-y-2">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex justify-between items-center gap-8 py-1"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: p.color }}
              ></div>
              <span className="text-[#e5e5e5] text-xs font-medium">
                {p.name}
              </span>
            </div>
            <span
              className="text-white text-sm font-bold"
              style={{ color: p.color }}
            >
              {p.dataKey === "ltp"
                ? `₹${p.value?.toFixed(2)}`
                : p.value?.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartBuilder = ({ data, range = "1D" }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(["ltp", "risk"]);

  const toggleMetric = (metricId) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId],
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[#737373]">No data available</p>
      </div>
    );
  }

  const hasLeftAxis = selectedMetrics.some(
    (id) => METRICS.find((m) => m.id === id)?.yAxisId === "left",
  );
  const hasRightAxis = selectedMetrics.some(
    (id) => METRICS.find((m) => m.id === id)?.yAxisId === "right",
  );

  return (
    <div className="chart-builder">
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

      {selectedMetrics.length === 0 ? (
        <div className="chart-empty">
          <p>Select at least one metric to display the chart</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: hasRightAxis ? 70 : 20,
              left: 70,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2a2a2a"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              hide={true}
              domain={["dataMin", "dataMax"]}
              type="category"
              allowDataOverflow={false}
            />

            {hasLeftAxis && (
              <YAxis
                yAxisId="left"
                stroke={COLORS.ltp}
                tick={{ fontSize: 11, fill: COLORS.ltp }}
                width={60}
                label={{
                  value: "Price (₹)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: COLORS.ltp, fontSize: 13, fontWeight: 600 },
                }}
              />
            )}

            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#737373"
                tick={{ fontSize: 11 }}
                width={60}
                label={{
                  value: "Metrics",
                  angle: 90,
                  position: "insideRight",
                  style: { fill: "#737373", fontSize: 13, fontWeight: 600 },
                }}
              />
            )}
            <Tooltip
              content={<CustomTooltip range={range} />}
              cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
              isAnimationActive={false}
            />
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
                  strokeWidth={3}
                  dot={false}
                  name={metric.label}
                  activeDot={{
                    r: 6,
                    fill: metric.color,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  connectNulls={false}
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
