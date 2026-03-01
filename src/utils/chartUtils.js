// src/utils/chartUtils.js

// Generate FULL market hours time grid (9:15 AM to 3:30 PM) - ALWAYS 780 points
export const generateTimeGrid = () => {
  const grid = []
  const startHour = 9
  const startMinute = 15
  const endHour = 15
  const endMinute = 30
  
  // Total minutes: 9:15 to 15:30 = 375 minutes
  const totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute)
  const intervalSeconds = (totalMinutes * 60) / 780
  
  const baseDate = new Date()
  baseDate.setHours(startHour, startMinute, 0, 0)
  
  for (let i = 0; i < 780; i++) {
    const timestamp = new Date(baseDate.getTime() + i * intervalSeconds * 1000)
    grid.push(timestamp.toISOString())
  }
  
  return grid
}

// Forward-fill data - ALWAYS return 780 points (nulls for future)
export const forwardFillData = (backendData, timeGrid) => {
  // Get current IST time
  const now = new Date()
  const istOffset = 5.5 * 60 * 60 * 1000
  const currentIST = new Date(now.getTime() + istOffset)
  const currentTimeOnly = currentIST.getUTCHours() * 60 + currentIST.getUTCMinutes()
  
  const filled = []
  let lastKnownData = null
  
  for (const gridTime of timeGrid) {
    const gridDate = new Date(gridTime)
    const gridTimeOnly = gridDate.getHours() * 60 + gridDate.getMinutes()
    
    // If this time slot is in the future, fill with null
    if (gridTimeOnly > currentTimeOnly) {
      filled.push({
        timestamp: gridTime,
        risk: null,
        ltp: null,
        delta: null,
        theta: null,
        iv: null
      })
      continue
    }
    
    // Find exact or closest data point
    const match = backendData?.find(d => {
      const backendTime = new Date(d.timestamp).getTime()
      const gridTimeMs = new Date(gridTime).getTime()
      return Math.abs(backendTime - gridTimeMs) < 30000
    })
    
    if (match) {
      lastKnownData = {
        timestamp: gridTime,
        risk: match.risk,
        ltp: match.ltp,
        delta: match.delta,
        theta: match.theta,
        iv: match.iv
      }
      filled.push(lastKnownData)
    } else if (lastKnownData) {
      // Forward-fill with last known data
      filled.push({
        ...lastKnownData,
        timestamp: gridTime
      })
    } else {
      // No data yet
      filled.push({
        timestamp: gridTime,
        risk: null,
        ltp: null,
        delta: null,
        theta: null,
        iv: null
      })
    }
  }
  
  return filled
}

// Format timestamp for tooltip
export const formatTimestamp = (timestamp, range) => {
  const date = new Date(timestamp)
  
  if (range === '1D') {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  
  return `${day} ${month} ${hours}:${minutes}:${seconds} '${year}`
}

