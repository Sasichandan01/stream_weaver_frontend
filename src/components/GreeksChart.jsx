// src/components/GreeksChart.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { COLORS } from '../utils/colors'
import { formatTime } from '../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded p-2">
      <p className="text-[#737373] text-xs mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-xs">
          {p.dataKey}: {p.value}
        </p>
      ))}
    </div>
  )
}

const GreeksChart = ({ data }) => {
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
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#737373' }}
        />
        <Line type="monotone" dataKey="delta" stroke={COLORS.delta} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="theta" stroke={COLORS.theta} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="iv"    stroke={COLORS.iv}    strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default GreeksChart
