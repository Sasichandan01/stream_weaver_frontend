// src/components/ExpirySelector.jsx
import useWebSocketStore from "../store/websocketStore";

const ExpirySelector = () => {
  const expiries = useWebSocketStore((state) => state.expiries);
  const selectedExpiry = useWebSocketStore((state) => state.selectedExpiry);
  const setSelectedExpiry = useWebSocketStore(
    (state) => state.setSelectedExpiry,
  );

  const expiryDates = expiries ? Object.keys(expiries) : [];

  if (expiryDates.length === 0) {
    return null; // or return a loading state
  }

  return (
    <div className="expiry-selector-container">
      <label className="expiry-label">Expiry Date:</label>
      <select
        value={selectedExpiry || ""}
        onChange={(e) => setSelectedExpiry(e.target.value)}
        className="expiry-select"
      >
        {expiryDates.map((expiry) => (
          <option key={expiry} value={expiry}>
            {expiry}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExpirySelector;
