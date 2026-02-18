// src/components/CombinedChart.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { COLORS } from '../utils/colors'
import { formatTime } from '../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded p-3">
      <p className="text-[#737373] text-xs mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-sm">
          {p.dataKey === 'risk' ? 'Risk' : 'Price'}: {p.value.toFixed(2)}
        </p>
      ))}
    </div>
  )
}

const CombinedChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTime}
          stroke="#737373"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          yAxisId="left"
          domain={[0, 100]}
          stroke={COLORS.risk}
          tick={{ fontSize: 12 }}
          label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: '#737373' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke={COLORS.ltp}
          tick={{ fontSize: 12 }}
          label={{ value: 'Price (LTP)', angle: 90, position: 'insideRight', fill: '#737373' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="risk"
          stroke={COLORS.risk}
          strokeWidth={2}
          dot={false}
          name="Risk Score"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="ltp"
          stroke={COLORS.ltp}
          strokeWidth={2}
          dot={false}
          name="Price"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default CombinedChart