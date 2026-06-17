import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ExternalLink, LockKeyhole, Sparkles } from "lucide-react";
import { DEMO_CREDENTIALS } from "./panelConfig";

export default function AdminLogin({ credentials, setCredentials, authError, authLoading, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  function fillDemoCredentials() {
    setCredentials({ ...DEMO_CREDENTIALS });
  }

  return (
    <div className="admin-login-screen">
      <div className="admin-login-grid">
        <motion.section
          className="admin-login-hero"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="admin-login-badge">
            <Sparkles size={16} />
            PNGUM Content Studio
          </div>
          <h1>Manage your homepage in one place</h1>
          <p>
            Update hero text, ministries, news, videos, navigation, and branding — then publish instantly to the live
            site.
          </p>
          <ul className="admin-login-features">
            <li>Structured editors for every homepage section</li>
            <li>Image & video uploads with YouTube support</li>
            <li>Drag-free page menu management</li>
          </ul>
          <a className="admin-login-home-link" href="/" target="_blank" rel="noreferrer">
            View live homepage
            <ExternalLink size={15} />
          </a>
        </motion.section>

        <motion.form
          className="admin-login-card"
          onSubmit={onLogin}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <div className="admin-login-card-head">
            <div className="admin-login-icon" aria-hidden="true">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h2>Sign in</h2>
              <p>Use your portal account to continue.</p>
            </div>
          </div>

          <label className="admin-field-label" htmlFor="portal-identifier">
            Email or username
          </label>
          <input
            id="portal-identifier"
            className="admin-field-input"
            value={credentials.identifier}
            onChange={(e) => setCredentials((prev) => ({ ...prev, identifier: e.target.value }))}
            placeholder="you@church.org"
            autoComplete="username"
            required
          />

          <label className="admin-field-label" htmlFor="portal-password">
            Password
          </label>
          <div className="admin-password-wrap">
            <input
              id="portal-password"
              className="admin-field-input"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="admin-primary-btn admin-login-submit" disabled={authLoading} type="submit">
            {authLoading ? "Signing in..." : "Sign in to admin"}
          </button>

          {authError ? <p className="admin-inline-error">{authError}</p> : null}

          <div className="admin-demo-box">
            <p className="admin-demo-title">Local demo account</p>
            <p className="admin-demo-copy">
              <strong>{DEMO_CREDENTIALS.identifier}</strong>
              <span>Password: {DEMO_CREDENTIALS.password}</span>
            </p>
            <button type="button" className="admin-ghost-btn" onClick={fillDemoCredentials}>
              Use demo credentials
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
