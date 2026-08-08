import { Link } from "react-router-dom";
import { LINKS } from "../../config";
import { Icon } from "../../components/ui";

export default function Billing() {
  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Plan</span>
          <h1>Billing</h1>
          <p>Your current plan and payment details.</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: "1.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <span className="tag">Current plan</span>
            <h3 style={{ margin: ".6rem 0 .2rem", fontSize: "1.5rem" }}>Free</h3>
            <p style={{ color: "var(--muted)", fontSize: ".92rem" }}>
              Weekly planner, one blocklist, and on-demand focus sessions.
            </p>
          </div>
          <Link className="btn btn--primary" to="/pricing">Upgrade to Pro</Link>
        </div>
      </div>

      <div className="panel">
        <h3>Payment &amp; invoices</h3>
        <p style={{ color: "var(--muted)", fontSize: ".92rem", margin: ".4rem 0 1rem" }}>
          Manage your subscription, update your card, or download invoices in the billing portal.
        </p>
        {LINKS.stripePortal ? (
          <a className="btn btn--ghost" href={LINKS.stripePortal} target="_blank" rel="noreferrer">
            <Icon name="card" size={16} /> Open billing portal
          </a>
        ) : (
          <p className="mono" style={{ fontSize: ".8rem", color: "var(--muted-2)" }}>
            Billing portal not configured yet — set VITE_STRIPE_PORTAL_URL in your environment.
          </p>
        )}
      </div>
    </>
  );
}
