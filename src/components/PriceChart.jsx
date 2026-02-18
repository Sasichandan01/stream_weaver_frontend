// src/components/PriceChart.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { COLORS } from '../utils/colors'
import { formatTime } from '../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded p-2">
      <p className="text-[#737373] text-xs">{label}</p>
      <p className="text-white font-semibold">LTP: {payload[0]?.value}</p>
    </div>
  )
}

const PriceChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTime}
          stroke="#737373"
          tick={{ fontSize: 11 }}
        />
        <YAxis stroke="#737373" tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="ltp"
          stroke={COLORS.ltp}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: COLORS.ltp, stroke: '#fff', strokeWidth: 1 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default PriceChart