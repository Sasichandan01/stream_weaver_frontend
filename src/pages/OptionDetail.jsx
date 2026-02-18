// src/pages/OptionDetail.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWebSocketStore from "../store/websocketStore";
import { useMockOptionHistory } from "../hooks/useMockOptionData";
import RiskChart from "../components/RiskChart";
import PriceChart from "../components/PriceChart";
import GreeksChart from "../components/GreeksChart";
import CombinedChart from "../components/CombinedChart";
import { getRiskColor } from "../utils/colors";
import { formatExpiry } from "../utils/formatters";

const RANGES = ["1D", "1W", "2W", "1M"];

const OptionDetail = () => {
  const { strike, expiry } = useParams();
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState("1D");
  const [activeChart, setActiveChart] = useState("combined");

  const { liveData } = useWebSocketStore();
  const currentOption = liveData[expiry]?.find((o) => o.strike === strike);

  const { data: history, isLoading } = useMockOptionHistory(
    strike,
    expiry,
    selectedRange,
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8 max-w-7xl border-l-2 border-r-2 border-[#2a2a2a]">
        {/* Navigation */}
        <div className="mb-20">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-[#737373] hover:text-white transition-colors duration-200"
          >
            <span>←</span>
            <span className="text-sm">Back to Overview</span>
          </button>
        </div>

        {/* Stats Grid */}
        {currentOption && (
          <div className="mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
              {/* Strike */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 text-center hover:border-[#3b82f6] transition-all duration-300 hover:shadow-lg hover:shadow-[#3b82f6]/10">
                <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
                  Strike
                </p>
                <p className="text-white text-xl font-semibold">{strike}</p>
              </div>

              {/* Expiry */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 text-center hover:border-[#3b82f6] transition-all duration-300 hover:shadow-lg hover:shadow-[#3b82f6]/10">
                <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
                  Expiry
                </p>
                <p className="text-white text-xl font-semibold">
                  {formatExpiry(expiry)}
                </p>
              </div>

              {/* Risk Score */}
              <div
                className="border-2 rounded-xl p-5 text-center transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${getRiskColor(currentOption.risk)}18`,
                  borderColor: getRiskColor(currentOption.risk),
                }}
              >
                <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
                  Risk Score
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: getRiskColor(currentOption.risk) }}
                >
                  {currentOption.risk}
                </p>
              </div>

              {/* LTP */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 text-center hover:border-[#3b82f6] transition-all duration-300 hover:shadow-lg hover:shadow-[#3b82f6]/10">
                <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
                  LTP
                </p>
                <p className="text-white text-xl font-semibold">
                  {currentOption.ltp.toFixed(2)}
                </p>
              </div>

              {/* Delta */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 text-center hover:border-[#3b82f6] transition-all duration-300 hover:shadow-lg hover:shadow-[#3b82f6]/10">
                <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
                  Delta
                </p>
                <p className="text-white text-xl font-semibold">
                  {currentOption.delta.toFixed(3)}
                </p>
              </div>

              {/* Theta */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 text-center hover:border-[#3b82f6] transition-all duration-300 hover:shadow-lg hover:shadow-[#3b82f6]/10">
                <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
                  Theta
                </p>
                <p className="text-white text-xl font-semibold">
                  {currentOption.theta.toFixed(3)}
                </p>
              </div>

              {/* IV */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 text-center hover:border-[#3b82f6] transition-all duration-300 hover:shadow-lg hover:shadow-[#3b82f6]/10">
                <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
                  IV
                </p>
                <p className="text-white text-xl font-semibold">
                  {currentOption.iv.toFixed(2)}
                </p>
              </div>

              {/* Recommendation */}
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 text-center hover:border-[#3b82f6] transition-all duration-300 hover:shadow-lg hover:shadow-[#3b82f6]/10">
                <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
                  Action
                </p>
                <p className="text-white text-xl font-semibold">
                  {currentOption.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-2 bg-[#141414] p-1 rounded-lg border border-[#2a2a2a]">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedRange === r
                    ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30"
                    : "text-[#737373] hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Type Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-1 border-b border-[#2a2a2a]">
            {["combined", "risk", "price", "greeks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveChart(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-all duration-200 relative ${
                  activeChart === tab
                    ? "text-white"
                    : "text-[#737373] hover:text-white"
                }`}
              >
                {tab === "combined" ? "Risk + Price" : tab}
                {activeChart === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-[#141414] rounded-2xl border border-[#2a2a2a] p-6 lg:p-8 shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#737373] text-sm">Loading chart data...</p>
            </div>
          ) : (
            <div className="w-full">
              {activeChart === "combined" && <CombinedChart data={history} />}
              {activeChart === "risk" && <RiskChart data={history} />}
              {activeChart === "price" && <PriceChart data={history} />}
              {activeChart === "greeks" && <GreeksChart data={history} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionDetail;
