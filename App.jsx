import roboKnightsLogo from "./roboknightslogo-no-outline.png";
import polymakerPhoto from "./polymaker-partnership.jpeg";
import masonPortrait from "./mason.png";
import jjPortrait from "./JJ-cutout.png";
import samPortrait from "./Samson-cutout.png";
import benPortrait from "./Ben-cutout.png";
import dhanushPortrait from "./Dhanush-cutout.png";
import { useEffect, useState } from "react";
import SponsorForm from "./SponsorForm";
import RobotViewer from "./RobotViewer";
import ScrollContent from "./ScrollContent";

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const ArrowDown = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function Home() {
  const [showEntrance, setShowEntrance] = useState(() => {
    try { return sessionStorage.getItem("roboknights-entered") !== "true"; }
    catch { return true; }
  });
  const [entranceReady, setEntranceReady] = useState(false);
  const [leavingEntrance, setLeavingEntrance] = useState(false);

  useEffect(() => {
    if (!showEntrance) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [showEntrance]);

  useEffect(() => {
    if (!leavingEntrance) return;
    const timer = window.setTimeout(() => {
      setShowEntrance(false);
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1850);
    return () => window.clearTimeout(timer);
  }, [leavingEntrance]);

  useEffect(() => {
    if (!showEntrance && leavingEntrance) {
      document.querySelector("model-viewer")?.focus({ preventScroll: true });
    }
  }, [showEntrance, leavingEntrance]);

  function enterSite() {
    if (!entranceReady || leavingEntrance) return;
    try { sessionStorage.setItem("roboknights-entered", "true"); } catch { /* Continue if storage is unavailable. */ }
    setLeavingEntrance(true);
  }

  return (
    <>
      {showEntrance && (
        <div className={`entrance${leavingEntrance ? " entrance-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Welcome to the RoboKnights">
          <div className="entrance-pattern" aria-hidden="true" />
          <div className="entrance-diamond" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="50,1 99,50 50,99 1,50" />
            </svg>
          </div>
          <button className="entrance-button" type="button" disabled={!entranceReady || leavingEntrance} onClick={enterSite} aria-label="Enter the RoboKnights website">
            <img className="entrance-logo" src={roboKnightsLogo} alt="RoboKnights 112" width="1254" height="1254" onAnimationEnd={() => setEntranceReady(true)} />
            <span className={`entrance-cue${entranceReady ? " entrance-cue-visible" : ""}`}>Click to Enter</span>
          </button>
        </div>
      )}
    <main className={`site-content${showEntrance ? " site-content-hidden" : ""}`} inert={showEntrance ? true : undefined}>
      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />


        <RobotViewer />
      </section>

      <ScrollContent>
        <nav className="nav shell" id="navigation" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="The RoboKnights home">
            <span className="brand-mark">R</span>
            <span>
              <strong>The RoboKnights</strong>
              <small>FTC #112 (previously #15290)</small>
            </span>
          </a>
          <div className="nav-links">
            <a href="#progress">Progress</a>
            <a href="#engineering">Engineering</a>
            <a href="#team">Team</a>
            <a href="#sponsors">Sponsors</a>
          </div>
          <a className="nav-cta" href="#partner">
            Partner with us <ArrowUpRight />
          </a>
        </nav>

      <section className="progress section" id="progress">
        <div className="shell">
          <div className="section-heading progress-heading">
            <div>
              <h2>Progress &#x21CC; Power</h2>
            </div>
          </div>

          <div className="trajectory-paper">
          <div className="trajectory-card">
            <div className="trajectory-copy">
              <span className="data-label">2024–25 → 2025–26</span>
              <div className="trajectory-stat">
                <h3>+50.59</h3>
                <p>percentile points in Total NP</p>
              </div>
              <div className="trajectory-stat">
                <h3>+53.6 <span className="stat-divider">|</span> +76.8%</h3>
                <p>average NP from Meet #1 to Atlanta League Tournament</p>
              </div>
            </div>

            <div className="trajectory-chart" aria-label="Total NP percentile rose from 32.53 in 2024–25 to 83.12 in 2025–26">
              <div className="chart-grid" aria-hidden="true" />
              <div className="bar-chart">
                <div className="bar-row">
                  <div className="bar-meta"><span>2024–25</span><strong>32.53</strong></div>
                  <div className="bar-track"><span style={{ width: "32.53%" }} /></div>
                  <small>8–12–0 regular season</small>
                </div>
                <div className="bar-row current-row">
                  <div className="bar-meta"><span>2025–26</span><strong>83.12</strong></div>
                  <div className="bar-track"><span style={{ width: "83.12%" }} /></div>
                  <small>8–7–0 regular season</small>
                </div>
              </div>
              <p className="chart-source">Total NP percentile | Data from FTCScout.org</p>
            </div>
          </div>

          </div>

          <div className="metric-grid metric-grid-four">
            <article className="metric-card">
              <p>Total NP percentile</p>
              <strong>83.12<span className="ordinal">th</span></strong>
              <span className="metric-arrow">↗</span>
            </article>
            <article className="metric-card">
              <p>Georgia overall</p>
              <strong>19<span className="ordinal">th</span> / 128</strong>
              <span className="metric-arrow">↗</span>
            </article>
            <article className="metric-card">
              <p>Atlanta-Marist League</p>
              <strong>10<span className="ordinal">th</span> / 33</strong>
              <span className="metric-arrow">↗</span>
            </article>
            <article className="metric-card">
              <p>League autonomous rank</p>
              <strong>7<span className="ordinal">th</span> / 33</strong>
              <span className="metric-arrow">↗</span>
            </article>
          </div>

          <hr className="stats-section-divider" />

          <div className="event-story">
            <div className="event-story-heading">
              <div>
                <h3>Four Comps.<br></br>One Goal.</h3>
              </div>
            </div>

            <div className="event-timeline" aria-label="RoboKnights 2025–26 event results in chronological order">
              <article className="event-card">
                <div className="event-topline"><small>MEET #1</small></div>
                <h4>Atlanta-Marist League</h4>
                <div className="event-np"><strong>69.8</strong><span>AVG NP</span></div>
                <div className="event-np-bar" aria-hidden="true"><span style={{ width: "56.6%" }} /></div>
                <dl><div><dt>Event rank</dt><dd>8th</dd></div><div><dt>Record</dt><dd>4–1–0</dd></div></dl>
              </article>

              <article className="event-card">
                <div className="event-topline"><small>MEET #2</small></div>
                <h4>Atlanta-Marist League</h4>
                <div className="event-np"><strong>71.4</strong><span>AVG NP</span></div>
                <div className="event-np-bar" aria-hidden="true"><span style={{ width: "57.9%" }} /></div>
                <dl><div><dt>Event rank</dt><dd>9th</dd></div><div><dt>Record</dt><dd>3–2–0</dd></div></dl>
              </article>

              <article className="event-card">
                <div className="event-topline"><small>MEET #3</small></div>
                <h4>Atlanta-Marist League</h4>
                <div className="event-np"><strong>74.0</strong><span>AVG NP</span></div>
                <div className="event-np-bar" aria-hidden="true"><span style={{ width: "60%" }} /></div>
                <dl><div><dt>Event rank</dt><dd>23rd</dd></div><div><dt>Record</dt><dd>1–4–0</dd></div></dl>
              </article>

              <article className="event-card event-card-final">
                <div className="event-topline"><small>LEAGUE TOURNAMENT</small></div>
                <h4>Atlanta League Tournament</h4>
                <div className="event-np"><strong>123.4</strong><span>AVG NP</span></div>
                <div className="event-np-bar" aria-hidden="true"><span style={{ width: "100%" }} /></div>
                <dl><div><dt>Event rank</dt><dd>5th</dd></div><div><dt>Record</dt><dd>4–1–0</dd></div></dl>
              </article>
            </div>
          </div>

          <div className="trajectory-paper league-paper">
          <div className="league-scorecard">
            <div className="league-scorecard-copy">
              <p className="data-label">ATLANTA-MARIST LEAGUE AVERAGES</p>
              <h3>Built to score before TeleOp begins.</h3>
              <h4>Ready to score after Autonomous ends.</h4>
            </div>
            <dl className="league-stats">
              <div><dt>Rank score</dt><dd>3.60</dd></div>
              <div><dt>Match points</dt><dd>73.6</dd></div>
              <div><dt>Base points</dt><dd>11.0</dd></div>
              <div className="league-stat-featured"><dt>Auto points</dt><dd>23.60</dd><span>7th of 33</span></div>
            </dl>
          </div>
          </div>
        </div>
      </section>

      <section className="engineering section" id="engineering">
        <div className="shell">
          <hr className="stats-section-divider" />

        </div>
      </section>

      <section className="team section" id="team">
        <div className="shell team-layout">
          <div className="team-image">
            <img src="/team-2025-26.jpeg" alt="Members of the RoboKnights together at a 2025–26 competition" />
            <span>2025–26 | THE ROBOKNIGHTS</span>
          </div>
          <div className="team-copy">
            <p className="kicker">The team</p>
            <h2>Students who build the next version.</h2>
            <div className="roster-grid captain-grid">
              <article className="captain-card">
                <img className="captain-portrait" src={benPortrait} alt="Ben Gies" loading="lazy" />
                <span>01</span>
                <div className="captain-details" style={{ textAlign: "center" }}>
                  <h3>Ben Gies</h3>
                  <p>Team Co-Captain · Head of CAD and Mechanics</p>
                </div>
              </article>
              <article className="captain-card">
                <img className="captain-portrait" src={masonPortrait} alt="Mason Pinkerton" loading="lazy" />
                <span>02</span>
                <div className="captain-details" style={{ textAlign: "center" }}>
                  <h3>Mason Pinkerton</h3>
                  <p>Team Co-Captain · Head of Code Team · Autonomous Code Lead</p>
                </div>
              </article>
            </div>
          </div>
        </div>
        <div className="shell roster">
          <div className="roster-grid">
            <article className="portrait-card">
              <img className="captain-portrait" src={dhanushPortrait} alt="Dhanush Paladugu" loading="lazy" />
              <span>03</span>
              <div className="portrait-details">
                <h3>Ben Rodbell</h3>
                <p>Senior Team Mentor · Logistics Coordinator</p>
              </div>
            </article>
            <article className="portrait-card">
              <img className="captain-portrait" src={dhanushPortrait} alt="Dhanush Paladugu" loading="lazy" />
              <span>04</span>
              <div className="portrait-details">
                <h3>Dhanush Paladugu</h3>
                <p>Protégé · Team Outreach Coordinator</p>
              </div>
            </article>
            <article className="portrait-card">
              <img className="captain-portrait" src={jjPortrait} alt="JJ Brown" loading="lazy" />
              <span>05</span>
              <div className="portrait-details">
                <h3>JJ Brown</h3>
                <p>TeleOp Code Lead</p>
              </div>
            </article>
            <article className="portrait-card">
              <img className="captain-portrait" src={samPortrait} alt="Sam Schoeffler" loading="lazy" />
              <span>06</span>
              <div className="portrait-details">
                <h3>Maddie Finn</h3>
                <p>Electrical Department</p>
              </div>
            </article>
            <article className="portrait-card">
              <img className="captain-portrait" src={jjPortrait} alt="JJ Brown" loading="lazy" />
              <span>07</span>
              <div className="portrait-details">
                <h3>Ryan Sceusi</h3>
                <p>Protégé</p>
              </div>
            </article>
            <article className="portrait-card">
              <img className="captain-portrait" src={samPortrait} alt="Sam Schoeffler" loading="lazy" />
              <span>08</span>
              <div className="portrait-details">
                <h3>Sam Schoeffler</h3>
                <p>Head of Forward-Thinking Design · Outreach</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="sponsors section" id="sponsors">
        <div className="shell sponsors-layout">
          <div className="sponsor-photo">
            <img src={polymakerPhoto} alt="A RoboKnights member holding 3D-printing materials supplied by Polymaker" />
          </div>
          <div className="sponsor-copy">
            <p className="sponsor-status">Proudly supported by</p>
            <h2>Polymaker</h2>
            <p>
              Polymaker is currently the RoboKnights&apos; only sponsor. We sincerely thank them supporting our
              ability to prototype, iterate, and turn designs into competition-ready parts.
            </p>
            <a className="text-link" href="https://polymaker.com/" target="_blank" rel="noreferrer">
              Visit Polymaker <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      <section className="partner" id="partner">
        <div className="partner-grid" aria-hidden="true" />
        <div className="shell partner-layout">
          <div className="partner-content">
            <h2>Back the next breakthrough.</h2>
            <p>
              We are actively welcoming new sponsors and partners. Your support gives
              us the tools and support to keep turning
              ambitious ideas into competitive performances.
            </p>
          </div>
          <SponsorForm />
        </div>
      </section>

      <footer>
        <div className="shell footer-content">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark">R</span>
            <span><strong>The RoboKnights</strong><small>FTC #112 (previously #15290)</small></span>
          </a>
          <div className="footer-links">
            <a href="mailto:paceroboknights15290@gmail.com">Email</a>
            <a href="https://www.instagram.com/roboknights112/" target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <a href="#navigation" className="back-top">Back to top ↑</a>
        </div>
      </footer>
      </ScrollContent>
    </main>
    </>
  );
}
