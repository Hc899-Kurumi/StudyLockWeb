import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  watchTasks,
  watchSchedules,
  watchDevices,
  watchBlocklists,
} from "../../lib/db";
import { Spinner, Icon } from "../../components/ui";

export default function DashboardHome() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [devices, setDevices] = useState([]);
  const [blocklists, setBlocklists] = useState([]);

  useEffect(() => {
    if (!user) return;
    const u1 = watchTasks(user.uid, setTasks);
    const u2 = watchSchedules(user.uid, setSchedules);
    const u3 = watchDevices(user.uid, setDevices);
    const u4 = watchBlocklists(user.uid, setBlocklists);
    return () => { u1(); u2(); u3(); u4(); };
  }, [user]);

  if (tasks === null) return <Spinner label="Loading your dashboard" />;

  const homework = tasks.filter((t) => t.isHomework && !t.done);
  const doneToday = tasks.filter((t) => t.done);
  const name = (user?.displayName || "").split(" ")[0];

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>{name ? `Welcome back, ${name}` : "Welcome back"}</h1>
          <p>Here's where things stand. Put homework first — free time follows.</p>
        </div>
        <Link className="btn btn--primary" to="/dashboard/tasks">
          <Icon name="plus" size={16} /> Add a task
        </Link>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="stat-num earn">{homework.length}</div>
          <div className="stat-label">Homework to do</div>
        </div>
        <div className="stat">
          <div className="stat-num done">{doneToday.length}</div>
          <div className="stat-label">Tasks completed</div>
        </div>
        <div className="stat">
          <div className="stat-num">{schedules.filter((s) => s.enabled).length}</div>
          <div className="stat-label">Active schedules</div>
        </div>
        <div className="stat">
          <div className="stat-num">{devices.length}</div>
          <div className="stat-label">Devices</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }} className="dash-grid">
        <div className="panel">
          <h3>Next up</h3>
          {homework.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: ".92rem" }}>
              No homework queued. {tasks.length === 0 ? "Add your first task to get going." : "Nice work staying ahead."}
            </p>
          ) : (
            <div className="list">
              {homework.slice(0, 4).map((t) => (
                <div className="row-item" key={t.id}>
                  <span className="tag tag--hw">HW</span>
                  <div className="row-grow">
                    <div className="row-title">{t.title}</div>
                    {t.due && <div className="row-sub">due {t.due}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link className="btn btn--ghost btn--sm" to="/dashboard/tasks" style={{ marginTop: "1rem" }}>
            View all tasks
          </Link>
        </div>

        <div className="panel">
          <h3>Quick links</h3>
          <div className="list">
            <QuickLink to="/dashboard/schedules" icon="calendar" title="Study schedules" sub={`${schedules.length} set`} />
            <QuickLink to="/dashboard/blocklists" icon="shield" title="Blocklists" sub={`${blocklists.length} lists`} />
            <QuickLink to="/dashboard/browsers" icon="browser" title="Pair a browser" sub="extension" />
            <QuickLink to="/download" icon="download" title="Get the Windows app" sub="installer" />
          </div>
        </div>
      </div>

      <style>{`@media(max-width:680px){.dash-grid{grid-template-columns:1fr !important;}}`}</style>
    </>
  );
}

function QuickLink({ to, icon, title, sub }) {
  return (
    <Link className="row-item" to={to} style={{ color: "var(--paper)" }}>
      <span style={{ color: "var(--lock)" }}><Icon name={icon} size={18} /></span>
      <div className="row-grow">
        <div className="row-title">{title}</div>
        <div className="row-sub">{sub}</div>
      </div>
      <span style={{ color: "var(--muted-2)" }}>→</span>
    </Link>
  );
}
