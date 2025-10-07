import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../Services/AuthApi';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2>Forgot Password?</h2>
          <p>Enter your email address and we'll send you a verification code to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          {message && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              {message}
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
            className="submit-btn"
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Send Verification Code
              </>
            )}
          </button>
        </form>

        <div className="forgot-password-footer">
          <p>
            Remember your password? 
            <Link to="/login" className="login-link">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
