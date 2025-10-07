import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../Services/AuthApi';
import './VerifyOtp.css';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await verifyOtp(email, otpCode);
      if (response.data.message === 'OTP verified successfully') {
        navigate('/reset-password', { state: { email, resetToken: response.data.resetToken } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(value);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      
      if (response.ok) {
        setTimeLeft(600); // Reset timer
        setOtpCode('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <div className="verify-otp-header">
          <h2>Verify Your Email</h2>
          <p>We've sent a 6-digit verification code to</p>
          <p className="email-address">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="verify-otp-form">
          <div className="form-group">
            <label htmlFor="otp">Enter Verification Code</label>
            <input
              type="text"
              id="otp"
              value={otpCode}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength="6"
              required
              disabled={loading}
              className="otp-input"
            />
          </div>

          {timeLeft > 0 && (
            <div className="timer">
              <i className="fas fa-clock"></i>
              Code expires in {formatTime(timeLeft)}
            </div>
          )}

          {timeLeft === 0 && (
            <div className="expired-message">
              <i className="fas fa-exclamation-triangle"></i>
              Verification code has expired
            </div>
          )}

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="verify-btn"
            disabled={loading || otpCode.length !== 6 || timeLeft === 0}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Verifying...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>
                Verify Code
              </>
            )}
          </button>
        </form>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button 
            type="button"
            className="resend-btn"
            onClick={handleResendOtp}
            disabled={loading || timeLeft > 0}
          >
            {loading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        <div className="verify-otp-footer">
          <button 
            type="button"
            className="back-btn"
            onClick={() => navigate('/forgot-password')}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
