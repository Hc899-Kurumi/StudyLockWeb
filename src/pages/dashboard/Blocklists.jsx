import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  watchBlocklists,
  addBlocklist,
  updateBlocklist,
  deleteBlocklist,
} from "../../lib/db";
import { Icon, Spinner, EmptyState, LockGlyph } from "../../components/ui";

const KINDS = ["App", "Site", "URL"];

export default function Blocklists() {
  const { user } = useAuth();
  const [lists, setLists] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!user) return;
    return watchBlocklists(user.uid, setLists);
  }, [user]);

  async function createList(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await addBlocklist(user.uid, newName.trim());
    setNewName("");
  }

  if (lists === null) return <Spinner label="Loading your blocklists" />;

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Your rules</span>
          <h1>Blocklists</h1>
          <p>Choose exactly what closes during focus. Nothing is deleted — just locked.</p>
        </div>
      </div>

      <form className="panel inline-form" onSubmit={createList} style={{ marginBottom: "1.6rem" }}>
        <div className="field">
          <label>New blocklist</label>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Deep work" />
        </div>
        <button className="btn btn--primary"><Icon name="plus" size={16} /> Create</button>
      </form>

      {lists.length === 0 ? (
        <EmptyState
          title="No blocklists yet"
          body="Create a list, then add the apps, sites, and specific URLs you want closed while you study."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {lists.map((list) => (
            <BlocklistCard key={list.id} list={list} uid={user.uid} />
          ))}
        </div>
      )}
    </>
  );
}

function BlocklistCard({ list, uid }) {
  const [kind, setKind] = useState("App");
  const [value, setValue] = useState("");
  const items = list.items || [];

  function addItem(e) {
    e.preventDefault();
    if (!value.trim()) return;
    updateBlocklist(uid, list.id, {
      items: [...items, { kind, value: value.trim(), locked: true }],
    });
    setValue("");
  }
  function toggle(i) {
    const next = items.map((it, idx) => (idx === i ? { ...it, locked: !it.locked } : it));
    updateBlocklist(uid, list.id, { items: next });
  }
  function remove(i) {
    updateBlocklist(uid, list.id, { items: items.filter((_, idx) => idx !== i) });
  }

  const lockedCount = items.filter((i) => i.locked).length;

  return (
    <div className="panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ marginBottom: ".2rem" }}>{list.name}</h3>
          <span className="mono" style={{ fontSize: ".78rem", color: "var(--muted)" }}>
            {lockedCount} locked · {items.length - lockedCount} open
          </span>
        </div>
        <button className="icon-btn" onClick={() => deleteBlocklist(uid, list.id)} aria-label="Delete list">
          <Icon name="trash" size={16} />
        </button>
      </div>

      <div className="list" style={{ marginBottom: "1rem" }}>
        {items.length === 0 && (
          <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>Nothing here yet — add an app, site, or URL below.</p>
        )}
        {items.map((it, i) => (
          <div className="row-item" key={i}>
            <span className="tag">{it.kind}</span>
            <span className="row-grow mono" style={{ fontSize: ".92rem", color: it.locked ? "var(--muted)" : "var(--paper)" }}>
              {it.value}
            </span>
            <button className={`pill ${it.locked ? "on" : ""}`} onClick={() => toggle(i)}
              style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
              <LockGlyph size={13} closed={it.locked} /> {it.locked ? "Locked" : "Open"}
            </button>
            <button className="icon-btn" onClick={() => remove(i)} aria-label="Remove item">
              <Icon name="trash" size={15} />
            </button>
          </div>
        ))}
      </div>

      <form className="inline-form" onSubmit={addItem}>
        <div className="field" style={{ maxWidth: 120 }}>
          <label>Type</label>
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            {KINDS.map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Value</label>
          <input value={value} onChange={(e) => setValue(e.target.value)}
            placeholder={kind === "App" ? "Steam" : kind === "Site" ? "youtube.com" : "reddit.com/r/all"} />
        </div>
        <button className="btn btn--ghost"><Icon name="plus" size={16} /> Add</button>
      </form>
    </div>
  );
}
