import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../Services/AuthApi';
import BrandPanel from '../../Components/Layout/BrandPanel.jsx';
import AuthLayout from '../../Components/Layout/AuthLayout';
import Button from '../../Components/Auth/Button';
import { Loader2, ArrowLeft } from 'lucide-react';
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
    <div className="verify-otp-page">
      <BrandPanel />
      <div className="right-part">
        <div className="auth-card">
          <AuthLayout title="Verify Your Email">
            <div className="verify-otp-header">
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
                  <div className="error-icon">
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                  <div className="error-text">{error}</div>
                </div>
              )}

              <div className="button-location">
                <Button 
                  type="submit" 
                  variant="yellow"
                  disabled={loading || otpCode.length !== 6 || timeLeft === 0}
                >
                  {loading ? (
                    <div className="loading-content">
                      <Loader2 size={10} className="loading-spinner" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </div>
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
                onClick={() => navigate('/login?mode=forgot')}
              >
                <ArrowLeft size={16} />
                Back to Email
              </button>
            </div>
          </AuthLayout>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
