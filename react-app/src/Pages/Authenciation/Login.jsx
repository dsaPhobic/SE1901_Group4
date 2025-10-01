import React, { useState } from "react";
import AuthLayout from "../../Components/Layout/AuthLayout";
import FormInput from "../../Components/Auth/InputField";
import Button from "../../Components/Auth/Button";
import { login, register, loginWithGoogle } from "../../Services/AuthApi.js";
import user from "../../assets/auth_user.png";
import lock from "../../assets/auth_lock.png";
import google from "../../assets/google.png";
import BrandPanel from "../../Components/Layout/BrandPanel.jsx";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", username: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (mode === "login") {
        const res = await login({ email: form.email, password: form.password });
        console.log("Login success:", res.data);

        // 👉 điều hướng sang Home
        navigate("/home");
      } else if (mode === "register") {
        const res = await register({
          username: form.username,
          email: form.email,
          password: form.password,
        });
        console.log("Register success:", res.data);

        // 👉 có 2 cách:
        // 1. Chuyển thẳng sang Home luôn
        navigate("/home");

        // 2. Hoặc nếu muốn về màn Login sau khi đăng ký thì:
        // setMode("login");
      } else if (mode === "forgot") {
        console.log("Send reset link to:", form.email);
      }
    } catch (err) {
      console.error("Auth error:", err.response?.data || err.message);
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
            {/* Social login */}
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
                  icon={user}
                />
              )}

              <FormInput
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                icon={user}
              />

              {(mode === "login" || mode === "register") && (
                <FormInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  icon={lock}
                />
              )}

              <div className="button-location">
                <Button type="submit" variant="yellow">
                  {mode === "login" && "Login"}
                  {mode === "register" && "Sign up"}
                  {mode === "forgot" && "Send reset link"}
                </Button>
              </div>
            </form>

            {/* Extra links */}
            {mode === "login" && (
              <>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setMode("forgot")}
                >
                  Forgot your password?
                </button>
                <div className="divider">
                  <span>or</span>
                </div>
                <div className="button-location">
                  <Button variant="yellow" onClick={() => setMode("register")}>
                    Create New Account
                  </Button>
                </div>
              </>
            )}

            {mode === "register" && (
              <button
                type="button"
                className="link-like"
                onClick={() => setMode("login")}
              >
                Already have account? Login
              </button>
            )}

            {mode === "forgot" && (
              <button
                type="button"
                className="link-like"
                onClick={() => setMode("login")}
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
