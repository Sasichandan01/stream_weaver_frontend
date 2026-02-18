// src/components/ExpirySelector.jsx
import useWebSocketStore from "../store/websocketStore";
import { formatExpiry } from "../utils/formatters";

const ExpirySelector = () => {
  const { availableExpiries, selectedExpiry, setSelectedExpiry } =
    useWebSocketStore();

  return (
    <select
      value={selectedExpiry || ""}
      onChange={(e) => setSelectedExpiry(e.target.value)}
      className="expiry-dropdown"
    >
      {availableExpiries.map((expiry) => (
        <option key={expiry} value={expiry}>
          {formatExpiry(expiry)}
        </option>
      ))}
    </select>
  );
};

export default ExpirySelector;
