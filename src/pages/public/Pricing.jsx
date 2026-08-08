import { Link } from "react-router-dom";
import { Icon } from "../../components/ui";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "Everything you need to start locking in.",
    features: [
      "Weekly planner and homework tracker",
      "On-demand focus sessions",
      "One blocklist",
      "Windows app + browser extension",
      "Phone and web dashboard",
    ],
    cta: "Create free account",
    to: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$4",
    cadence: "per month",
    tagline: "For students who want the whole system.",
    features: [
      "Everything in Free",
      "Unlimited blocklists and schedules",
      "Automatic scheduled focus sessions",
      "Proof-of-work history and streaks",
      "Sync across unlimited devices",
      "Priority support",
    ],
    cta: "Start Pro",
    to: "/signup",
    highlight: true,
  },
];

export default function Pricing() {
  return (
    <section className="content">
      <div className="content-head">
        <span className="eyebrow">Pricing</span>
        <h1>Start free. Upgrade when it clicks.</h1>
        <p>No ads, ever. Cancel anytime. Your files are never deleted — only locked during focus.</p>
      </div>

      <div className="tiers">
        {TIERS.map((t) => (
          <div key={t.name} className={`tier ${t.highlight ? "tier--hi" : ""}`}>
            {t.highlight && <span className="tier-flag">Most popular</span>}
            <h3>{t.name}</h3>
            <div className="tier-price">
              <span className="tier-amt">{t.price}</span>
              <span className="tier-cad">{t.cadence}</span>
            </div>
            <p className="tier-tag">{t.tagline}</p>
            <ul className="tier-feats">
              {t.features.map((f) => (
                <li key={f}><span className="tier-check"><Icon name="check" size={13} /></span>{f}</li>
              ))}
            </ul>
            <Link className={`btn ${t.highlight ? "btn--primary" : "btn--ghost"} btn--full`} to={t.to}>
              {t.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="content-note">
        Prices shown are placeholders — wire real checkout through your Stripe (or other) billing provider
        and point the Billing page at the portal URL.
      </p>

      <ContentStyle />
    </section>
  );
}

function ContentStyle() {
  return (
    <style>{`
      .content{max-width:var(--maxw);margin:0 auto;padding:clamp(2.5rem,6vw,4.5rem) clamp(1rem,4vw,2.5rem);}
      .content-head{max-width:56ch;margin-bottom:2.6rem;}
      .content-head h1{font-size:clamp(2rem,4.6vw,3rem);margin:1rem 0 .8rem;}
      .content-head p{color:var(--muted);font-size:1.05rem;}
      .tiers{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;max-width:760px;}
      .tier{background:var(--ink-2);border:1px solid var(--line);border-radius:18px;padding:1.8rem;position:relative;}
      .tier--hi{border-color:rgba(142,123,243,.5);box-shadow:0 30px 80px -50px var(--lock-deep);}
      .tier-flag{position:absolute;top:-11px;left:1.8rem;background:var(--lock);color:#160f2e;
        font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;
        padding:.25rem .6rem;border-radius:6px;font-weight:700;}
      .tier h3{font-size:1.3rem;margin-bottom:.8rem;}
      .tier-price{display:flex;align-items:baseline;gap:.5rem;margin-bottom:.8rem;}
      .tier-amt{font-family:'Bricolage Grotesque',sans-serif;font-size:2.6rem;font-weight:800;}
      .tier-cad{color:var(--muted);font-size:.9rem;}
      .tier-tag{color:var(--muted);font-size:.92rem;margin-bottom:1.3rem;}
      .tier-feats{list-style:none;margin-bottom:1.6rem;display:flex;flex-direction:column;gap:.6rem;}
      .tier-feats li{display:flex;gap:.6rem;font-size:.92rem;color:var(--paper);align-items:flex-start;}
      .tier-check{color:var(--done);flex:none;margin-top:2px;}
      .content-note{color:var(--muted-2);font-size:.85rem;margin-top:1.6rem;font-family:'Space Mono',monospace;max-width:60ch;}
      @media(max-width:640px){.tiers{grid-template-columns:1fr;}}
    `}</style>
  );
}
