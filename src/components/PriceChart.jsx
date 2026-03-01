// src/components/PriceChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

// Pad data to fill chart width - forces left alignment
const padDataForLeftAlign = (data, range) => {
  if (!data || data.length === 0) return [];
  if (range !== "1D") return data;

  const minPoints = 100;
  if (data.length >= minPoints) return data;

  const lastPoint = data[data.length - 1];
  const padding = Array(minPoints - data.length)
    .fill(null)
    .map((_, i) => ({
      timestamp: new Date(
        new Date(lastPoint.timestamp).getTime() + (i + 1) * 60000,
      ).toISOString(),
      ltp: null,
      delta: null,
      theta: null,
      iv: null,
      risk: null,
    }));

  return [...data, ...padding];
};

const CustomTooltip = ({ active, payload, range }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  // Don't show tooltip for padded null data
  if (data.ltp === null || data.ltp === undefined) return null;

  return (
    <div className="bg-[#0a0a0a] border border-[#3b82f6] rounded-lg p-3 shadow-2xl min-w-[180px]">
      <p className="text-[#3b82f6] text-sm font-semibold mb-2">
        {formatToIST(data.timestamp, range)}
      </p>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-6">
          <span className="text-[#737373] text-xs">Price</span>
          <span className="text-[#10b981] text-sm font-bold">
            ₹{data.ltp?.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-[#737373] text-xs">Risk</span>
          <span className="text-[#3b82f6] text-sm font-bold">
            {data.risk || "--"}
          </span>
        </div>
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
      </div>
    </div>
  );
};

const PriceChart = ({ data, range = "1D" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[#737373]">No data available</p>
      </div>
    );
  }

  const downsampled = downsampleData(data);
  const chartData = padDataForLeftAlign(downsampled,range);

  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 70, left: 70, bottom: 10 }}
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

        <YAxis
          yAxisId="price"
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

        <YAxis
          yAxisId="risk"
          orientation="right"
          domain={[0, 100]}
          stroke={COLORS.risk}
          tick={{ fontSize: 11, fill: COLORS.risk }}
          width={60}
          label={{
            value: "Risk Score",
            angle: 90,
            position: "insideRight",
            style: { fill: COLORS.risk, fontSize: 13, fontWeight: 600 },
          }}
        />

        <Tooltip
          content={<CustomTooltip range={range} />}
          cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
          isAnimationActive={false}
        />

        <Line
          yAxisId="price"
          type="monotone"
          dataKey="ltp"
          stroke={COLORS.ltp}
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: COLORS.ltp, stroke: "#fff", strokeWidth: 2 }}
          connectNulls={false}
        />

        <Line
          yAxisId="risk"
          type="monotone"
          dataKey="risk"
          stroke={COLORS.risk}
          strokeWidth={3}
          dot={false}
          activeDot={{
            r: 6,
            fill: COLORS.risk,
            stroke: "#fff",
            strokeWidth: 2,
          }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
