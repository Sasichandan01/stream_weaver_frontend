// src/components/ExpirySelector.jsx
import useWebSocketStore from "../store/websocketStore";

const formatExpiryDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Return as-is if invalid

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });

    return `${day} ${month}`;
  } catch {
    return dateString;
  }
};

const ExpirySelector = () => {
  const expiries = useWebSocketStore((state) => state.expiries);
  const selectedExpiry = useWebSocketStore((state) => state.selectedExpiry);
  const setSelectedExpiry = useWebSocketStore(
    (state) => state.setSelectedExpiry,
  );

  const expiryDates = expiries ? Object.keys(expiries) : [];

  if (expiryDates.length === 0) {
    return null;
  }

  return (
    <select
      value={selectedExpiry || ""}
      onChange={(e) => setSelectedExpiry(e.target.value)}
      className="expiry-select"
    >
      {expiryDates.map((expiry) => (
        <option key={expiry} value={expiry}>
          {formatExpiryDate(expiry)}
        </option>
      ))}
    </select>
  );
};

export default ExpirySelector;
