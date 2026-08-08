import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  createPairingCode,
  watchPairingCode,
  watchBrowsers,
  removeBrowser,
} from "../../lib/db";
import { LINKS } from "../../config";
import { Icon, Spinner, EmptyState } from "../../components/ui";

export default function Browsers() {
  const { user } = useAuth();
  const [browsers, setBrowsers] = useState(null);
  const [code, setCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [claimed, setClaimed] = useState(false);
  const unsubCode = useRef(null);

  useEffect(() => {
    if (!user) return;
    return watchBrowsers(user.uid, setBrowsers);
  }, [user]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  async function generate() {
    setClaimed(false);
    const { code: c, expiresAt: exp } = await createPairingCode(user.uid);
    setCode(c);
    setExpiresAt(exp);
    if (unsubCode.current) unsubCode.current();
    unsubCode.current = watchPairingCode(c, (data) => {
      if (data?.claimed) {
        setClaimed(true);
        setCode(null);
      }
    });
  }

  useEffect(() => () => unsubCode.current && unsubCode.current(), []);

  const secondsLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
  const active = code && secondsLeft > 0;

  if (browsers === null) return <Spinner label="Loading paired browsers" />;

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Pairing</span>
          <h1>Browsers</h1>
          <p>Pair the extension so StudyLock can lock tabs, domains, and embedded content.</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: "1.6rem" }}>
        <h3>Pair a new browser</h3>
        <ol style={{ color: "var(--muted)", fontSize: ".92rem", paddingLeft: "1.2rem", margin: "0 0 1.2rem", lineHeight: 1.8 }}>
          <li>Install the StudyLock extension (<Link to="/extension" style={{ color: "var(--lock)" }}>get it here</Link>).</li>
          <li>Open the extension and choose “Pair with account.”</li>
          <li>Generate a code below and type it into the extension within 10 minutes.</li>
        </ol>

        {claimed && (
          <div className="notice" style={{ marginBottom: "1rem", color: "var(--done)", borderColor: "rgba(70,224,176,.4)", background: "rgba(70,224,176,.1)" }}>
            Browser paired. It'll appear in the list below.
          </div>
        )}

        {active ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
            <div className="mono" style={{ fontSize: "2.2rem", fontWeight: 700, letterSpacing: ".2em", color: "var(--lock)" }}>
              {code}
            </div>
            <div className="mono" style={{ fontSize: ".82rem", color: "var(--muted)" }}>
              expires in {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </div>
            <button className="btn btn--ghost btn--sm" onClick={generate}>New code</button>
          </div>
        ) : (
          <button className="btn btn--primary" onClick={generate}>Generate pairing code</button>
        )}
      </div>

      {browsers.length === 0 ? (
        <EmptyState
          title="No browsers paired yet"
          body="Once you pair the extension it shows up here, and its blocking follows your account everywhere."
        />
      ) : (
        <div className="list">
          {browsers.map((b) => (
            <div className="row-item" key={b.id}>
              <span style={{ color: "var(--lock)" }}><Icon name="browser" size={20} /></span>
              <div className="row-grow">
                <div className="row-title">{b.name || `${b.engine || "Browser"} extension`}</div>
                <div className="row-sub">{b.engine || "Chromium"} · paired</div>
              </div>
              <button className="icon-btn" onClick={() => removeBrowser(user.uid, b.id)} aria-label="Unpair browser">
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
