import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ *
 * StudyLock — landing (public homepage)
 * Signature: a live focus session. Start it, distractions lock,
 * finish the homework checklist, and your free time is earned back.
 * Site nav + footer are supplied by PublicLayout, so they're omitted here.
 * ------------------------------------------------------------------ */

function Landing() {
  return (
    <div className="sl-root">
      <StyleSheet />
      <Hero />
      <ProblemBand />
      <Features />
      <EarnLoop />
      <Blocklist />
      <Devices />
      <FinalCTA />
    </div>
  );
}

/* ----------------------------- HERO ------------------------------ */
function Hero() {
  return (
    <section className="sl-hero" id="top">
      <div className="sl-hero-copy">
        <span className="sl-eyebrow">Study planner + distraction blocker</span>
        <h1 className="sl-h1">
          Finish your work.
          <br />
          <span className="sl-h1-earn">Earn your free time.</span>
        </h1>
        <p className="sl-lede">
          StudyLock closes your games, feeds, and distracting sites while you
          study — then hands them back the moment your homework is done. Nothing
          gets deleted. You just have to earn it.
        </p>
        <div className="sl-hero-actions">
          <Link className="sl-btn sl-btn--primary" to="/download">
            Get StudyLock
          </Link>
          <Link className="sl-btn sl-btn--ghost" to="/signup">
            Create free account
          </Link>
        </div>
        <p className="sl-hero-note">
          Try the focus session on the right — check off the homework and watch
          your distractions unlock.
        </p>
      </div>
      <FocusSession />
    </section>
  );
}

/* ----------------- SIGNATURE: FOCUS SESSION ---------------------- */
const PRESETS = [15, 25, 50];
const DISTRACTIONS = [
  { name: "Games", eg: "Steam, Epic", icon: "games" },
  { name: "Video", eg: "YouTube, Twitch", icon: "video" },
  { name: "Social", eg: "TikTok, Insta", icon: "social" },
  { name: "Messaging", eg: "Discord", icon: "chat" },
];
const HOMEWORK_SEED = [
  { id: 1, text: "Calc problem set §4.2", done: false },
  { id: 2, text: "Read history ch. 7", done: false },
  { id: 3, text: "Lab report draft", done: false },
];

function FocusSession() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [tasks, setTasks] = useState(HOMEWORK_SEED);
  const prevEarned = useRef(false);

  const allDone = tasks.every((t) => t.done);
  const timeUp = secondsLeft <= 0;
  const earned = active && (allDone || timeUp);
  const locked = active && !earned;

  // countdown
  useEffect(() => {
    if (!active || allDone || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [active, allDone, secondsLeft]);

  const [burst, setBurst] = useState(false);
  useEffect(() => {
    if (earned && !prevEarned.current) {
      setBurst(true);
      const t = setTimeout(() => setBurst(false), 1200);
      prevEarned.current = true;
      return () => clearTimeout(t);
    }
    if (!earned) prevEarned.current = false;
  }, [earned]);

  function start() {
    setSecondsLeft(minutes * 60);
    setTasks(HOMEWORK_SEED.map((t) => ({ ...t, done: false })));
    setActive(true);
  }
  function reset() {
    setActive(false);
    setSecondsLeft(minutes * 60);
    setTasks(HOMEWORK_SEED.map((t) => ({ ...t, done: false })));
  }
  function pick(m) {
    setMinutes(m);
    if (!active) setSecondsLeft(m * 60);
  }
  function toggle(id) {
    if (!active) return;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const total = minutes * 60;
  const progress = active ? 1 - secondsLeft / total : 0;
  const doneCount = tasks.filter((t) => t.done).length;

  const state = earned ? "earned" : active ? "locked" : "idle";

  return (
    <div className={`sl-fs sl-fs--${state}`} aria-label="Focus session demo">
      {burst && <Burst />}
      <div className="sl-fs-head">
        <div className="sl-fs-status">
          <span className="sl-fs-dot" />
          {state === "idle" && "Ready to lock in"}
          {state === "locked" && "Focus mode — distractions closed"}
          {state === "earned" && "Free time earned"}
        </div>
        <LockGlyph size={20} closed={locked} />
      </div>

      <Ring progress={earned ? 1 : progress} state={state} label={fmt(secondsLeft)} />

      {!active ? (
        <div className="sl-fs-presets" role="group" aria-label="Session length">
          {PRESETS.map((m) => (
            <button
              key={m}
              className={`sl-chip ${m === minutes ? "sl-chip--on" : ""}`}
              onClick={() => pick(m)}
            >
              {m} min
            </button>
          ))}
        </div>
      ) : (
        <div className="sl-fs-progresslabel">
          {doneCount}/{tasks.length} homework done
        </div>
      )}

      <ul className="sl-fs-tasks">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              className={`sl-task ${t.done ? "sl-task--done" : ""}`}
              onClick={() => toggle(t.id)}
              disabled={!active}
              aria-pressed={t.done}
            >
              <span className="sl-task-box">{t.done && <Check size={13} />}</span>
              <span className="sl-task-text">{t.text}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sl-fs-distractions" aria-hidden={!active}>
        {DISTRACTIONS.map((d) => (
          <div
            key={d.name}
            className={`sl-dcard ${locked ? "sl-dcard--locked" : ""} ${
              earned ? "sl-dcard--free" : ""
            }`}
          >
            <Icon name={d.icon} size={18} />
            <div className="sl-dcard-meta">
              <span className="sl-dcard-name">{d.name}</span>
              <span className="sl-dcard-eg">{d.eg}</span>
            </div>
            <span className="sl-dcard-tag">
              {locked ? <LockGlyph size={13} closed /> : earned ? "open" : "—"}
            </span>
          </div>
        ))}
      </div>

      <div className="sl-fs-controls">
        {!active ? (
          <button className="sl-btn sl-btn--primary sl-btn--full" onClick={start}>
            Lock in
          </button>
        ) : (
          <button className="sl-btn sl-btn--ghost sl-btn--full" onClick={reset}>
            End session
          </button>
        )}
      </div>
    </div>
  );
}

function Ring({ progress, state, label }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const off = C * (1 - Math.min(1, Math.max(0, progress)));
  const stroke =
    state === "earned" ? "var(--earn)" : state === "locked" ? "var(--lock)" : "var(--muted)";
  return (
    <div className="sl-ring">
      <svg viewBox="0 0 128 128" width="150" height="150">
        <circle cx="64" cy="64" r={R} className="sl-ring-track" />
        <circle
          cx="64"
          cy="64"
          r={R}
          className="sl-ring-arc"
          style={{
            stroke,
            strokeDasharray: C,
            strokeDashoffset: off,
          }}
        />
      </svg>
      <div className="sl-ring-center">
        <span className="sl-ring-time" style={{ color: stroke }}>
          {state === "earned" ? "0:00" : label}
        </span>
        <span className="sl-ring-sub">
          {state === "earned" ? "unlocked" : state === "locked" ? "focus" : "session"}
        </span>
      </div>
    </div>
  );
}

function Burst() {
  const bits = Array.from({ length: 14 });
  const colors = ["var(--earn)", "var(--lock)", "var(--done)", "var(--paper)"];
  return (
    <div className="sl-burst" aria-hidden="true">
      {bits.map((_, i) => (
        <span
          key={i}
          style={{
            "--a": `${(360 / bits.length) * i}deg`,
            "--d": `${40 + (i % 4) * 14}px`,
            background: colors[i % colors.length],
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------- PROBLEM BAND ------------------------- */
function ProblemBand() {
  return (
    <section className="sl-problem">
      <p className="sl-problem-text">
        Most productivity apps only tell you what you <em>should</em> be doing.
        Then you open a new tab. <strong>StudyLock closes the tab.</strong>
      </p>
    </section>
  );
}

/* --------------------------- FEATURES ---------------------------- */
const FEATURES = [
  {
    icon: "calendar",
    title: "Weekly planner",
    body: "Lay out assignments across the week and see everything due at a glance.",
  },
  {
    icon: "list",
    title: "Homework tracker",
    body: "Mark the tasks that matter. A proof-of-work note confirms what you actually finished.",
  },
  {
    icon: "timer",
    title: "Focus timer",
    body: "Run a session on demand or let it start automatically at your scheduled study times.",
  },
  {
    icon: "grid",
    title: "App & program blocker",
    body: "Close selected games and desktop apps during focus. Files stay put — nothing is deleted.",
  },
  {
    icon: "globe",
    title: "Website blocker",
    body: "Block whole domains or a single stubborn URL. You choose exactly what gets locked.",
  },
  {
    icon: "puzzle",
    title: "Browser extension",
    body: "Locks inactive tabs and embedded content so distractions can't sneak back in.",
  },
  {
    icon: "phone",
    title: "Phone dashboard",
    body: "Check your focus status and upcoming sessions from your phone or the web.",
  },
  {
    icon: "sync",
    title: "One synced account",
    body: "Tasks, schedules, devices, and blocklists stay in step across everything you use.",
  },
];

function Features() {
  return (
    <section className="sl-section" id="features">
      <div className="sl-section-head">
        <span className="sl-eyebrow">Everything in one place</span>
        <h2 className="sl-h2">
          Planning and enforcement, finally living together
        </h2>
        <p className="sl-section-sub">
          No separate apps for scheduling, tracking, and blocking. StudyLock
          handles the whole loop — from writing down the assignment to making
          sure you don't wander off before it's done.
        </p>
      </div>
      <div className="sl-feature-grid">
        {FEATURES.map((f) => (
          <article className="sl-feature" key={f.title}>
            <span className="sl-feature-ico">
              <Icon name={f.icon} size={20} />
            </span>
            <h3 className="sl-feature-title">{f.title}</h3>
            <p className="sl-feature-body">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- EARN LOOP --------------------------- */
const STEPS = [
  {
    k: "Plan",
    t: "Write it down",
    b: "Add your assignments for the week and flag the ones that count as homework.",
  },
  {
    k: "Lock in",
    t: "Start focus mode",
    b: "Kick off a session — or let one start on schedule. Your chosen distractions close.",
  },
  {
    k: "Finish",
    t: "Do the work",
    b: "Check off tasks and leave a quick proof-of-work note on what you completed.",
  },
  {
    k: "Unlock",
    t: "Earn free time",
    b: "The moment the work is done or the session ends, your apps and sites come back.",
  },
];

function EarnLoop() {
  return (
    <section className="sl-section sl-section--alt" id="how">
      <div className="sl-section-head">
        <span className="sl-eyebrow">The earn loop</span>
        <h2 className="sl-h2">Four steps, on repeat</h2>
        <p className="sl-section-sub">
          The order carries the whole idea: you don't get free time by starting,
          you get it by finishing.
        </p>
      </div>
      <ol className="sl-steps">
        {STEPS.map((s, i) => (
          <li className="sl-step" key={s.k}>
            <span className="sl-step-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="sl-step-key">{s.k}</span>
            <h3 className="sl-step-title">{s.t}</h3>
            <p className="sl-step-body">{s.b}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* --------------------------- BLOCKLIST --------------------------- */
const BLOCK_SEED = [
  { name: "Steam", kind: "App", locked: true },
  { name: "youtube.com", kind: "Site", locked: true },
  { name: "Discord", kind: "App", locked: false },
  { name: "reddit.com/r/all", kind: "URL", locked: true },
  { name: "tiktok.com", kind: "Site", locked: true },
  { name: "Spotify", kind: "App", locked: false },
];

function Blocklist() {
  const [items, setItems] = useState(BLOCK_SEED);
  const lockedCount = items.filter((i) => i.locked).length;
  return (
    <section className="sl-section" id="blocklist">
      <div className="sl-section-head">
        <span className="sl-eyebrow">You decide what's locked</span>
        <h2 className="sl-h2">Your blocklist, your rules</h2>
        <p className="sl-section-sub">
          Add apps, whole sites, or one specific URL. Toggle anything on or off —
          StudyLock never touches what you leave open.
        </p>
      </div>
      <div className="sl-blocklist">
        <div className="sl-blocklist-bar">
          <span>
            {lockedCount} locked · {items.length - lockedCount} open
          </span>
          <span className="sl-blocklist-hint">Tap a row to toggle</span>
        </div>
        <ul className="sl-blockrows">
          {items.map((it, idx) => (
            <li key={it.name}>
              <button
                className={`sl-blockrow ${it.locked ? "sl-blockrow--locked" : ""}`}
                onClick={() =>
                  setItems((arr) =>
                    arr.map((x, i) => (i === idx ? { ...x, locked: !x.locked } : x))
                  )
                }
                aria-pressed={it.locked}
              >
                <span className="sl-blockrow-kind">{it.kind}</span>
                <span className="sl-blockrow-name">{it.name}</span>
                <span className="sl-blockrow-state">
                  <LockGlyph size={14} closed={it.locked} />
                  {it.locked ? "Locked" : "Open"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------- DEVICES ---------------------------- */
const DEVICES = [
  { icon: "windows", t: "Windows app", b: "Closes games and desktop programs during focus." },
  { icon: "puzzle", t: "Browser extension", b: "Locks tabs, domains, and embedded content." },
  { icon: "phone", t: "Phone dashboard", b: "See focus status and schedules on the go." },
  { icon: "globe", t: "Web dashboard", b: "Manage everything from any browser." },
];

function Devices() {
  return (
    <section className="sl-section sl-section--alt" id="devices">
      <div className="sl-section-head">
        <span className="sl-eyebrow">Works where you drift</span>
        <h2 className="sl-h2">One account, every screen</h2>
        <p className="sl-section-sub">
          Distractions aren't limited to one tab or one game, so StudyLock
          isn't either. Everything connects through a single account.
        </p>
      </div>
      <div className="sl-devices">
        {DEVICES.map((d) => (
          <article className="sl-device" key={d.t}>
            <span className="sl-device-ico">
              <Icon name={d.icon} size={22} />
            </span>
            <h3 className="sl-device-title">{d.t}</h3>
            <p className="sl-device-body">{d.b}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- FINAL CTA --------------------------- */
function FinalCTA() {
  return (
    <section className="sl-cta" id="get">
      <div className="sl-cta-inner">
        <LockGlyph size={34} closed />
        <h2 className="sl-cta-title">Plan it. Lock in. Get it done.</h2>
        <p className="sl-cta-sub">
          Put your homework first and let the distractions wait. StudyLock keeps
          the deal so you don't have to argue with yourself.
        </p>
        <div className="sl-cta-actions">
          <Link className="sl-btn sl-btn--primary sl-btn--lg" to="/signup">
            Get StudyLock
          </Link>
          <Link className="sl-btn sl-btn--ghost sl-btn--lg" to="/pricing">
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- ICONS ------------------------------ */
function LockGlyph({ size = 22, closed = false }) {
  return (
    <svg
      className={`sl-lock ${closed ? "sl-lock--closed" : "sl-lock--open"}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.4" className="sl-lock-body" />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        className="sl-lock-shackle"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15" r="1.5" className="sl-lock-hole" />
    </svg>
  );
}

function Check({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Icon({ name, size = 20 }) {
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
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v3M16 3v3" />
        </svg>
      );
    case "list":
      return (
        <svg {...p}>
          <path d="M9 6h11M9 12h11M9 18h11" />
          <path d="M4 5.5l1.2 1.2L7 4.5M4 11.5l1.2 1.2L7 10.5M4 17.5l1.2 1.2L7 16.5" />
        </svg>
      );
    case "timer":
      return (
        <svg {...p}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 13V9M9 3h6" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
        </svg>
      );
    case "globe":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" />
        </svg>
      );
    case "puzzle":
      return (
        <svg {...p}>
          <path d="M10 4.5a1.6 1.6 0 0 1 3.2 0c0 .9-.6 1.2-.6 1.8 0 .5.4.9.9.9h1.9c.6 0 1.1.5 1.1 1.1v2c0 .5.4.8.9.8.6 0 .9-.6 1.8-.6a1.6 1.6 0 0 1 0 3.2c-.9 0-1.2-.6-1.8-.6-.5 0-.9.4-.9.9v2.6c0 .6-.5 1.1-1.1 1.1h-2.4c-.5 0-.8-.4-.8-.9 0-.6.6-.9.6-1.8a1.6 1.6 0 0 0-3.2 0c0 .9.6 1.2.6 1.8 0 .5-.4.9-.9.9H6.6c-.6 0-1.1-.5-1.1-1.1v-2.4c0-.5-.4-.8-.9-.8-.6 0-.9.6-1.8.6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
          <path d="M11 18h2" />
        </svg>
      );
    case "sync":
      return (
        <svg {...p}>
          <path d="M4 12a8 8 0 0 1 13.5-5.8L20 8M20 12a8 8 0 0 1-13.5 5.8L4 16" />
          <path d="M20 4v4h-4M4 20v-4h4" />
        </svg>
      );
    case "windows":
      return (
        <svg {...p}>
          <path d="M4 6.2l7-1v7.8H4zM11 5l9-1.3v9.3H11zM4 13.5h7v6.3l-7-1zM11 13.5h9v6.8l-9-1.3z" />
        </svg>
      );
    case "games":
      return (
        <svg {...p}>
          <rect x="2.5" y="7.5" width="19" height="9" rx="4.5" />
          <path d="M7 11v2M6 12h2M15.5 11.5h.01M18 13.5h.01" />
        </svg>
      );
    case "video":
      return (
        <svg {...p}>
          <rect x="3" y="5.5" width="18" height="13" rx="2.6" />
          <path d="M10.5 9.5l4 2.5-4 2.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "social":
      return (
        <svg {...p}>
          <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />
          <circle cx="12" cy="12" r="3.4" />
          <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M4 5.5h16v10H8l-4 3.5z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------------------------- HELPERS ---------------------------- */
function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/* ---------------------------- STYLES ----------------------------- */
function StyleSheet() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');

.sl-root{
  --ink:#14121C; --ink-1:#1A1726; --ink-2:#221D33; --ink-3:#2C2645;
  --line:rgba(255,255,255,.09); --line-2:rgba(255,255,255,.16);
  --lock:#8E7BF3; --lock-deep:#6E58E6;
  --earn:#FFB74A; --done:#46E0B0;
  --paper:#F3F1FB; --muted:#9E98B8; --muted-2:#6E6890;
  --maxw:1120px;
  background:var(--ink); color:var(--paper);
  font-family:'Instrument Sans',system-ui,sans-serif;
  line-height:1.55; -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.sl-root *{box-sizing:border-box;margin:0;padding:0;}
.sl-root a{color:inherit;text-decoration:none;}
.sl-root h1,.sl-root h2,.sl-root h3{
  font-family:'Bricolage Grotesque',sans-serif;
  font-weight:800; line-height:1.02; letter-spacing:-.02em;
}
.sl-eyebrow{
  font-family:'Space Mono',monospace; font-size:.72rem; letter-spacing:.16em;
  text-transform:uppercase; color:var(--lock);
  display:inline-block; margin-bottom:1rem;
}

/* buttons */
.sl-btn{
  display:inline-flex; align-items:center; justify-content:center;
  font-family:'Instrument Sans',sans-serif; font-weight:600; font-size:.95rem;
  padding:.72rem 1.35rem; border-radius:11px; border:1px solid transparent;
  cursor:pointer; transition:transform .16s ease, background .2s ease, border-color .2s ease;
}
.sl-btn:active{transform:translateY(1px) scale(.99);}
.sl-btn--primary{background:var(--lock); color:#160f2e; box-shadow:0 8px 24px -12px var(--lock-deep);}
.sl-btn--primary:hover{background:#a394f6;}
.sl-btn--ghost{background:transparent; color:var(--paper); border-color:var(--line-2);}
.sl-btn--ghost:hover{border-color:var(--lock); color:var(--lock);}
.sl-btn--full{width:100%;}
.sl-btn--lg{padding:.9rem 1.8rem; font-size:1.02rem;}
.sl-root :focus-visible{outline:2px solid var(--earn); outline-offset:3px; border-radius:8px;}

/* nav */
.sl-nav{
  position:sticky; top:0; z-index:40;
  display:flex; align-items:center; gap:1.5rem;
  padding:1rem clamp(1rem,4vw,2.5rem);
  max-width:var(--maxw); margin:0 auto;
  backdrop-filter:blur(10px);
}
.sl-brand{
  display:flex; align-items:center; gap:.55rem;
  font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:1.15rem;
  letter-spacing:-.02em; margin-right:auto;
}
.sl-nav-links{display:flex; gap:1.6rem; font-size:.92rem; color:var(--muted);}
.sl-nav-links a:hover{color:var(--paper);}

/* hero */
.sl-hero{
  max-width:var(--maxw); margin:0 auto;
  padding:clamp(2rem,6vw,4.5rem) clamp(1rem,4vw,2.5rem) clamp(3rem,7vw,5rem);
  display:grid; grid-template-columns:1.05fr .95fr; gap:clamp(2rem,5vw,4rem);
  align-items:center;
}
.sl-h1{font-size:clamp(2.6rem,6vw,4.4rem);}
.sl-h1-earn{
  background:linear-gradient(100deg,var(--earn),#ffd08a);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.sl-lede{
  margin:1.4rem 0 1.9rem; font-size:1.12rem; color:var(--muted); max-width:34ch;
}
.sl-hero-actions{display:flex; gap:.8rem; flex-wrap:wrap;}
.sl-hero-note{
  margin-top:1.6rem; font-size:.85rem; color:var(--muted-2);
  border-left:2px solid var(--lock); padding-left:.8rem; max-width:38ch;
}

/* focus session */
.sl-fs{
  position:relative; background:var(--ink-2);
  border:1px solid var(--line); border-radius:22px;
  padding:1.5rem; display:flex; flex-direction:column; align-items:center; gap:1rem;
  box-shadow:0 30px 80px -40px #000;
  transition:border-color .3s ease, box-shadow .3s ease;
}
.sl-fs--locked{border-color:rgba(142,123,243,.45); box-shadow:0 30px 90px -40px var(--lock-deep);}
.sl-fs--earned{border-color:rgba(255,183,74,.5); box-shadow:0 30px 90px -40px #a9741f;}
.sl-fs-head{width:100%; display:flex; align-items:center; justify-content:space-between;}
.sl-fs-status{
  display:flex; align-items:center; gap:.5rem;
  font-family:'Space Mono',monospace; font-size:.74rem; letter-spacing:.03em;
  color:var(--muted);
}
.sl-fs--locked .sl-fs-status{color:var(--lock);}
.sl-fs--earned .sl-fs-status{color:var(--earn);}
.sl-fs-dot{width:7px;height:7px;border-radius:50%;background:currentColor;}
.sl-fs--locked .sl-fs-dot,.sl-fs--earned .sl-fs-dot{animation:slPulse 1.6s ease-in-out infinite;}
@keyframes slPulse{0%,100%{opacity:1;}50%{opacity:.35;}}

/* ring */
.sl-ring{position:relative; display:grid; place-items:center;}
.sl-ring svg{transform:rotate(-90deg);}
.sl-ring-track{fill:none; stroke:var(--ink-3); stroke-width:8;}
.sl-ring-arc{fill:none; stroke-width:8; stroke-linecap:round; transition:stroke-dashoffset 1s linear, stroke .3s ease;}
.sl-ring-center{position:absolute; text-align:center;}
.sl-ring-time{font-family:'Space Mono',monospace; font-size:1.7rem; font-weight:700; display:block;}
.sl-ring-sub{font-family:'Space Mono',monospace; font-size:.66rem; letter-spacing:.18em; text-transform:uppercase; color:var(--muted-2);}

.sl-fs-presets{display:flex; gap:.5rem;}
.sl-chip{
  font-family:'Space Mono',monospace; font-size:.78rem;
  padding:.4rem .8rem; border-radius:8px; cursor:pointer;
  background:var(--ink-3); color:var(--muted); border:1px solid transparent;
  transition:.18s;
}
.sl-chip--on{color:var(--lock); border-color:var(--lock); background:rgba(142,123,243,.12);}
.sl-fs-progresslabel{font-family:'Space Mono',monospace; font-size:.78rem; color:var(--muted);}

.sl-fs-tasks{list-style:none; width:100%; display:flex; flex-direction:column; gap:.4rem;}
.sl-task{
  width:100%; display:flex; align-items:center; gap:.65rem; text-align:left;
  background:var(--ink-1); border:1px solid var(--line); border-radius:10px;
  padding:.6rem .7rem; cursor:pointer; color:var(--paper); font-size:.9rem;
  transition:.18s;
}
.sl-task:disabled{opacity:.5; cursor:not-allowed;}
.sl-task:not(:disabled):hover{border-color:var(--line-2);}
.sl-task-box{
  width:19px;height:19px;border-radius:6px;flex:none;
  border:1.8px solid var(--muted-2); display:grid; place-items:center;
  color:#160f2e; transition:.18s;
}
.sl-task--done .sl-task-box{background:var(--done); border-color:var(--done);}
.sl-task--done .sl-task-text{color:var(--muted-2); text-decoration:line-through;}

.sl-fs-distractions{width:100%; display:grid; grid-template-columns:1fr 1fr; gap:.5rem; transition:.3s;}
.sl-dcard{
  display:flex; align-items:center; gap:.55rem;
  background:var(--ink-1); border:1px solid var(--line); border-radius:10px;
  padding:.55rem .6rem; color:var(--muted); transition:.3s ease;
}
.sl-dcard-meta{display:flex; flex-direction:column; line-height:1.15; min-width:0;}
.sl-dcard-name{font-size:.82rem; color:var(--paper); font-weight:600;}
.sl-dcard-eg{font-size:.66rem; color:var(--muted-2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.sl-dcard-tag{
  margin-left:auto; display:flex; align-items:center;
  font-family:'Space Mono',monospace; font-size:.66rem; color:var(--muted-2);
}
.sl-dcard--locked{filter:blur(.6px) saturate(.5); opacity:.62; border-color:rgba(142,123,243,.3); color:var(--lock);}
.sl-dcard--locked .sl-dcard-name{color:var(--lock);}
.sl-dcard--free{border-color:rgba(70,224,176,.4);}
.sl-dcard--free .sl-dcard-tag{color:var(--done);}
.sl-fs-controls{width:100%;}

/* burst */
.sl-burst{position:absolute; top:96px; left:50%; width:0; height:0; z-index:5; pointer-events:none;}
.sl-burst span{
  position:absolute; width:8px; height:8px; border-radius:2px; top:0; left:0;
  transform:rotate(var(--a)) translateY(0); opacity:0;
  animation:slBurst .9s ease-out forwards;
}
@keyframes slBurst{
  0%{opacity:1; transform:rotate(var(--a)) translateY(0) scale(1);}
  100%{opacity:0; transform:rotate(var(--a)) translateY(calc(var(--d) * -1)) scale(.4);}
}

/* problem band */
.sl-problem{
  border-top:1px solid var(--line); border-bottom:1px solid var(--line);
  background:var(--ink-1);
}
.sl-problem-text{
  max-width:var(--maxw); margin:0 auto;
  padding:clamp(2.5rem,6vw,4rem) clamp(1rem,4vw,2.5rem);
  font-family:'Bricolage Grotesque',sans-serif; font-weight:600;
  font-size:clamp(1.4rem,3.4vw,2.3rem); line-height:1.2; letter-spacing:-.02em;
  max-width:24ch;
}
.sl-problem-text em{font-style:italic; color:var(--muted);}
.sl-problem-text strong{color:var(--earn); font-weight:800;}

/* sections */
.sl-section{max-width:var(--maxw); margin:0 auto; padding:clamp(3.5rem,8vw,6rem) clamp(1rem,4vw,2.5rem);}
.sl-section--alt{background:var(--ink-1); max-width:none;}
.sl-section--alt > *{max-width:var(--maxw); margin-left:auto; margin-right:auto;}
.sl-section-head{max-width:52ch; margin-bottom:2.6rem;}
.sl-h2{font-size:clamp(1.9rem,4.2vw,3rem);}
.sl-section-sub{margin-top:1rem; color:var(--muted); font-size:1.05rem;}

/* features */
.sl-feature-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:1rem;}
.sl-feature{
  background:var(--ink-2); border:1px solid var(--line); border-radius:16px;
  padding:1.4rem 1.25rem; transition:.2s ease;
}
.sl-feature:hover{border-color:var(--line-2); transform:translateY(-3px);}
.sl-feature-ico{
  display:inline-grid; place-items:center; width:42px; height:42px;
  border-radius:11px; background:rgba(142,123,243,.13); color:var(--lock);
  margin-bottom:1rem;
}
.sl-feature-title{font-size:1.08rem; margin-bottom:.45rem;}
.sl-feature-body{font-size:.9rem; color:var(--muted); line-height:1.5;}

/* steps */
.sl-steps{list-style:none; display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; counter-reset:none;}
.sl-step{
  position:relative; background:var(--ink-2); border:1px solid var(--line);
  border-radius:16px; padding:1.5rem 1.3rem;
}
.sl-step-num{
  font-family:'Space Mono',monospace; font-size:.8rem; color:var(--lock);
  letter-spacing:.1em;
}
.sl-step-key{
  display:block; font-family:'Space Mono',monospace; font-size:.7rem;
  text-transform:uppercase; letter-spacing:.14em; color:var(--muted-2); margin-top:.9rem;
}
.sl-step-title{font-size:1.25rem; margin:.35rem 0 .6rem;}
.sl-step-body{font-size:.9rem; color:var(--muted);}
.sl-step:last-child{border-color:rgba(255,183,74,.35);}
.sl-step:last-child .sl-step-num{color:var(--earn);}

/* blocklist */
.sl-blocklist{background:var(--ink-2); border:1px solid var(--line); border-radius:18px; overflow:hidden; max-width:640px;}
.sl-blocklist-bar{
  display:flex; align-items:center; justify-content:space-between;
  padding:.9rem 1.1rem; border-bottom:1px solid var(--line);
  font-family:'Space Mono',monospace; font-size:.78rem; color:var(--muted);
}
.sl-blocklist-hint{color:var(--muted-2);}
.sl-blockrows{list-style:none;}
.sl-blockrow{
  width:100%; display:grid; grid-template-columns:56px 1fr auto; align-items:center; gap:.9rem;
  padding:.85rem 1.1rem; background:transparent; border:none; border-bottom:1px solid var(--line);
  cursor:pointer; color:var(--paper); text-align:left; transition:.16s;
}
.sl-blockrows li:last-child .sl-blockrow{border-bottom:none;}
.sl-blockrow:hover{background:var(--ink-3);}
.sl-blockrow-kind{
  font-family:'Space Mono',monospace; font-size:.64rem; letter-spacing:.08em;
  text-transform:uppercase; color:var(--muted-2);
  border:1px solid var(--line); border-radius:6px; padding:.2rem .3rem; text-align:center;
}
.sl-blockrow-name{font-size:.94rem; font-family:'Space Mono',monospace;}
.sl-blockrow-state{
  display:flex; align-items:center; gap:.4rem;
  font-family:'Space Mono',monospace; font-size:.76rem; color:var(--done);
}
.sl-blockrow--locked .sl-blockrow-state{color:var(--lock);}
.sl-blockrow--locked .sl-blockrow-name{color:var(--muted);}

/* devices */
.sl-devices{display:grid; grid-template-columns:repeat(4,1fr); gap:1rem;}
.sl-device{
  background:var(--ink-2); border:1px solid var(--line); border-radius:16px; padding:1.5rem 1.3rem;
}
.sl-device-ico{
  display:inline-grid; place-items:center; width:46px; height:46px; border-radius:12px;
  background:rgba(255,183,74,.12); color:var(--earn); margin-bottom:1rem;
}
.sl-device-title{font-size:1.1rem; margin-bottom:.4rem;}
.sl-device-body{font-size:.88rem; color:var(--muted);}

/* cta */
.sl-cta{padding:clamp(3.5rem,8vw,6rem) clamp(1rem,4vw,2.5rem);}
.sl-cta-inner{
  max-width:640px; margin:0 auto; text-align:center;
  background:linear-gradient(160deg,var(--ink-2),var(--ink-1));
  border:1px solid var(--line-2); border-radius:24px;
  padding:clamp(2.5rem,5vw,3.5rem);
}
.sl-cta-inner .sl-lock{color:var(--lock); margin-bottom:1rem;}
.sl-cta-title{font-size:clamp(2rem,4.6vw,3rem); margin-bottom:.9rem;}
.sl-cta-sub{color:var(--muted); font-size:1.05rem; max-width:44ch; margin:0 auto 1.8rem;}
.sl-cta-actions{display:flex; gap:.8rem; justify-content:center; flex-wrap:wrap;}

/* footer */
.sl-footer{
  max-width:var(--maxw); margin:0 auto;
  padding:2rem clamp(1rem,4vw,2.5rem) 3rem;
  border-top:1px solid var(--line);
  display:flex; align-items:center; gap:1.2rem; flex-wrap:wrap;
}
.sl-brand--foot{font-size:1rem; margin-right:0;}
.sl-foot-tag{color:var(--muted); font-size:.9rem; margin-right:auto;}
.sl-foot-copy{font-family:'Space Mono',monospace; font-size:.76rem; color:var(--muted-2);}

/* lock glyph */
.sl-lock-body{fill:currentColor; opacity:.16; stroke:currentColor; stroke-width:1.6;}
.sl-lock-shackle{stroke:currentColor; transition:transform .35s cubic-bezier(.5,1.6,.5,1); transform-origin:12px 10px;}
.sl-lock--open .sl-lock-shackle{transform:translateY(-2px) rotate(-14deg);}
.sl-lock-hole{fill:currentColor;}

/* responsive */
@media(max-width:900px){
  .sl-hero{grid-template-columns:1fr;}
  .sl-feature-grid,.sl-steps,.sl-devices{grid-template-columns:1fr 1fr;}
  .sl-nav-links{display:none;}
}
@media(max-width:560px){
  .sl-feature-grid,.sl-steps,.sl-devices,.sl-fs-distractions{grid-template-columns:1fr;}
  .sl-nav-cta{display:none;}
  .sl-hero-actions{flex-direction:column;}
  .sl-hero-actions .sl-btn{width:100%;}
}
@media(prefers-reduced-motion:reduce){
  .sl-root *{animation:none !important; transition:none !important;}
}
`}</style>
  );
}

export default Landing;
