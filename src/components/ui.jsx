import { Link } from "react-router-dom";

export function LockGlyph({ size = 22, closed = true }) {
  return (
    <svg
      className={`lock-glyph ${closed ? "" : "is-open"}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.4" className="body" />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        className="shackle"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15" r="1.5" className="hole" />
    </svg>
  );
}

export function Brand({ foot = false }) {
  return (
    <Link
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".55rem",
        fontFamily: "'Bricolage Grotesque',sans-serif",
        fontWeight: 800,
        fontSize: foot ? "1rem" : "1.15rem",
        letterSpacing: "-.02em",
        color: "var(--paper)",
      }}
    >
      <LockGlyph size={foot ? 18 : 22} />
      <span>StudyLock</span>
    </Link>
  );
}

export function Spinner({ label = "Loading" }) {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "50vh",
        color: "var(--muted)",
        gap: ".8rem",
      }}
    >
      <div className="sl-spinner" />
      <span className="mono" style={{ fontSize: ".8rem" }}>
        {label}…
      </span>
      <style>{`.sl-spinner{width:34px;height:34px;border-radius:50%;
        border:3px solid var(--ink-3);border-top-color:var(--lock);
        animation:slspin .8s linear infinite;}
        @keyframes slspin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div
      className="card"
      style={{
        padding: "2.5rem 1.5rem",
        textAlign: "center",
        color: "var(--muted)",
      }}
    >
      <div style={{ color: "var(--lock)", display: "grid", placeItems: "center", marginBottom: ".8rem" }}>
        <LockGlyph size={30} />
      </div>
      <h3 style={{ color: "var(--paper)", fontSize: "1.15rem", marginBottom: ".4rem" }}>{title}</h3>
      <p style={{ fontSize: ".92rem", maxWidth: "40ch", margin: "0 auto 1.2rem" }}>{body}</p>
      {action}
    </div>
  );
}

export function ConfigNotice() {
  return (
    <div className="notice" style={{ margin: "1rem 0" }}>
      Firebase isn't configured yet. Copy <code>.env.example</code> to{" "}
      <code>.env</code>, add your Firebase web config, and restart the dev
      server to enable accounts and live data.
    </div>
  );
}

export function Icon({ name, size = 20 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "home":
      return (<svg {...p}><path d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" /></svg>);
    case "list":
      return (<svg {...p}><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 5.5l1.2 1.2L7 4.5M4 11.5l1.2 1.2L7 10.5M4 17.5l1.2 1.2L7 16.5" /></svg>);
    case "calendar":
      return (<svg {...p}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v3M16 3v3" /></svg>);
    case "shield":
      return (<svg {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /></svg>);
    case "devices":
      return (<svg {...p}><rect x="2.5" y="5" width="12" height="9" rx="1.5" /><rect x="16" y="8" width="5.5" height="11" rx="1.5" /><path d="M6 17h5" /></svg>);
    case "browser":
      return (<svg {...p}><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M3 9h18M7 6.7h.01M9.5 6.7h.01" /></svg>);
    case "gear":
      return (<svg {...p}><circle cx="12" cy="12" r="3.2" /><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" /></svg>);
    case "card":
      return (<svg {...p}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3 10h18" /></svg>);
    case "download":
      return (<svg {...p}><path d="M12 3v11m0 0l-4-4m4 4l4-4M5 19h14" /></svg>);
    case "plus":
      return (<svg {...p}><path d="M12 5v14M5 12h14" /></svg>);
    case "trash":
      return (<svg {...p}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>);
    case "logout":
      return (<svg {...p}><path d="M9 21H5V3h4M15 12H9M15 12l-3-3M15 12l-3 3M17 5l4 4-4 4" /></svg>);
    case "check":
      return (<svg {...p}><path d="M5 12.5l4.5 4.5L19 7" strokeWidth="2.4" /></svg>);
    case "windows":
      return (<svg {...p}><path d="M4 6.2l7-1v7.8H4zM11 5l9-1.3v9.3H11zM4 13.5h7v6.3l-7-1zM11 13.5h9v6.8l-9-1.3z" /></svg>);
    default:
      return null;
  }
}
