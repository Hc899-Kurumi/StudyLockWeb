import { Link } from "react-router-dom";
import { Brand } from "./ui";

export default function PublicFooter() {
  return (
    <footer className="pubfoot">
      <div className="pubfoot-inner">
        <div className="pubfoot-brand">
          <Brand foot />
          <p>Your homework first. Distractions later.</p>
        </div>
        <div className="pubfoot-cols">
          <div>
            <h4>Product</h4>
            <Link to="/download">Download</Link>
            <Link to="/extension">Browser extension</Link>
            <Link to="/pricing">Pricing</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/help">Help &amp; support</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="pubfoot-bar">
        <span className="mono">© {new Date().getFullYear()} StudyLock</span>
        <span className="mono">Finish your work. Earn your free time.</span>
      </div>
      <style>{`
        .pubfoot{border-top:1px solid var(--line);margin-top:2rem;}
        .pubfoot-inner{max-width:var(--maxw);margin:0 auto;
          padding:3rem clamp(1rem,4vw,2.5rem) 1.5rem;display:grid;
          grid-template-columns:1.2fr 2fr;gap:2rem;}
        .pubfoot-brand p{color:var(--muted);font-size:.9rem;margin-top:.8rem;max-width:26ch;}
        .pubfoot-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
        .pubfoot-cols h4{font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;
          color:var(--muted-2);margin-bottom:.9rem;font-family:'Space Mono',monospace;font-weight:700;}
        .pubfoot-cols a{display:block;color:var(--muted);font-size:.92rem;margin-bottom:.55rem;}
        .pubfoot-cols a:hover{color:var(--paper);}
        .pubfoot-bar{max-width:var(--maxw);margin:0 auto;
          padding:1.2rem clamp(1rem,4vw,2.5rem) 2.5rem;border-top:1px solid var(--line);
          display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;
          color:var(--muted-2);font-size:.76rem;}
        @media(max-width:720px){.pubfoot-inner{grid-template-columns:1fr;}}
        @media(max-width:480px){.pubfoot-cols{grid-template-columns:1fr 1fr;}}
      `}</style>
    </footer>
  );
}
