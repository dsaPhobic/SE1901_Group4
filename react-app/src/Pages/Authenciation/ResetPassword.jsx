import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../Services/AuthApi';
import BrandPanel from '../../Components/Layout/BrandPanel.jsx';
import AuthLayout from '../../Components/Layout/AuthLayout';
import Button from '../../Components/Auth/Button';
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import './ResetPassword.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { email, resetToken } = location.state || {};

  useEffect(() => {
    if (!email || !resetToken) {
      navigate('/forgot-password');
      return;
    }
  }, [email, resetToken, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(
        email, 
        resetToken, 
        formData.newPassword, 
        formData.confirmPassword
      );
      setMessage(response.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#dc3545';
    if (passwordStrength < 75) return '#ffc107';
    return '#28a745';
  };

  if (!email || !resetToken) {
    return null;
  }

  return (
    <div className="reset-password-page">
      <BrandPanel />
      <div className="right-part">
        <div className="auth-card">
          <AuthLayout title="Reset Your Password">
            <div className="reset-password-header">
              <p>Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                />
                {formData.newPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <span 
                      className="strength-text"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                />
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <div className="password-mismatch">
                    <AlertCircle size={16} />
                    Passwords do not match
                  </div>
                )}
              </div>

              {message && (
                <div className="success-message">
                  <div className="success-icon">
                    <CheckCircle size={16} />
                  </div>
                  <div className="success-text">{message}</div>
                  <p>Redirecting to login page...</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <div className="error-icon">
                    <AlertCircle size={16} />
                  </div>
                  <div className="error-text">{error}</div>
                </div>
              )}

              <div className="button-location">
                <Button 
                  type="submit" 
                  variant="yellow"
                  disabled={loading || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 6}
                >
                  {loading ? (
                    <div className="loading-content">
                      <Loader2 size={10} className="loading-spinner" />
                      <span>Resetting Password...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>

            <div className="reset-password-footer">
              <button 
                type="button"
                className="back-btn"
                onClick={() => navigate('/verify-otp', { state: { email } })}
              >
                <ArrowLeft size={16} />
                Back to Verification
              </button>
            </div>
          </AuthLayout>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
