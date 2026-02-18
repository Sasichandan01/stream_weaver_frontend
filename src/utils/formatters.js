// src/utils/formatters.js
import { format } from 'date-fns'

export const formatTime = (timestamp) =>
  format(new Date(timestamp), 'HH:mm')

export const formatDate = (timestamp) =>
  format(new Date(timestamp), 'dd MMM yyyy')

export const formatExpiry = (expiry) =>
  format(new Date(expiry), 'dd MMM')

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
