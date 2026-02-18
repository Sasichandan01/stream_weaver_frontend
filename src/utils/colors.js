// src/utils/colors.js
export const COLORS = {
  // Backgrounds
  bgMain: '#0a0a0a',
  bgCard: '#141414',
  border: '#2a2a2a',

  // Risk zones
  riskLow: '#10b981',    // 0-50 green
  riskMid: '#f59e0b',    // 50-75 amber
  riskHigh: '#ef4444',   // 75-100 red

  // Chart lines
  risk: '#3b82f6',       // blue
  ltp: '#10b981',        // green
  delta: '#06b6d4',      // cyan
  theta: '#8b5cf6',      // purple
  iv: '#ec4899',         // pink

  // Text
  textPrimary: '#e5e5e5',
  textSecondary: '#737373',
  textAccent: '#ffffff',
}

export const getRiskColor = (score) => {
  if (score <= 50) return COLORS.riskLow
  if (score <= 75) return COLORS.riskMid
  return COLORS.riskHigh
}