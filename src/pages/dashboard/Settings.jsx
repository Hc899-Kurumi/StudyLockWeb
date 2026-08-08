import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { deleteAllUserData } from "../../lib/db";
import { LINKS } from "../../config";

export default function Settings() {
  const { user, logout, removeAccount } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleDelete() {
    setErr("");
    setBusy(true);
    try {
      await deleteAllUserData(user.uid);
      await removeAccount();
      navigate("/", { replace: true });
    } catch (e) {
      // Firebase requires a recent login before deleting an account.
      if (String(e?.code).includes("requires-recent-login")) {
        setErr("For your security, please log out and back in, then delete your account.");
      } else {
        setErr("Couldn't delete the account. Please try again.");
      }
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Account</span>
          <h1>Settings</h1>
          <p>Manage your profile and account.</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: "1.6rem" }}>
        <h3>Profile</h3>
        <div className="row-sub" style={{ fontSize: ".95rem", lineHeight: 2 }}>
          <div><strong style={{ color: "var(--paper)" }}>Name:</strong> {user?.displayName || "—"}</div>
          <div><strong style={{ color: "var(--paper)" }}>Email:</strong> {user?.email}</div>
        </div>
        <button className="btn btn--ghost btn--sm" style={{ marginTop: "1rem" }} onClick={() => logout().then(() => navigate("/"))}>
          Log out
        </button>
      </div>

      <div className="panel" style={{ borderColor: "rgba(255,107,138,.35)" }}>
        <h3 style={{ color: "var(--danger)" }}>Delete account</h3>
        <p style={{ color: "var(--muted)", fontSize: ".92rem", margin: ".4rem 0 1rem", maxWidth: "56ch" }}>
          This permanently removes your tasks, schedules, blocklists, devices, and paired browsers,
          then deletes your login. This can't be undone. Type <strong style={{ color: "var(--paper)" }}>DELETE</strong> to confirm.
        </p>
        {err && <p className="error-text" style={{ marginBottom: ".8rem" }}>{err}</p>}
        <div className="inline-form">
          <div className="field" style={{ marginBottom: 0, maxWidth: 220 }}>
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="DELETE" />
          </div>
          <button className="btn btn--danger" disabled={confirm !== "DELETE" || busy} onClick={handleDelete}>
            {busy ? "Deleting…" : "Delete my account"}
          </button>
        </div>
        <p style={{ color: "var(--muted-2)", fontSize: ".8rem", marginTop: "1rem" }}>
          Need help first? Email {LINKS.supportEmail}.
        </p>
      </div>
    </>
  );
}
