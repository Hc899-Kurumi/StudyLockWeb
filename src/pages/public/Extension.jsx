import { Link } from "react-router-dom";
import { LINKS } from "../../config";
import { Icon } from "../../components/ui";

export default function Extension() {
  const stores = [
    { name: "Chrome Web Store", sub: "Chrome, Brave, Arc", url: LINKS.chromeExtension },
    { name: "Edge Add-ons", sub: "Microsoft Edge", url: LINKS.edgeExtension },
  ];
  return (
    <section className="content">
      <div className="content-head">
        <span className="eyebrow">Browser extension</span>
        <h1>Lock the tabs too</h1>
        <p>
          The extension blocks distracting sites, whole domains, and single URLs during focus —
          and locks inactive tabs and embedded content so nothing sneaks back in.
        </p>
      </div>

      <div className="ext-grid">
        {stores.map((s) => {
          const ready = s.url && s.url !== "#";
          return (
            <a key={s.name} className="ext-card" href={s.url} target="_blank" rel="noreferrer" aria-disabled={!ready}>
              <span className="ext-ico"><Icon name="browser" size={26} /></span>
              <div>
                <h3>{s.name}</h3>
                <p>{s.sub}</p>
              </div>
              <span className="ext-go">{ready ? "Install →" : "Coming soon"}</span>
            </a>
          );
        })}
      </div>

      <div className="ext-pair">
        <h3>Then pair it with your account</h3>
        <p>
          Open the extension, choose “Pair with account,” and enter the code from your{" "}
          <Link to="/dashboard/browsers">Browsers</Link> page. After that, your blocklists follow you everywhere.
        </p>
      </div>

      <style>{`
        .content{max-width:var(--maxw);margin:0 auto;padding:clamp(2.5rem,6vw,4.5rem) clamp(1rem,4vw,2.5rem);}
        .content-head{max-width:56ch;margin-bottom:2.4rem;}
        .content-head h1{font-size:clamp(2rem,4.6vw,3rem);margin:1rem 0 .8rem;}
        .content-head p{color:var(--muted);font-size:1.05rem;}
        .ext-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;max-width:680px;}
        .ext-card{display:flex;align-items:center;gap:1rem;background:var(--ink-2);
          border:1px solid var(--line);border-radius:16px;padding:1.4rem;transition:.2s;color:var(--paper);}
        .ext-card:hover{border-color:var(--line-2);transform:translateY(-3px);}
        .ext-ico{display:grid;place-items:center;width:50px;height:50px;border-radius:12px;
          background:rgba(142,123,243,.14);color:var(--lock);flex:none;}
        .ext-card h3{font-size:1.1rem;}
        .ext-card p{color:var(--muted);font-size:.85rem;}
        .ext-go{margin-left:auto;color:var(--lock);font-weight:600;font-size:.9rem;white-space:nowrap;}
        .ext-pair{margin-top:2.6rem;max-width:600px;}
        .ext-pair h3{font-size:1.2rem;margin-bottom:.6rem;}
        .ext-pair p{color:var(--muted);}
        .ext-pair a{color:var(--lock);}
        @media(max-width:600px){.ext-grid{grid-template-columns:1fr;}}
      `}</style>
    </section>
  );
}
