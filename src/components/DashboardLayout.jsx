import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Brand, Icon } from "./ui";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: "home", end: true },
  { to: "/dashboard/tasks", label: "Tasks", icon: "list" },
  { to: "/dashboard/schedules", label: "Schedules", icon: "calendar" },
  { to: "/dashboard/blocklists", label: "Blocklists", icon: "shield" },
  { to: "/dashboard/devices", label: "Devices", icon: "devices" },
  { to: "/dashboard/browsers", label: "Browsers", icon: "browser" },
  { to: "/dashboard/settings", label: "Settings", icon: "gear" },
  { to: "/dashboard/billing", label: "Billing", icon: "card" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const initials = (user?.displayName || user?.email || "?")
    .split(/[@ ]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dash">
      <aside className={`dash-side ${open ? "is-open" : ""}`}>
        <div className="dash-side-top">
          <Brand foot />
          <button className="dash-close" onClick={() => setOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className="dash-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `dash-link ${isActive ? "is-active" : ""}`}
            >
              <Icon name={n.icon} size={18} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="dash-user" onClick={handleLogout}>
          <span className="dash-avatar">{initials}</span>
          <span className="dash-user-meta">
            <span className="dash-user-name">{user?.displayName || "Account"}</span>
            <span className="dash-user-sub">Sign out</span>
          </span>
          <Icon name="logout" size={16} />
        </button>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-burger" onClick={() => setOpen(true)} aria-label="Open menu">
            ☰
          </button>
          <Brand foot />
        </header>
        <div className="dash-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        .dash{display:grid;grid-template-columns:248px 1fr;min-height:100vh;}
        .dash-side{background:var(--ink-1);border-right:1px solid var(--line);
          padding:1.4rem 1rem;display:flex;flex-direction:column;gap:1.2rem;
          position:sticky;top:0;height:100vh;}
        .dash-side-top{display:flex;align-items:center;justify-content:space-between;padding:0 .4rem;}
        .dash-close{display:none;background:none;border:none;color:var(--muted);font-size:1.1rem;cursor:pointer;}
        .dash-nav{display:flex;flex-direction:column;gap:.2rem;flex:1;}
        .dash-link{display:flex;align-items:center;gap:.7rem;padding:.6rem .7rem;border-radius:10px;
          color:var(--muted);font-size:.93rem;font-weight:500;transition:.15s;}
        .dash-link:hover{background:var(--ink-2);color:var(--paper);}
        .dash-link.is-active{background:rgba(142,123,243,.14);color:var(--lock);}
        .dash-user{display:flex;align-items:center;gap:.65rem;background:var(--ink-2);
          border:1px solid var(--line);border-radius:12px;padding:.6rem .7rem;cursor:pointer;
          color:var(--paper);text-align:left;transition:.15s;}
        .dash-user:hover{border-color:var(--line-2);}
        .dash-avatar{width:34px;height:34px;border-radius:9px;background:var(--lock);color:#160f2e;
          display:grid;place-items:center;font-weight:700;font-size:.82rem;flex:none;
          font-family:'Space Mono',monospace;}
        .dash-user-meta{display:flex;flex-direction:column;flex:1;line-height:1.2;min-width:0;}
        .dash-user-name{font-size:.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .dash-user-sub{font-size:.72rem;color:var(--muted-2);}
        .dash-main{min-width:0;}
        .dash-topbar{display:none;align-items:center;gap:1rem;padding:.9rem 1.2rem;
          border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--ink);z-index:20;}
        .dash-burger,.dash-close{cursor:pointer;}
        .dash-burger{display:none;background:none;border:none;color:var(--paper);font-size:1.3rem;}
        .dash-content{padding:clamp(1.3rem,3vw,2.4rem);max-width:960px;}
        @media(max-width:840px){
          .dash{grid-template-columns:1fr;}
          .dash-side{position:fixed;left:0;top:0;z-index:60;width:270px;
            transform:translateX(-100%);transition:transform .25s ease;}
          .dash-side.is-open{transform:translateX(0);box-shadow:0 0 60px rgba(0,0,0,.6);}
          .dash-close{display:block;}
          .dash-topbar{display:flex;}
          .dash-burger{display:block;}
        }
      `}</style>
    </div>
  );
}
