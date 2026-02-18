// src/components/ExpirySelector.jsx
import useWebSocketStore from '../store/websocketStore'
import { formatExpiry } from '../utils/formatters'

const ExpirySelector = () => {
  const { availableExpiries, selectedExpiry, setSelectedExpiry } = useWebSocketStore()

  return (
    <div className="flex justify-center mb-4">
      <select
        value={selectedExpiry || ''}
        onChange={(e) => setSelectedExpiry(e.target.value)}
        className="bg-[#141414] text-white border border-[#2a2a2a] rounded-lg px-4 py-2 
                   cursor-pointer hover:border-[#3b82f6] transition-colors
                   focus:outline-none focus:border-[#3b82f6]"
      >
        {availableExpiries.map((expiry) => (
          <option key={expiry} value={expiry}>
            {formatExpiry(expiry)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ExpirySelector