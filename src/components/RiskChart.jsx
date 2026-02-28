// src/components/RiskChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../utils/colors";
import { formatTimestamp } from "../utils/chartUtils";

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
        <div className="flex justify-between items-center gap-8 py-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: COLORS.risk }}
            ></div>
            <span className="text-[#e5e5e5] text-xs font-medium">Risk</span>
          </div>
          <span
            className="text-white text-sm font-bold"
            style={{ color: COLORS.risk }}
          >
            {data.risk.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-8 py-1">
          <span className="text-[#737373] text-xs">LTP</span>
          <span className="text-white text-xs">₹{data.ltp?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center gap-8 py-1">
          <span className="text-[#737373] text-xs">Delta</span>
          <span className="text-white text-xs">{data.delta?.toFixed(3)}</span>
        </div>
        <div className="flex justify-between items-center gap-8 py-1">
          <span className="text-[#737373] text-xs">Theta</span>
          <span className="text-white text-xs">{data.theta?.toFixed(3)}</span>
        </div>
        <div className="flex justify-between items-center gap-8 py-1">
          <span className="text-[#737373] text-xs">IV</span>
          <span className="text-white text-xs">{data.iv?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const RiskChart = ({ data, range = "1D" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[#737373]">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart
        data={data}
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
        <YAxis domain={[0, 100]} stroke="#737373" tick={{ fontSize: 11 }} />
        <Tooltip
          content={<CustomTooltip range={range} />}
          cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
          isAnimationActive={false}
        />
        <ReferenceLine y={50} stroke={COLORS.riskLow} strokeDasharray="3 3" />
        <ReferenceLine y={75} stroke={COLORS.riskMid} strokeDasharray="3 3" />
        <Line
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

export default RiskChart;
