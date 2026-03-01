// src/utils/formatters.js
import { format, parseISO } from 'date-fns'

// src/utils/formatters.js
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate(); 

  if (isToday) {
    // Only time for today
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // For other days: 2 Jun 2025
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); 
};


export const formatDate = (timestamp) =>
  format(parseISO(timestamp), 'dd MMM yyyy')

export const formatExpiry = (expiry) =>
  format(parseISO(expiry), 'dd MMM')

export const formatRisk = (score) =>
  `${Math.round(score)}`

export const formatLTP = (ltp) =>
  ltp.toFixed(2)

// src/utils/formatters.js
export const formatIndex = (index) => {
  const map = {
    NIFTY: 'Nifty 50',
    BANKNIFTY: 'Nifty Bank',
    SENSEX: 'Sensex'
  };
  return map[index] || index;
};
