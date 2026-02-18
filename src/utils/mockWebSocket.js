// src/utils/mockWebSocket.js
export const generateMockOptions = (expiry) => {
  const strikes = Array.from({ length: 20 }, (_, i) => 24500 + i * 100)
  
  return strikes.flatMap(strike => [
    {
      strike: `${strike}CE`,
      risk: Math.floor(Math.random() * 100),
      ltp: Math.random() * 200 + 50,
      delta: Math.random() * 1,
      theta: -Math.random() * 0.5,
      iv: Math.random() * 50 + 10,
      recommendation: ['HOLD', 'REDUCE', 'EXIT'][Math.floor(Math.random() * 3)],
    },
    {
      strike: `${strike}PE`,
      risk: Math.floor(Math.random() * 100),
      ltp: Math.random() * 200 + 50,
      delta: -Math.random() * 1,
      theta: -Math.random() * 0.5,
      iv: Math.random() * 50 + 10,
      recommendation: ['HOLD', 'REDUCE', 'EXIT'][Math.floor(Math.random() * 3)],
    },
  ])
}

export const generateMockPayload = () => {
  const expiries = [
    '2025-02-20',
    '2025-02-27',
    '2025-03-06',
  ]

  return {
    timestamp: new Date().toISOString(),
    expiries: expiries.reduce((acc, expiry) => {
      acc[expiry] = generateMockOptions(expiry)
      return acc
    }, {}),
  }
}