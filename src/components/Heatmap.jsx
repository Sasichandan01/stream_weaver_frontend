// src/components/Heatmap.jsx
import { getRiskColor } from '../utils/colors'
import { memo } from 'react'

const HeatmapCell = memo(({ option, onClick, expiry }) => {
  const bgColor = getRiskColor(option.risk)

  return (
    <div
      onClick={() => onClick(option.strike, expiry)}
      className="rounded-lg p-3 cursor-pointer border border-[#2a2a2a] 
                 hover:scale-105 transition-transform flex flex-col gap-1"
      style={{ backgroundColor: `${bgColor}18` }}
    >
      <p className="text-white text-xs font-semibold">{option.strike}</p>
      <p className="text-lg font-bold" style={{ color: bgColor }}>
        {option.risk}
      </p>
      <p className="text-[#737373] text-xs">{option.recommendation}</p>
    </div>
  )
})

const Heatmap = ({ options, onOptionClick, expiry }) => {
  const ceOptions = options.filter(o => o.strike.endsWith('CE'))
  const peOptions = options.filter(o => o.strike.endsWith('PE'))

  return (
    <div className="flex gap-4">

      {/* CE Options - Left Side */}
      <div className="flex-1 border-r-2 border-[#2a2a2a] pr-4">
        <p className="text-[#737373] text-xs mb-2 uppercase tracking-wider">Call Options (CE)</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {ceOptions.map(option => (
            <HeatmapCell key={option.strike} option={option} onClick={onOptionClick} expiry={expiry} />
          ))}
        </div>
      </div>

      {/* PE Options - Right Side */}
      <div className="flex-1 border-l-2 border-[#2a2a2a] pl-4">
        <p className="text-[#737373] text-xs mb-2 uppercase tracking-wider">Put Options (PE)</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {peOptions.map(option => (
            <HeatmapCell key={option.strike} option={option} onClick={onOptionClick} expiry={expiry} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Heatmap