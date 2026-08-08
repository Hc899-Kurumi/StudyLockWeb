import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ConfigNotice } from "../../components/ui";
import AuthShell from "./AuthShell";

export default function Signup() {
  const { signup, loginWithGoogle, configured } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (password.length < 6) {
      setErr("Use a password with at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      await signup(email, password, name);
      navigate("/dashboard", { replace: true });
    } catch (e2) {
      setErr(friendly(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      sub="Free to start. Plan your week and lock in within minutes."
    >
      {!configured && <ConfigNotice />}
      {err && <p className="error-text" style={{ marginBottom: ".8rem" }}>{err}</p>}
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" autoComplete="name"
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="new-password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn--primary btn--full" disabled={busy || !configured}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <div className="auth-or"><span>or</span></div>
      <button className="btn btn--ghost btn--full" onClick={loginWithGoogle} disabled={!configured}>
        Continue with Google
      </button>
      <p className="auth-alt">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthShell>
  );
}

function friendly(e) {
  const c = e?.code || "";
  if (c.includes("email-already-in-use")) return "That email already has an account. Log in instead.";
  if (c.includes("invalid-email")) return "That email address doesn't look right.";
  if (c.includes("weak-password")) return "Use a stronger password (at least 6 characters).";
  return "Something went wrong creating your account. Please try again.";
}
