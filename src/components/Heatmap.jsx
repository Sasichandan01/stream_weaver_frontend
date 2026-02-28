// src/components/Heatmap.jsx
import { getRiskColor } from '../utils/colors'
import { memo } from 'react'

const HeatmapCell = memo(({ option, onClick, expiry }) => {
  const bgColor = getRiskColor(option.risk)

  return (
    <div
      onClick={() => onClick(option.symbol, expiry)}
      className="heatmap-cell"
      style={{ backgroundColor: `${bgColor}18` }}
    >
      <p className="heatmap-strike">{option.symbol}</p>
      <p className="heatmap-risk" style={{ color: bgColor }}>
        {option.risk?.toFixed(1) || "--"}
      </p>
      <p className="heatmap-price">
        ₹{option.ltp?.toFixed(2) || option.price?.toFixed(2) || "--"}
      </p>
      <p className="heatmap-action">{option.recommendation}</p>
    </div>
  );
})

const Heatmap = ({ options, onOptionClick, expiry }) => {
   console.log("🔍 Heatmap received:", { options, expiry });

   if (!options || !Array.isArray(options)) {
     console.error("❌ Invalid options data:", options);
     return <div className="text-white p-4">No options data available</div>;
   }

   const ceOptions = options.filter((o) => o.symbol?.endsWith("CE"));
   const peOptions = options.filter((o) => o.symbol?.endsWith("PE"));

   console.log(
     "CE options:",
     ceOptions.length,
     "PE options:",
     peOptions.length,
   );

  return (
    <div className="heatmap-container">

      {/* CE Options - Left Side */}
      <div className="heatmap-section heatmap-section-left">
        <p className="heatmap-label">Call Options (CE)</p>
        <div className="heatmap-grid">
          {ceOptions.map(option => (
            <HeatmapCell key={option.strike} option={option} onClick={onOptionClick} expiry={expiry} />
          ))}
        </div>
      </div>

      {/* PE Options - Right Side */}
      <div className="heatmap-section heatmap-section-right">
        <p className="heatmap-label">Put Options (PE)</p>
        <div className="heatmap-grid">
          {peOptions.map(option => (
            <HeatmapCell key={option.strike} option={option} onClick={onOptionClick} expiry={expiry} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Heatmap