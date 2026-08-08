import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  watchTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../../lib/db";
import { Icon, Spinner, EmptyState } from "../../components/ui";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [due, setDue] = useState("");
  const [isHomework, setIsHomework] = useState(true);
  const [proofFor, setProofFor] = useState(null);
  const [proofText, setProofText] = useState("");

  useEffect(() => {
    if (!user) return;
    return watchTasks(user.uid, setTasks);
  }, [user]);

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask(user.uid, { title: title.trim(), course, due: due || null, isHomework });
    setTitle("");
    setCourse("");
    setDue("");
  }

  async function complete(t) {
    // Homework requires a proof-of-work note before it can be marked done.
    if (t.isHomework && !t.done) {
      setProofFor(t.id);
      setProofText("");
      return;
    }
    await updateTask(user.uid, t.id, { done: !t.done });
  }

  async function confirmProof(t) {
    await updateTask(user.uid, t.id, { done: true, proof: proofText.trim() });
    setProofFor(null);
  }

  if (tasks === null) return <Spinner label="Loading your tasks" />;

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Planner</span>
          <h1>Tasks &amp; homework</h1>
          <p>Add what's due this week. Flag the important ones as homework.</p>
        </div>
      </div>

      <form className="panel inline-form" onSubmit={submit} style={{ marginBottom: "1.6rem" }}>
        <div className="field">
          <label>Task</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Calc problem set §4.2" />
        </div>
        <div className="field" style={{ maxWidth: 140 }}>
          <label>Course</label>
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="MAT 295" />
        </div>
        <div className="field" style={{ maxWidth: 160 }}>
          <label>Due</label>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <div className="field field--check" style={{ maxWidth: 150 }}>
          <input id="hw" type="checkbox" checked={isHomework} onChange={(e) => setIsHomework(e.target.checked)} />
          <label htmlFor="hw" style={{ margin: 0 }}>Homework</label>
        </div>
        <button className="btn btn--primary"><Icon name="plus" size={16} /> Add</button>
      </form>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          body="Add your first assignment above. Homework tasks ask for a quick proof-of-work note when you finish them."
        />
      ) : (
        <>
          <SectionLabel text={`To do · ${open.length}`} />
          <div className="list" style={{ marginBottom: "1.6rem" }}>
            {open.map((t) => (
              <TaskRow key={t.id} t={t} onToggle={() => complete(t)}
                onDelete={() => deleteTask(user.uid, t.id)}
                proofOpen={proofFor === t.id} proofText={proofText}
                setProofText={setProofText} onConfirm={() => confirmProof(t)}
                onCancel={() => setProofFor(null)} />
            ))}
            {open.length === 0 && <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>All caught up. Nice.</p>}
          </div>

          {done.length > 0 && (
            <>
              <SectionLabel text={`Done · ${done.length}`} />
              <div className="list">
                {done.map((t) => (
                  <TaskRow key={t.id} t={t} onToggle={() => complete(t)}
                    onDelete={() => deleteTask(user.uid, t.id)} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

function SectionLabel({ text }) {
  return (
    <p className="mono" style={{ fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted-2)", margin: "0 0 .8rem" }}>
      {text}
    </p>
  );
}

function TaskRow({ t, onToggle, onDelete, proofOpen, proofText, setProofText, onConfirm, onCancel }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="row-item">
        <button className={`check-btn ${t.done ? "on" : ""}`} onClick={onToggle} aria-label="Toggle done">
          {t.done && <Icon name="check" size={13} />}
        </button>
        <div className="row-grow">
          <div className="row-title" style={t.done ? { color: "var(--muted-2)", textDecoration: "line-through" } : null}>
            {t.title}
          </div>
          <div className="row-sub">
            {t.course && <span>{t.course}</span>}
            {t.course && t.due && <span> · </span>}
            {t.due && <span>due {t.due}</span>}
            {t.proof && <span> · proof: {t.proof}</span>}
          </div>
        </div>
        {t.isHomework && <span className="tag tag--hw">Homework</span>}
        <button className="icon-btn" onClick={onDelete} aria-label="Delete task">
          <Icon name="trash" size={16} />
        </button>
      </div>
      {proofOpen && (
        <div className="panel" style={{ marginTop: ".5rem" }}>
          <label style={{ fontSize: ".85rem", color: "var(--muted)", display: "block", marginBottom: ".5rem" }}>
            What did you finish? (proof-of-work)
          </label>
          <div className="inline-form">
            <div className="field" style={{ marginBottom: 0 }}>
              <input autoFocus value={proofText} onChange={(e) => setProofText(e.target.value)}
                placeholder="e.g. problems 1–12, checked answers" />
            </div>
            <button className="btn btn--primary" onClick={onConfirm} disabled={!proofText.trim()}>
              Mark done
            </button>
            <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
