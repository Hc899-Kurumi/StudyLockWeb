import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  watchSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  watchBlocklists,
} from "../../lib/db";
import { Icon, Spinner, EmptyState } from "../../components/ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Schedules() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState(null);
  const [blocklists, setBlocklists] = useState([]);

  const [label, setLabel] = useState("");
  const [days, setDays] = useState(["Mon", "Wed"]);
  const [start, setStart] = useState("16:00");
  const [durationMin, setDurationMin] = useState(25);
  const [blocklistId, setBlocklistId] = useState("");

  useEffect(() => {
    if (!user) return;
    const a = watchSchedules(user.uid, setSchedules);
    const b = watchBlocklists(user.uid, setBlocklists);
    return () => { a(); b(); };
  }, [user]);

  function toggleDay(d) {
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  }

  async function submit(e) {
    e.preventDefault();
    if (!label.trim() || days.length === 0) return;
    await addSchedule(user.uid, { label: label.trim(), days, start, durationMin: Number(durationMin), blocklistId: blocklistId || null });
    setLabel("");
    setDays(["Mon", "Wed"]);
  }

  if (schedules === null) return <Spinner label="Loading your schedules" />;

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Automatic focus</span>
          <h1>Study schedules</h1>
          <p>Focus mode starts on its own at the times you choose — no remembering required.</p>
        </div>
      </div>

      <form className="panel" onSubmit={submit} style={{ marginBottom: "1.6rem" }}>
        <div className="inline-form">
          <div className="field">
            <label>Name</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="After-class focus" />
          </div>
          <div className="field" style={{ maxWidth: 130 }}>
            <label>Start</label>
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="field" style={{ maxWidth: 130 }}>
            <label>Length (min)</label>
            <input type="number" min="5" max="180" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} />
          </div>
          <div className="field" style={{ maxWidth: 180 }}>
            <label>Blocklist</label>
            <select value={blocklistId} onChange={(e) => setBlocklistId(e.target.value)}>
              <option value="">Default</option>
              {blocklists.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ margin: "1rem 0" }}>
          <label style={{ fontSize: ".85rem", color: "var(--muted)", display: "block", marginBottom: ".5rem" }}>Days</label>
          <div className="pill-toggle">
            {DAYS.map((d) => (
              <button type="button" key={d} className={`pill ${days.includes(d) ? "on" : ""}`} onClick={() => toggleDay(d)}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn--primary"><Icon name="plus" size={16} /> Add schedule</button>
      </form>

      {schedules.length === 0 ? (
        <EmptyState
          title="No schedules yet"
          body="Set a recurring focus session and StudyLock will lock in for you automatically at the right time."
        />
      ) : (
        <div className="list">
          {schedules.map((s) => (
            <div className="row-item" key={s.id}>
              <button
                className={`pill ${s.enabled ? "on" : ""}`}
                onClick={() => updateSchedule(user.uid, s.id, { enabled: !s.enabled })}
              >
                {s.enabled ? "On" : "Off"}
              </button>
              <div className="row-grow">
                <div className="row-title">{s.label}</div>
                <div className="row-sub">
                  {(s.days || []).join(" · ")} · {s.start} · {s.durationMin} min
                </div>
              </div>
              <button className="icon-btn" onClick={() => deleteSchedule(user.uid, s.id)} aria-label="Delete schedule">
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
