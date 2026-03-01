// src/components/GreeksChart.jsx
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

const formatToIST = (timestamp, range) => {
  const date = new Date(timestamp);
  if (range === "1D") {
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const downsampleData = (data) => {
  if (!data || data.length === 0) return [];
  const maxPoints = 2000;
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
};

const padDataForLeftAlign = (data, minPoints = 100) => {
  if (!data || data.length === 0) return [];
  if (data.length >= minPoints) return data;

  const lastPoint = data[data.length - 1];
  const padding = Array(minPoints - data.length)
    .fill(null)
    .map((_, i) => ({
      timestamp: new Date(
        new Date(lastPoint.timestamp).getTime() + (i + 1) * 60000,
      ).toISOString(),
      delta: null,
      theta: null,
      iv: null,
      ltp: null,
      risk: null,
    }));

  return [...data, ...padding];
};

const CustomTooltip = ({ active, payload, range }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  if (data.ltp === null || data.ltp === undefined) return null;

  return (
    <div className="bg-[#0a0a0a] border border-[#3b82f6] rounded-lg p-3 shadow-2xl min-w-[180px]">
      <p className="text-[#3b82f6] text-sm font-semibold mb-2">
        {formatToIST(data.timestamp, range)}
      </p>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-6">
          <span className="text-[#737373] text-xs">Delta</span>
          <span className="text-white text-xs">{data.delta?.toFixed(3)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-[#737373] text-xs">Theta</span>
          <span className="text-white text-xs">{data.theta?.toFixed(3)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-[#737373] text-xs">IV</span>
          <span className="text-white text-xs">{data.iv?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-[#737373] text-xs">LTP</span>
          <span className="text-[#10b981] text-xs">
            ₹{data.ltp?.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-[#737373] text-xs">Risk</span>
          <span className="text-white text-xs">{data.risk?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const GreeksChart = ({ data, range = "1D" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[#737373]">No data available</p>
      </div>
    );
  }

  const downsampled = downsampleData(data);
  const chartData = padDataForLeftAlign(downsampled);

  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
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
        <YAxis stroke="#737373" tick={{ fontSize: 11 }} />
        <Tooltip
          content={<CustomTooltip range={range} />}
          cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
          isAnimationActive={false}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Line
          type="monotone"
          dataKey="delta"
          stroke={COLORS.delta}
          strokeWidth={2}
          dot={false}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="theta"
          stroke={COLORS.theta}
          strokeWidth={2}
          dot={false}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="iv"
          stroke={COLORS.iv}
          strokeWidth={2}
          dot={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GreeksChart;
