// src/components/EmailAlerts.jsx
import { useState } from "react";
import useWebSocketStore from "../store/websocketStore";
import { formatExpiry } from "../utils/formatters";

const messageBoxStyle = {
  marginBottom: "16px",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "0.9rem",
};

const successStyle = {
  ...messageBoxStyle,
  backgroundColor: "#e8f5e9",
  border: "1px solid #81c784",
  color: "#2e7d32",
};

const infoStyle = {
  ...messageBoxStyle,
  backgroundColor: "#e3f2fd",
  border: "1px solid #90caf9",
  color: "#1565c0",
};

const errorStyle = {
  ...messageBoxStyle,
  backgroundColor: "#ffebee",
  border: "1px solid #ef5350",
  color: "#c62828",
};

const EmailAlerts = () => {
  const [email, setEmail] = useState("");
  const [riskThreshold, setRiskThreshold] = useState(75);
  const [selectedExpiry, setSelectedExpiry] = useState("");
  const [optionNames, setOptionNames] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'info'|'error', text: '...' }

  const { availableExpiries } = useWebSocketStore();
  const points = [0, 30, 50, 75, 100];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const alertData = {
      option: optionNames.split(",")[0]?.trim() || "NIFTY25400CE",
      email,
      risk: String(riskThreshold),
      expiry: selectedExpiry,
    };

    console.log("Alert Configuration:", alertData);

    try {
      const response = await fetch("http://localhost:8000/api/email-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alertData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.detail || "Failed to save subscription. Please try again.",
        });
        return;
      }

      // Show different messages based on verification status
      if (data.verified) {
        // User is already verified - show success message
        setMessage({
          type: "success",
          text:
            data.message ||
            "Alert configured successfully! You will receive notifications when risk threshold is exceeded.",
        });
      } else {
        // User needs to verify - show info message
        setMessage({
          type: "info",
          text:
            data.message ||
            "Please check your email and click the verification link to activate alerts.",
        });
      }

      // Close modal after 5 seconds and reset
      setTimeout(() => {
        setMessage(null);
        setIsModalOpen(false);
        setEmail("");
        setRiskThreshold(75);
        setSelectedExpiry("");
        setOptionNames("");
      }, 5000);
    } catch (error) {
      console.error("Error submitting alert:", error);
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage(null);
  };

  const getMessageStyle = () => {
    if (!message) return null;
    switch (message.type) {
      case "success":
        return successStyle;
      case "info":
        return infoStyle;
      case "error":
        return errorStyle;
      default:
        return infoStyle;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="email-alert-trigger"
      >
        📧 Setup Email Alerts
      </button>

      {isModalOpen && (
        <div className="email-modal-overlay" onClick={closeModal}>
          <div className="email-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Email Alert Configuration</h2>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
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

              <div className="form-group">
                <label className="form-label">Risk Score Threshold</label>
                <div className="input-with-indicator">
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={points.indexOf(riskThreshold)}
                    onChange={(e) =>
                      setRiskThreshold(points[parseInt(e.target.value)])
                    }
                    className="form-range"
                    list="tickmarks"
                  />
                  <span className="range-value">{riskThreshold}</span>

                  <datalist id="tickmarks">
                    <option value="0" label="0"></option>
                    <option value="1" label="30"></option>
                    <option value="2" label="50"></option>
                    <option value="3" label="75"></option>
                    <option value="4" label="100"></option>
                  </datalist>
                </div>
                <p className="form-hint">
                  Get email alert when risk score exceeds this value
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <select
                  value={selectedExpiry}
                  onChange={(e) => setSelectedExpiry(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select Expiry</option>
                  {availableExpiries.map((expiry) => (
                    <option key={expiry} value={expiry}>
                      {formatExpiry(expiry)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Option Names</label>
                <input
                  type="text"
                  value={optionNames}
                  onChange={(e) => setOptionNames(e.target.value)}
                  placeholder="24500CE, 24600PE, 24700CE"
                  className="form-input"
                />
                <p className="form-hint">
                  Enter option names separated by commas.
                </p>
              </div>

              {/* Dynamic message box */}
              {message && <div style={getMessageStyle()}>{message.text}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                  disabled={message !== null}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={message !== null}
                >
                  {message ? "Saving..." : "Save Alert Settings"}
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
