import { Link } from "react-router-dom";
import { Brand } from "./ui";
import { useAuth } from "../context/AuthContext";

export default function PublicNav() {
  const { user } = useAuth();
  return (
    <header className="pubnav">
      <Brand />
      <nav className="pubnav-links" aria-label="Primary">
        <Link to="/#features">Features</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/download">Download</Link>
        <Link to="/extension">Extension</Link>
        <Link to="/help">Help</Link>
      </nav>
      {user ? (
        <Link className="btn btn--primary pubnav-cta" to="/dashboard">
          Open dashboard
        </Link>
      ) : (
        <div className="pubnav-auth">
          <Link className="btn btn--ghost btn--sm" to="/login">
            Log in
          </Link>
          <Link className="btn btn--primary btn--sm pubnav-cta" to="/signup">
            Sign up
          </Link>
        </div>
      )}
      <style>{`
        .pubnav{position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:1.5rem;
          padding:1rem clamp(1rem,4vw,2.5rem);max-width:var(--maxw);margin:0 auto;
          backdrop-filter:blur(10px);}
        .pubnav > a:first-child{margin-right:auto;}
        .pubnav-links{display:flex;gap:1.5rem;font-size:.92rem;color:var(--muted);}
        .pubnav-links a:hover{color:var(--paper);}
        .pubnav-auth{display:flex;gap:.6rem;align-items:center;}
        @media(max-width:820px){.pubnav-links{display:none;}}
        @media(max-width:480px){.pubnav-cta{display:none;}}
      `}</style>
    </header>
  );
}
