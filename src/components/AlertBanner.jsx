// src/components/AlertBanner.jsx
import { useNavigate } from 'react-router-dom'

const AlertBanner = ({ alerts }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate('/alerts')}
      className="bg-[#ef444418] border border-[#ef4444] rounded-lg p-3 
                 mb-4 flex items-center justify-between cursor-pointer 
                 hover:bg-[#ef444428] transition-colors"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
        <p className="text-[#ef4444] text-sm font-medium">
          {alerts.length} option{alerts.length > 1 ? 's' : ''} in high risk zone
        </p>
      </div>
      <p className="text-[#737373] text-xs">View all →</p>
    </div>
  )
}

export default AlertBanner