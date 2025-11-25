import React, { useState, useEffect } from 'react';

const SessionInfo = ({ sessionInfo }) => {
  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    if (!sessionInfo) return;

    const updateTime = () => {
      const remaining = sessionInfo.timeRemainingMinutes;
      const hours = Math.floor(remaining / 60);
      const minutes = remaining % 60;
      setTimeDisplay(
        hours > 0 
          ? `${hours}h ${minutes}m remaining`
          : `${minutes}m remaining`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [sessionInfo]);

  if (!sessionInfo) {
    return null;
  }

  const getStatusColor = () => {
    if (sessionInfo.isExpired) return '#ff6b6b';
    if (sessionInfo.timeRemainingMinutes < 30) return '#ffd93d';
    return '#51cf66';
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="session-info-container">
      <div className="session-info-card">
        <div className="session-header">
          <h3>🔐 Session Information</h3>
          <div className="session-status" style={{ backgroundColor: getStatusColor() }}>
            {sessionInfo.isExpired ? '❌ Expired' : '✅ Active'}
          </div>
        </div>

        <div className="session-details">
          <div className="session-detail-row">
            <span className="detail-label">User Email:</span>
            <span className="detail-value">{sessionInfo.user}</span>
          </div>

          <div className="session-detail-row">
            <span className="detail-label">Session ID:</span>
            <span className="detail-value session-id">{sessionInfo.sessionId}</span>
          </div>

          <div className="session-detail-row">
            <span className="detail-label">Login Time:</span>
            <span className="detail-value">
              {formatDateTime(sessionInfo.loginTime)}
            </span>
          </div>

          <div className="session-detail-row">
            <span className="detail-label">Expiry Time:</span>
            <span className="detail-value">
              {formatDateTime(sessionInfo.expiryTime)}
            </span>
          </div>

          <div className="session-detail-row session-time-remaining">
            <span className="detail-label">⏱️ Time Remaining:</span>
            <span className="detail-value time-display">
              {sessionInfo.isExpired ? 'Session Expired' : timeDisplay}
            </span>
          </div>
        </div>

        <div className="session-storage-info">
          <p>💾 Storage Method: <strong>sessionStorage + JWT Simulation</strong></p>
          <p>🔒 Token Format: JWT (Header.Payload.Signature)</p>
          <p>⏳ Session Duration: 24 hours (or until tab closes)</p>
          <p>🛡️ Security: Verified on every session check</p>
        </div>

        <div className="session-note">
          <strong>Note:</strong> Session persists while the browser tab is open and expires after 24 hours or when you logout.
        </div>
      </div>
    </div>
  );
};

export default SessionInfo;
