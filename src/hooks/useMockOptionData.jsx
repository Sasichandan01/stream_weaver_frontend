// src/hooks/useMockOptionData.js
import { useQuery } from '@tanstack/react-query'

const generateMockHistory = (strike, range) => {
  const points = range === '1D' ? 390 : range === '1W' ? 1950 : 3900
  
  return Array.from({ length: points }, (_, i) => {
    const now = new Date()
    const timestamp = new Date(now.getTime() - (points - i) * 60000)
    
    return {
      timestamp: timestamp.toISOString(),
      risk: Math.floor(Math.random() * 100),
      ltp: Math.random() * 200 + 50,
      delta: Math.random() * 1,
      theta: -Math.random() * 0.5,
      iv: Math.random() * 50 + 10,
    }
  })
}

export const useMockOptionHistory = (strike, expiry, range = '1D') => {
  return useQuery({
    queryKey: ['optionHistory', strike, expiry, range],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return generateMockHistory(strike, range)
    },
    enabled: !!strike && !!expiry,
    staleTime: 60000,
  })
}