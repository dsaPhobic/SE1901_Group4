import React, { useState, useEffect } from "react";
import AuthLayout from "../../Components/Layout/AuthLayout";
import FormInput from "../../Components/Auth/InputField";
import Button from "../../Components/Auth/Button";
import { login, register, loginWithGoogle } from "../../Services/AuthApi.js";
import userIcon from "../../assets/auth_user.png";
import lockIcon from "../../assets/auth_lock.png";
import google from "../../assets/google.png";
import BrandPanel from "../../Components/Layout/BrandPanel.jsx";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Loader2 
} from "lucide-react";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginSuccess = params.get("login");
    const email = params.get("email");
    const username = params.get("username");
    const role = params.get("role");

    if (loginSuccess === "success" && email) {
      const user = { email, username, role: role || "user" };
      localStorage.setItem("user", JSON.stringify(user));

      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/home");
    }
  }, [navigate]);

  function getErrorIcon(errorMessage) {
    if (errorMessage.includes("Account not found")) return <User size={16} />;
    if (errorMessage.includes("Incorrect password")) return <Lock size={16} />;
    if (errorMessage.includes("Email has already been used")) return <Mail size={16} />;
    return <AlertCircle size={16} />;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  }

  function switchMode(newMode) {
    setMode(newMode);
    setError(""); // Clear error when switching modes
    setSuccess(""); // Clear success when switching modes
    setForm({ email: "", password: "", username: "" }); // Clear form
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (mode === "login") {
      login({ email: form.email, password: form.password })
        .then((res) => {
          console.log("Login success:", res.data);

          const user = res.data;
          localStorage.setItem("user", JSON.stringify(user));

          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/home");
          }
        })
        .catch((err) => {
          console.error("Auth error:", err.response?.data || err.message);
          // Display specific error message from backend
          const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
          setError(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (mode === "register") {
      register({
        username: form.username,
        email: form.email,
        password: form.password,
      })
        .then((res) => {
          console.log("Register success:", res.data);
          setSuccess("Account created successfully! Please login with your credentials.");
          // Auto switch to login mode after 2 seconds
          setTimeout(() => {
            setMode("login");
            setSuccess("");
          }, 2000);
        })
        .catch((err) => {
          console.error("Auth error:", err.response?.data || err.message);
          const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
          setError(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (mode === "forgot") {
      console.log("Send reset link to:", form.email);
      alert("Reset link sent (mock)");
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <BrandPanel />
      <div className="right-part">
        <div className="auth-card">
          <AuthLayout
            title={
              mode === "login"
                ? "Sign in"
                : mode === "register"
                ? "Register"
                : "Forgot Password"
            }
          >
            {mode === "login" && (
              <div className="social-row">
                <button
                  type="button"
                  className="google"
                  onClick={loginWithGoogle}
                >
                  <img src={google} alt="Google" className="social-img" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {mode === "register" && (
                <FormInput
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  icon={userIcon}
                />
              )}

              <FormInput
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                icon={userIcon}
              />

              {(mode === "login" || mode === "register") && (
                <FormInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  icon={lockIcon}
                />
              )}

              {error && (
                <div className="error-message">
                  <div className="error-icon">{getErrorIcon(error)}</div>
                  <div className="error-text">{error}</div>
                </div>
              )}

              {success && (
                <div className="success-message">
                  <div className="success-icon">
                    <CheckCircle size={16} />
                  </div>
                  <div className="success-text">{success}</div>
                </div>
              )}

              <div className="button-location">
                <Button type="submit" variant="yellow" disabled={isLoading}>
                  {isLoading ? (
                    <div className="loading-content">
                      <Loader2 size={16} className="loading-spinner" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <>
                      {mode === "login" && "Login"}
                      {mode === "register" && "Sign up"}
                      {mode === "forgot" && "Send reset link"}
                    </>
                  )}
                </Button>
              </div>
            </form>

            {mode === "login" && (
              <>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => switchMode("forgot")}
                >
                  Forgot your password?
                </button>
                <div className="divider">
                  <span>or</span>
                </div>
                <div className="button-location">
                  <Button variant="yellow" onClick={() => switchMode("register")}>
                    Create New Account
                  </Button>
                </div>
              </>
            )}

            {mode === "register" && (
              <button
                type="button"
                className="link-like"
                onClick={() => switchMode("login")}
              >
                Already have account? Login
              </button>
            )}

            {mode === "forgot" && (
              <button
                type="button"
                className="link-like"
                onClick={() => switchMode("login")}
              >
                ← Back to login
              </button>
            )}
          </AuthLayout>
        </div>
      </div>
    </div>
  );
};

export default Login;
