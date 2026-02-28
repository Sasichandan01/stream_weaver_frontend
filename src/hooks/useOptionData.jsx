// src/hooks/useOptionData.js
import { useQuery } from "@tanstack/react-query";
import { fetchHistory, generateReqId } from "../utils/api";
import { generateTimeGrid, forwardFillData } from "../utils/chartUtils";
import useWebSocketStore from "../store/websocketStore";

export const useOptionHistory = (symbol, expiry, range = "1D") => {
  const liveGreeks = useWebSocketStore((state) => state.liveGreeks);

  return useQuery({
    queryKey: ["optionHistory", symbol, expiry, range],
    queryFn: async () => {
      const reqId = generateReqId();
      const response = await fetchHistory(symbol, expiry, range, reqId);

      let transformedData = response.data.map((item) => ({
        timestamp: item.time,
        risk: item.risk_score,
        ltp: item.ltp,
        delta: item.delta,
        theta: item.theta,
        iv: item.iv,
      }));

      // For 1D - use time grid
      if (range === "1D") {
        const timeGrid = generateTimeGrid();
        let filledData = forwardFillData(transformedData, timeGrid);

        // Merge live WebSocket data into the last valid point
        if (liveGreeks?.symbol === symbol && liveGreeks.ltp) {
          const lastValidIndex = filledData.findLastIndex(
            (d) => d.ltp !== null,
          );
          if (lastValidIndex >= 0) {
            filledData[lastValidIndex] = {
              ...filledData[lastValidIndex],
              risk:
                liveGreeks.overall_risk_score ||
                liveGreeks.risk_score ||
                filledData[lastValidIndex].risk,
              ltp: liveGreeks.ltp,
              delta: liveGreeks.delta || filledData[lastValidIndex].delta,
              theta: liveGreeks.theta || filledData[lastValidIndex].theta,
              iv: liveGreeks.iv || filledData[lastValidIndex].iv,
            };
          }
        }

        return filledData;
      }

      // For other ranges - raw data
      return transformedData;
    },
    enabled: !!symbol && !!expiry,
    staleTime: 1000,
    refetchInterval: liveGreeks?.symbol === symbol ? 5000 : false, // Refetch every 5s when viewing this option
    retry: false,
  });
};
