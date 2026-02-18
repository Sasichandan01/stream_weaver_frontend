// src/components/EmailAlerts.jsx
import { useState } from "react";
import useWebSocketStore from "../store/websocketStore";

const EmailAlerts = () => {
  const [email, setEmail] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    riskThreshold: 75,
    priceChange: 10,
    deltaChange: 0.2,
    selectedOptions: [],
    frequency: "instant", // instant, hourly, daily
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { liveData, selectedExpiry } = useWebSocketStore();
  const currentOptions = liveData[selectedExpiry] ?? [];

  const toggleOption = (strike) => {
    setAlertConfig((prev) => ({
      ...prev,
      selectedOptions: prev.selectedOptions.includes(strike)
        ? prev.selectedOptions.filter((s) => s !== strike)
        : [...prev.selectedOptions, strike],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const alertData = {
      email,
      ...alertConfig,
      expiry: selectedExpiry,
      timestamp: new Date().toISOString(),
    };

    console.log("Alert Configuration:", alertData);
    // TODO: Send to backend API
    // await fetch('/api/email-alerts', { method: 'POST', body: JSON.stringify(alertData) })

    alert("Email alerts configured successfully!");
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="email-alert-trigger"
      >
        📧 Setup Email Alerts
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="email-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="email-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Email Alert Configuration</h2>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Email Input */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="form-input"
                  required
                />
              </div>

              {/* Alert Triggers */}
              <div className="form-section">
                <h3 className="section-title">Alert Triggers</h3>

                <div className="form-group">
                  <label className="form-label">Risk Score Threshold</label>
                  <div className="input-with-indicator">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={alertConfig.riskThreshold}
                      onChange={(e) =>
                        setAlertConfig((prev) => ({
                          ...prev,
                          riskThreshold: parseInt(e.target.value),
                        }))
                      }
                      className="form-range"
                    />
                    <span className="range-value">
                      {alertConfig.riskThreshold}
                    </span>
                  </div>
                  <p className="form-hint">
                    Alert when risk score exceeds this value
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Price Change % Threshold</label>
                  <div className="input-with-indicator">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={alertConfig.priceChange}
                      onChange={(e) =>
                        setAlertConfig((prev) => ({
                          ...prev,
                          priceChange: parseInt(e.target.value),
                        }))
                      }
                      className="form-range"
                    />
                    <span className="range-value">
                      {alertConfig.priceChange}%
                    </span>
                  </div>
                  <p className="form-hint">
                    Alert on price movements greater than this %
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Delta Change Threshold</label>
                  <div className="input-with-indicator">
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="1"
                      value={alertConfig.deltaChange}
                      onChange={(e) =>
                        setAlertConfig((prev) => ({
                          ...prev,
                          deltaChange: parseFloat(e.target.value),
                        }))
                      }
                      className="form-input-small"
                    />
                  </div>
                  <p className="form-hint">
                    Alert when delta changes by this amount
                  </p>
                </div>
              </div>

              {/* Frequency */}
              <div className="form-section">
                <h3 className="section-title">Alert Frequency</h3>
                <div className="radio-group">
                  {[
                    { value: "instant", label: "Instant (Real-time)" },
                    { value: "hourly", label: "Hourly Digest" },
                    { value: "daily", label: "Daily Summary" },
                  ].map((option) => (
                    <label key={option.value} className="radio-label">
                      <input
                        type="radio"
                        value={option.value}
                        checked={alertConfig.frequency === option.value}
                        onChange={(e) =>
                          setAlertConfig((prev) => ({
                            ...prev,
                            frequency: e.target.value,
                          }))
                        }
                        className="radio-input"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options Selection */}
              <div className="form-section">
                <h3 className="section-title">Monitor Specific Options</h3>
                <p className="section-hint">
                  Leave empty to monitor all options
                </p>
                <div className="options-grid">
                  {currentOptions.slice(0, 10).map((option) => (
                    <label key={option.strike} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={alertConfig.selectedOptions.includes(
                          option.strike,
                        )}
                        onChange={() => toggleOption(option.strike)}
                        className="checkbox-input"
                      />
                      <span>{option.strike}</span>
                    </label>
                  ))}
                </div>
                {alertConfig.selectedOptions.length > 0 && (
                  <p className="selected-count">
                    {alertConfig.selectedOptions.length} option(s) selected
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Alert Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailAlerts;
