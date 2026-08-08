import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { watchDevices, renameDevice, removeDevice } from "../../lib/db";
import { Icon, Spinner, EmptyState } from "../../components/ui";

export default function Devices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState(null);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!user) return;
    return watchDevices(user.uid, setDevices);
  }, [user]);

  async function saveName(id) {
    if (draft.trim()) await renameDevice(user.uid, id, draft.trim());
    setEditing(null);
  }

  if (devices === null) return <Spinner label="Loading your devices" />;

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Connected</span>
          <h1>Devices</h1>
          <p>Every device signed into your account, and when it last checked in.</p>
        </div>
      </div>

      {devices.length === 0 ? (
        <EmptyState
          title="No devices linked yet"
          body="Install the Windows app or pair a browser to see it here. Each one connects through your account."
          action={
            <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn--primary" to="/download">Get the Windows app</Link>
              <Link className="btn btn--ghost" to="/dashboard/browsers">Pair a browser</Link>
            </div>
          }
        />
      ) : (
        <div className="list">
          {devices.map((d) => (
            <div className="row-item" key={d.id}>
              <span style={{ color: "var(--lock)" }}>
                <Icon name={d.platform === "windows" ? "windows" : "devices"} size={20} />
              </span>
              <div className="row-grow">
                {editing === d.id ? (
                  <div className="inline-form">
                    <div className="field" style={{ marginBottom: 0 }}>
                      <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} />
                    </div>
                    <button className="btn btn--primary btn--sm" onClick={() => saveName(d.id)}>Save</button>
                    <button className="btn btn--ghost btn--sm" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="row-title">{d.name || "Unnamed device"}</div>
                    <div className="row-sub">
                      {d.platform || "device"}
                      {d.lastSeen && <> · last seen {formatWhen(d.lastSeen)}</>}
                    </div>
                  </>
                )}
              </div>
              {editing !== d.id && (
                <button className="btn btn--ghost btn--sm" onClick={() => { setEditing(d.id); setDraft(d.name || ""); }}>
                  Rename
                </button>
              )}
              <button className="icon-btn" onClick={() => removeDevice(user.uid, d.id)} aria-label="Remove device">
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function formatWhen(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
  } catch {
    return "recently";
  }
}
