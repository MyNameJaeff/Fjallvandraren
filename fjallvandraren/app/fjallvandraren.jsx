"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";

const DIFFICULTY = {
  Lätt: { color: "#5c8f4a", bg: "rgba(92,143,74,0.14)" },
  Medel: { color: "#c4942b", bg: "rgba(196,148,43,0.14)" },
  Svår: { color: "#c45a2b", bg: "rgba(196,90,43,0.14)" },
  Expert: { color: "#b02222", bg: "rgba(176,34,34,0.18)" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  .fj{background:#0b1409;color:#d8d3c8;font-family:'DM Sans',sans-serif;font-weight:300;}
  .hero{position:relative;height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}
  .hero-bg{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80&fit=crop&crop=center');background-size:cover;background-position:center 35%;filter:brightness(0.5) saturate(0.75);}
  .hero-vignette{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(11,20,9,0.15) 0%,rgba(11,20,9,0.45) 65%,rgba(11,20,9,0.92) 100%);}
  .hero-content{position:relative;z-index:1;text-align:center;padding:0 24px;}
  .logo{font-family:'Cormorant Garamond',serif;font-size:54px;font-weight:300;letter-spacing:0.28em;color:#ede8e0;text-transform:uppercase;margin-bottom:6px;line-height:1;}
  .logo-sub{font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(237,232,224,0.5);margin-bottom:30px;font-weight:400;}
  .search-wrap{position:relative;width:320px;}
  .search-inp{width:100%;background:rgba(255,255,255,0.09);border:0.5px solid rgba(255,255,255,0.18);border-radius:22px;padding:10px 16px 10px 38px;color:#ede8e0;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;outline:none;transition:background .2s,border-color .2s;}
  .search-inp::placeholder{color:rgba(237,232,224,0.38);}
  .search-inp:focus{background:rgba(255,255,255,0.13);border-color:rgba(255,255,255,0.32);}
  .search-ico{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:rgba(237,232,224,0.4);font-size:14px;}
  .layout{display:grid;grid-template-columns:272px 1fr;min-height:560px;border-top:0.5px solid rgba(255,255,255,0.055);}
  .sidebar{background:#0d1b0b;border-right:0.5px solid rgba(255,255,255,0.055);display:flex;flex-direction:column;max-height:560px;}
  .sb-head{padding:14px 18px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(210,205,195,0.35);border-bottom:0.5px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
  .sb-add-btn{background:rgba(138,171,110,0.12);border:0.5px solid rgba(138,171,110,0.3);color:#8aab6e;font-size:12px;padding:4px 10px;border-radius:12px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s;}
  .sb-add-btn:hover{background:rgba(138,171,110,0.22);}
  .sb-list{overflow-y:auto;flex:1;}
  .tc{padding:13px 18px;cursor:pointer;border-bottom:0.5px solid rgba(255,255,255,0.035);transition:background .15s;display:flex;align-items:center;gap:11px;border-left:2px solid transparent;}
  .tc:hover{background:rgba(255,255,255,0.025);}
  .tc.sel{background:rgba(138,171,110,0.07);border-left-color:#8aab6e;}
  .tc-thumb{width:44px;height:44px;border-radius:5px;object-fit:cover;flex-shrink:0;opacity:0.8;}
  .tc-thumb-ph{width:44px;height:44px;border-radius:5px;background:rgba(138,171,110,0.1);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px;color:rgba(138,171,110,0.4);}
  .tc-info{flex:1;min-width:0;}
  .tc-name{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:400;color:#e4e0d8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;}
  .tc-reg{font-size:10px;color:rgba(200,195,185,0.4);margin-top:1px;letter-spacing:0.04em;}
  .badge{font-size:9px;font-family:'DM Sans',sans-serif;font-weight:500;padding:2px 7px;border-radius:9px;flex-shrink:0;letter-spacing:0.03em;}
  .detail{overflow-y:auto;max-height:560px;}
  .det-empty{min-height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;}
  .det-empty-ico{font-size:36px;color:rgba(200,195,185,0.1);margin-bottom:6px;}
  .det-empty-t{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:300;color:rgba(200,195,185,0.22);}
  .det-empty-s{font-size:12px;color:rgba(200,195,185,0.15);}
  .det-img{width:100%;height:210px;object-fit:cover;display:block;}
  .det-body{padding:26px 30px 32px;}
  .det-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
  .det-region{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8aab6e;font-weight:400;}
  .det-season{font-size:10px;color:rgba(200,195,185,0.3);margin-left:auto;letter-spacing:0.04em;}
  .det-name{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;color:#ede8e0;line-height:1.05;margin-bottom:3px;}
  .det-tagline{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:rgba(200,195,185,0.42);margin-bottom:22px;}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,0.045);border-radius:7px;overflow:hidden;margin-bottom:22px;}
  .stat{background:#0d1b0b;padding:13px 10px;text-align:center;}
  .stat-v{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;color:#e0dbd3;display:block;margin-bottom:2px;}
  .stat-l{font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(200,195,185,0.32);}
  .det-desc{font-size:14px;line-height:1.78;color:rgba(210,205,195,0.68);margin-bottom:22px;}
  .hl-title{font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(200,195,185,0.28);margin-bottom:10px;}
  .hls{display:flex;flex-wrap:wrap;gap:7px;}
  .hl{background:rgba(138,171,110,0.09);border:0.5px solid rgba(138,171,110,0.22);color:#9fc285;font-size:12px;padding:5px 12px;border-radius:18px;}
  .admin-panel{background:#0e1a0c;border-top:0.5px solid rgba(255,255,255,0.055);padding:22px 18px;}
  .ap-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:#ede8e0;margin-bottom:4px;}
  .ap-sub{font-size:11px;color:rgba(200,195,185,0.4);margin-bottom:18px;line-height:1.5;}
  .ap-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .ap-field{display:flex;flex-direction:column;gap:4px;}
  .ap-field.full{grid-column:1/-1;}
  .ap-label{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(200,195,185,0.35);}
  .ap-inp{background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);border-radius:5px;padding:8px 10px;color:#d8d3c8;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;outline:none;transition:border-color .15s;width:100%;}
  .ap-inp:focus{border-color:rgba(138,171,110,0.45);}
  .ap-inp::placeholder{color:rgba(200,195,185,0.2);}
  .ap-select{background:#0e1a0c;border:0.5px solid rgba(255,255,255,0.1);border-radius:5px;padding:8px 10px;color:#d8d3c8;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;outline:none;width:100%;}
  .ap-textarea{resize:vertical;min-height:72px;}
  .ap-img-zone{border:1px dashed rgba(138,171,110,0.25);border-radius:6px;padding:14px;text-align:center;cursor:pointer;transition:border-color .15s;position:relative;}
  .ap-img-zone:hover{border-color:rgba(138,171,110,0.45);}
  .ap-img-prev{width:100%;height:80px;object-fit:cover;border-radius:4px;margin-bottom:6px;}
  .ap-img-text{font-size:11px;color:rgba(200,195,185,0.3);display:flex;align-items:center;justify-content:center;gap:6px;}
  .ap-img-inp{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
  .ap-actions{display:flex;gap:8px;margin-top:14px;align-items:center;}
  .ap-submit{background:rgba(138,171,110,0.18);border:0.5px solid rgba(138,171,110,0.4);color:#9fc285;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;padding:9px 20px;border-radius:5px;cursor:pointer;transition:background .15s;}
  .ap-submit:hover{background:rgba(138,171,110,0.28);}
  .ap-cancel{background:transparent;border:0.5px solid rgba(255,255,255,0.1);color:rgba(200,195,185,0.45);font-family:'DM Sans',sans-serif;font-size:13px;padding:9px 16px;border-radius:5px;cursor:pointer;}
  .ap-note{font-size:11px;color:rgba(200,195,185,0.25);margin-left:auto;font-style:italic;}
  .ap-success{font-size:13px;color:#8aab6e;display:flex;align-items:center;gap:6px;padding:10px 0;}
  .no-trips{padding:32px 18px;text-align:center;font-family:'Cormorant Garamond',serif;font-size:16px;color:rgba(200,195,185,0.25);}
`;

export default function Fjallvandraren() {
  const [trips, setTrips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/trips")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const nextTrips = Array.isArray(data) ? data : [];
        setTrips(nextTrips);

        if (nextTrips.length) {
          setSelected((current) => current ?? nextTrips[0].id);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setTrips([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search) return trips;
    const q = search.toLowerCase();
    return trips.filter((t) =>
      [t?.name, t?.region, t?.tagline, t?.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [search, trips]);

  const trip = trips.find((t) => t.id === selected);
  const diff = trip ? DIFFICULTY[trip.difficulty] || DIFFICULTY["Medel"] : null;

  return (
    <div className="fj">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-vignette" />
        <div className="hero-content">
          <div className="logo">Fjällvandraren</div>
          <div className="logo-sub">Vandringsleder i svenska fjällen</div>
          <div className="search-wrap">
            <i className="ti ti-search search-ico" aria-hidden="true" />
            <input
              className="search-inp"
              placeholder="Sök led, region eller nyckelord…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sb-head">
            <span>
              {filtered.length} {filtered.length === 1 ? "led" : "leder"}
            </span>
            <a className="sb-add-btn" href="/studio">
              Öppna Studio
            </a>
          </div>
          <div className="sb-list">
            {filtered.length === 0 && (
              <div className="no-trips">Inga leder hittades</div>
            )}
            {filtered.map((t) => {
              const d = DIFFICULTY[t.difficulty] || DIFFICULTY["Medel"];
              return (
                <div
                  key={t.id}
                  className={`tc${selected === t.id ? " sel" : ""}`}
                  onClick={() => setSelected(t.id)}
                >
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="tc-thumb" />
                  ) : (
                    <div className="tc-thumb-ph">
                      <i className="ti ti-mountain" aria-hidden="true" />
                    </div>
                  )}
                  <div className="tc-info">
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-reg">{t.region}</div>
                  </div>
                  <span
                    className="badge"
                    style={{ color: d.color, background: d.bg }}
                  >
                    {t.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Detail pane */}
        <main className="detail">
          {!trip ? (
            <div className="det-empty">
              <i className="ti ti-mountain det-empty-ico" aria-hidden="true" />
              <div className="det-empty-t">Välj en led</div>
              <div className="det-empty-s">Klicka på en led till vänster</div>
            </div>
          ) : (
            <>
              {trip.image ? (
                <img src={trip.image} alt={trip.name} className="det-img" />
              ) : (
                <div
                  style={{
                    height: 210,
                    background: "rgba(138,171,110,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="ti ti-mountain"
                    style={{ fontSize: 48, color: "rgba(138,171,110,0.2)" }}
                  />
                </div>
              )}
              <div className="det-body">
                <div className="det-row">
                  <span className="det-region">{trip.region}</span>
                  <span
                    className="badge"
                    style={{ color: diff.color, background: diff.bg }}
                  >
                    {trip.difficulty}
                  </span>
                  <span className="det-season">{trip.season}</span>
                </div>
                <div className="det-name">{trip.name}</div>
                {trip.tagline && (
                  <div className="det-tagline">{trip.tagline}</div>
                )}
                <div className="stats">
                  {[
                    { v: `${trip.days} dagar`, l: "Längd" },
                    { v: trip.distance, l: "Distans" },
                    { v: trip.elevation, l: "Högsta punkt" },
                    {
                      v: trip.season?.split("–")[0]?.trim() || "–",
                      l: "Säsong",
                    },
                  ].map((s) => (
                    <div className="stat" key={s.l}>
                      <span className="stat-v">{s.v}</span>
                      <span className="stat-l">{s.l}</span>
                    </div>
                  ))}
                </div>
                {trip.description && (
                  <p className="det-desc">{trip.description}</p>
                )}
                {trip.highlights?.length > 0 && (
                  <>
                    <div className="hl-title">Höjdpunkter</div>
                    <div className="hls">
                      {trip.highlights.map((h) => (
                        <span className="hl" key={h}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
