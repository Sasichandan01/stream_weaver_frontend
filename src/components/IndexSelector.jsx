// src/components/IndexSelector.jsx
import useWebSocketStore from "../store/websocketStore";
import { formatIndex } from "../utils/formatters"; // Optional: create this formatter

const IndexSelector = () => {
  const { availableIndices, selectedIndex, setSelectedIndex } =
    useWebSocketStore();

  return (
    <select
      value={selectedIndex || ""}
      onChange={(e) => setSelectedIndex(e.target.value)}
      className="expiry-dropdown"
    >
      {availableIndices.map((index) => (
        <option key={index} value={index}>
          {formatIndex ? formatIndex(index) : index}
        </option>
      ))}
    </select>
  );
};

export default IndexSelector;
