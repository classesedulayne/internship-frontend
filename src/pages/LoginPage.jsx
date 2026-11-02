import React, { useState } from "react";
import { ArrowRight, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2, User, Lock, Mail } from "lucide-react";
import { api } from "../services/api";

export default function LoginPage({ 
  onStudentLoginSuccess, 
  onAdminLoginSuccess 
}) {
  // 'login' | 'signup'
  const [authMode, setAuthMode] = useState("login");

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle Login (Email + Password)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await api.unifiedLogin(email.trim(), password.trim());
      localStorage.setItem("looka_token", data.token);

      if (data.role === "admin") {
        onAdminLoginSuccess(data.user);
      } else {
        onStudentLoginSuccess(data.user, data.application);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up (Email + Password + Confirm Password)
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signupEmail.trim()) {
      setError("Please enter an email address.");
      return;
    }
    if (!signupPassword) {
      setError("Please create a password.");
      return;
    }
    if (signupPassword.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.studentSignup({
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        confirm_password: signupConfirmPassword
      });

      // After signup, go back to login tab — do NOT store token yet.
      // User must login with their credentials to reach the dashboard.
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      setAuthMode("login");
      setSuccessMsg("✅ Account created! Please sign in with your email and password.");

    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8faff 0%, #edf4ff 100%)",
      padding: "24px 16px",
      fontFamily: "var(--font-sans)"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "#ffffff",
        borderRadius: "24px",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 14px 40px -10px rgba(37, 99, 235, 0.12)",
        padding: "36px 32px",
      }}>

        {/* Tab Switcher: Login vs Sign Up */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          background: "#f1f5f9",
          padding: "5px",
          borderRadius: "14px",
          marginBottom: "26px"
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setError(""); setSuccessMsg(""); }}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: authMode === "login" ? "#ffffff" : "transparent",
              color: authMode === "login" ? "#2563eb" : "#64748b",
              fontWeight: "800",
              fontSize: "0.92rem",
              cursor: "pointer",
              boxShadow: authMode === "login" ? "0 2px 8px rgba(37, 99, 235, 0.12)" : "none",
              transition: "all 0.2s"
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode("signup"); setError(""); setSuccessMsg(""); }}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: authMode === "signup" ? "#ffffff" : "transparent",
              color: authMode === "signup" ? "#2563eb" : "#64748b",
              fontWeight: "800",
              fontSize: "0.92rem",
              cursor: "pointer",
              boxShadow: authMode === "signup" ? "0 2px 8px rgba(37, 99, 235, 0.12)" : "none",
              transition: "all 0.2s"
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Header Heading */}
        <div style={{ marginBottom: "22px" }}>
          <h1 style={{
            fontSize: "1.65rem",
            fontWeight: "800",
            color: "#0f172a",
            letterSpacing: "-0.02em",
            marginBottom: "6px"
          }}>
            Welcome to the Internship
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.88rem" }}>
            {authMode === "login" 
              ? "Sign in with your email address and password." 
              : "Create an account with email and password to apply."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            color: "#dc2626",
            fontSize: "0.84rem",
            marginBottom: "18px"
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 14px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "10px",
            color: "#059669",
            fontSize: "0.84rem",
            marginBottom: "18px",
            fontWeight: "600"
          }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ── MODE 1: LOGIN ── */}
        {authMode === "login" && (
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                Email Address <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="name@example.com"
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "11px 13px 11px 38px",
                    background: "#fff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <Mail size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                Password <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 40px 11px 38px",
                    background: "#fff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: "4px"
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "0.95rem",
                fontWeight: "700",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)"
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── MODE 2: SIGN UP ── */}
        {authMode === "signup" && (
          <form onSubmit={handleSignUp}>
            {/* Full Name */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={signupName}
                  onChange={e => { setSignupName(e.target.value); setError(""); }}
                  placeholder="e.g. Rahul Sharma"
                  style={{
                    width: "100%",
                    padding: "11px 13px 11px 38px",
                    background: "#fff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <User size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                Email Address <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={e => { setSignupEmail(e.target.value); setError(""); }}
                  placeholder="student@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 13px 11px 38px",
                    background: "#fff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <Mail size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Create Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                Create Password <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showSignupPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={e => { setSignupPassword(e.target.value); setError(""); }}
                  placeholder="Create password"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 40px 11px 38px",
                    background: "#fff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: "4px"
                  }}
                >
                  {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                Confirm Password <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showSignupPassword ? "text" : "password"}
                  value={signupConfirmPassword}
                  onChange={e => { setSignupConfirmPassword(e.target.value); setError(""); }}
                  placeholder="Confirm password"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 13px 11px 38px",
                    background: "#fff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "0.95rem",
                fontWeight: "700",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)"
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Bottom Toggle */}
        <div style={{ textAlign: "center", marginTop: "22px" }}>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
            {authMode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setAuthMode("signup"); setError(""); setSuccessMsg(""); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: "700",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setError(""); setSuccessMsg(""); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: "700",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
