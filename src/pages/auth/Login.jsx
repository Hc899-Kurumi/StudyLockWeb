import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Brand, ConfigNotice } from "../../components/ui";
import AuthShell from "./AuthShell";

export default function Login() {
  const { login, loginWithGoogle, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(dest, { replace: true });
    } catch (e2) {
      setErr(friendly(e2));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setErr("");
    try {
      await loginWithGoogle();
      navigate(dest, { replace: true });
    } catch (e2) {
      setErr(friendly(e2));
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      sub="Log in to reach your planner, schedules, and blocklists."
    >
      {!configured && <ConfigNotice />}
      {err && <p className="error-text" style={{ marginBottom: ".8rem" }}>{err}</p>}
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn--primary btn--full" disabled={busy || !configured}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
      <div className="auth-or"><span>or</span></div>
      <button className="btn btn--ghost btn--full" onClick={google} disabled={!configured}>
        Continue with Google
      </button>
      <p className="auth-alt">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}

function friendly(e) {
  const c = e?.code || "";
  if (c.includes("invalid-credential") || c.includes("wrong-password") || c.includes("user-not-found"))
    return "That email and password don't match. Try again.";
  if (c.includes("too-many-requests")) return "Too many attempts. Wait a moment and retry.";
  return "Something went wrong logging in. Please try again.";
}
