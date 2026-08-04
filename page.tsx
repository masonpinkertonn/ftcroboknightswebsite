import SponsorForm from "./SponsorForm";

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
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <nav className="nav shell" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="The RoboKnights home">
            <span className="brand-mark">R</span>
            <span>
              <strong>The RoboKnights</strong>
              <small>FTC #15290</small>
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

        <div className="hero-content shell">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Pace Academy · Atlanta, Georgia</p>
            <h1>
              The Robo<span>Knights.</span>
            </h1>
            <p className="team-number">#15290</p>
            <p className="hero-lede">
              We don&apos;t wait for breakthroughs. We engineer them—one match,
              one iteration, and one ambitious season at a time.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#progress">
                See our trajectory <ArrowDown />
              </a>
              <a className="text-link" href="#engineering">
                Inside the build <ArrowUpRight />
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Abstract technical illustration of our competition robot">
            <div className="coordinate coord-top">15290 / ROBOT SYSTEM</div>
            <div className="coordinate coord-side">PACE ROBOTICS</div>
            <div className="robot-orbit orbit-one" />
            <div className="robot-orbit orbit-two" />
            <div className="robot-frame">
              <span className="frame-bar bar-one" />
              <span className="frame-bar bar-two" />
              <span className="frame-bar bar-three" />
              <div className="robot-core">
                <span>RK</span>
                <small>15290</small>
              </div>
              <span className="wheel wheel-left" />
              <span className="wheel wheel-right" />
            </div>
            <div className="system-label label-auto"><span /> AUTONOMOUS</div>
            <div className="system-label label-drive"><span /> DRIVE SYSTEM</div>
            <div className="visual-stat">
              <small>Current direction</small>
              <strong>UP <span>↗</span></strong>
            </div>
          </div>
        </div>

        <div className="hero-footer shell">
          <span>FIRST Tech Challenge</span>
          <span className="scroll-cue">Scroll to explore <ArrowDown /></span>
        </div>
      </section>

      <section className="progress section" id="progress">
        <div className="shell">
          <div className="section-heading progress-heading">
            <div>
              <p className="kicker">01 / The trajectory</p>
              <h2>Progress you can measure.</h2>
            </div>
            <p>
              In one season, our Total NP rose from the 32.53rd percentile to
              the 83.12th. That jump reflects stronger execution, a better
              record, and a team learning faster at every event.
            </p>
          </div>

          <div className="trajectory-card">
            <div className="trajectory-copy">
              <span className="data-label">2024–25 → 2025–26</span>
              <h3>+50.59</h3>
              <p>
                percentile points in Total NP, backed by hundreds of deliberate
                decisions—from autonomous refinements to match strategy and
                driver practice.
              </p>
              <div className="data-note">
                <span>↗</span>
                <p><strong>Strongest when it mattered most.</strong> Average NP climbed from 69.8 at Meet #1 to 123.4 at the Atlanta League Tournament—a 76.8% increase.</p>
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
              <p className="chart-source">Total NP percentile · FTCScout season data</p>
            </div>
          </div>

          <div className="metric-grid metric-grid-four">
            <article className="metric-card">
              <span className="metric-index">01</span>
              <p className="metric-label-with-tip">
                Total NP percentile
                <span className="tooltip-wrap">
                  <button type="button" className="tooltip-trigger" aria-describedby="np-tooltip" aria-label="What Total NP means">?</button>
                  <span className="tooltip" role="tooltip" id="np-tooltip">
                    NP is FTCScout&apos;s non-penalty OPR estimate: a team&apos;s estimated contribution to its alliance&apos;s score with penalty points removed. The percentile compares that estimate with FTC teams in the same season.
                  </span>
                </span>
              </p>
              <strong>83.12<span className="ordinal">th</span></strong>
              <span className="metric-arrow">↗</span>
            </article>
            <article className="metric-card">
              <span className="metric-index">02</span>
              <p>Georgia overall</p>
              <strong>19<span className="ordinal">th</span> / 128</strong>
              <span className="metric-arrow">↗</span>
            </article>
            <article className="metric-card">
              <span className="metric-index">03</span>
              <p>Atlanta-Marist League</p>
              <strong>10<span className="ordinal">th</span> / 33</strong>
              <span className="metric-arrow">↗</span>
            </article>
            <article className="metric-card">
              <span className="metric-index">04</span>
              <p>League autonomous rank</p>
              <strong>7<span className="ordinal">th</span> / 33</strong>
              <span className="metric-arrow">↗</span>
            </article>
          </div>

          <div className="event-story">
            <div className="event-story-heading">
              <div>
                <p className="data-label">2025–26 EVENT PROGRESSION</p>
                <h3>Four events. One upward curve.</h3>
              </div>
              <p>
                Average NP improved at every stop, then surged at the league
                tournament as the RoboKnights converted a season of iteration
                into their strongest event performance.
              </p>
            </div>

            <div className="event-timeline" aria-label="RoboKnights 2025–26 event results in chronological order">
              <article className="event-card">
                <div className="event-topline"><span>01</span><small>MEET #1</small></div>
                <h4>Atlanta-Marist</h4>
                <div className="event-np"><strong>69.8</strong><span>AVG NP</span></div>
                <div className="event-np-bar" aria-hidden="true"><span style={{ width: "56.6%" }} /></div>
                <dl><div><dt>Event rank</dt><dd>8th</dd></div><div><dt>Record</dt><dd>4–1–0</dd></div></dl>
              </article>

              <article className="event-card">
                <div className="event-topline"><span>02</span><small>MEET #2</small></div>
                <h4>Atlanta-Marist</h4>
                <div className="event-np"><strong>71.4</strong><span>AVG NP</span></div>
                <div className="event-np-bar" aria-hidden="true"><span style={{ width: "57.9%" }} /></div>
                <dl><div><dt>Event rank</dt><dd>9th</dd></div><div><dt>Record</dt><dd>3–2–0</dd></div></dl>
              </article>

              <article className="event-card">
                <div className="event-topline"><span>03</span><small>MEET #3</small></div>
                <h4>Atlanta-Marist</h4>
                <div className="event-np"><strong>74.0</strong><span>AVG NP</span></div>
                <div className="event-np-bar" aria-hidden="true"><span style={{ width: "60%" }} /></div>
                <dl><div><dt>Event rank</dt><dd>23rd</dd></div><div><dt>Record</dt><dd>1–4–0</dd></div></dl>
              </article>

              <article className="event-card event-card-final">
                <div className="event-topline"><span>04</span><small>LEAGUE TOURNAMENT</small></div>
                <h4>Atlanta League</h4>
                <div className="event-np"><strong>123.4</strong><span>AVG NP</span></div>
                <div className="event-np-bar" aria-hidden="true"><span style={{ width: "100%" }} /></div>
                <dl><div><dt>Event rank</dt><dd>5th</dd></div><div><dt>Record</dt><dd>4–1–0</dd></div></dl>
              </article>
            </div>
          </div>

          <div className="league-scorecard">
            <div className="league-scorecard-copy">
              <p className="data-label">ATLANTA-MARIST LEAGUE AVERAGES</p>
              <h3>Built to score before TeleOp begins.</h3>
              <p>Our 23.60 average autonomous points ranked seventh among all 33 league teams.</p>
            </div>
            <dl className="league-stats">
              <div><dt>Rank score</dt><dd>3.60</dd></div>
              <div><dt>Match points</dt><dd>73.6</dd></div>
              <div><dt>Base points</dt><dd>11.0</dd></div>
              <div className="league-stat-featured"><dt>Auto points</dt><dd>23.60</dd><span>7th of 33</span></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="engineering section" id="engineering">
        <div className="shell">
          <div className="section-heading light-heading">
            <div>
              <p className="kicker">02 / Behind the climb</p>
              <h2>Engineered, not accidental.</h2>
            </div>
            <p>
              Our trajectory comes from one system: students moving quickly
              between code, hardware, testing, and competition strategy.
            </p>
          </div>

          <div className="discipline-grid">
            <article className="discipline-card featured-card">
              <div className="card-topline"><span>01</span><small>CONTROL</small></div>
              <div className="code-graphic" aria-hidden="true">
                <span className="code-line line-long" />
                <span className="code-line line-short" />
                <span className="code-line line-mid" />
                <span className="code-cursor" />
              </div>
              <div>
                <p className="card-kicker">Autonomous</p>
                <h3>Precision before the buzzer.</h3>
                <p>Reliable routines built, tested, and tuned for repeatable scoring under match pressure.</p>
              </div>
            </article>

            <article className="discipline-card">
              <div className="card-topline"><span>02</span><small>MECHANISM</small></div>
              <div className="mechanism-graphic" aria-hidden="true">
                <span className="gear gear-large" />
                <span className="gear gear-small" />
                <span className="mechanism-axis" />
              </div>
              <div>
                <p className="card-kicker">Mechanical</p>
                <h3>Fast cycles. Clean execution.</h3>
                <p>A competition robot shaped by rapid prototypes, field feedback, and relentless iteration.</p>
              </div>
            </article>

            <article className="discipline-card">
              <div className="card-topline"><span>03</span><small>DECISIONS</small></div>
              <div className="strategy-graphic" aria-hidden="true">
                <span className="field-line f-one" />
                <span className="field-line f-two" />
                <span className="strategy-node n-one" />
                <span className="strategy-node n-two" />
                <span className="strategy-node n-three" />
              </div>
              <div>
                <p className="card-kicker">Strategy</p>
                <h3>Every match is a new problem.</h3>
                <p>Data-driven scouting and clear alliance plans turn robot capability into competitive results.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="team section" id="team">
        <div className="shell team-layout">
          <div className="team-image">
            <img src="/images/team-2025-26.webp" alt="Members of the RoboKnights together at a 2025–26 competition" />
            <span>2025–26 / THE ROBOKNIGHTS</span>
          </div>
          <div className="team-copy">
            <p className="kicker">03 / The team</p>
            <h2>Students who build the next version.</h2>
            <p className="team-lede">
              The RoboKnights are Pace Academy students who treat engineering as
              a team sport—sharing ownership, learning across disciplines, and
              making each other better under pressure.
            </p>
            <div className="team-values">
              <div><span>01</span><p><strong>Curiosity</strong>Ask better questions.</p></div>
              <div><span>02</span><p><strong>Ownership</strong>Build what the team needs.</p></div>
              <div><span>03</span><p><strong>Momentum</strong>Improve every iteration.</p></div>
            </div>
          </div>
        </div>
        <div className="shell roster">
          <div className="roster-heading">
            <p className="data-label">TEAM LEADERSHIP</p>
            <p>Five students, distinct specialties, one competitive system.</p>
          </div>
          <div className="roster-grid">
            <article><span>01</span><h3>Mason Pinkerton</h3><p>Team Co-Captain · Head of Code Team · Autonomous Code Lead</p></article>
            <article><span>02</span><h3>Ben Geis</h3><p>Team Co-Captain · Head of CAD and Mechanics</p></article>
            <article><span>03</span><h3>Sam Schoeffler</h3><p>Head of Forward-Thinking Design · Outreach</p></article>
            <article><span>04</span><h3>JJ Brown</h3><p>TeleOp Code Lead</p></article>
            <article><span>05</span><h3>Maddie Finn</h3><p>Head of Electrical</p></article>
          </div>
        </div>
      </section>

      <section className="sponsors section" id="sponsors">
        <div className="shell sponsors-layout">
          <div className="sponsor-photo">
            <img src="/images/polymaker-partnership.webp" alt="A RoboKnights member holding 3D-printing materials supplied by Polymaker" />
          </div>
          <div className="sponsor-copy">
            <p className="kicker">04 / Current sponsor</p>
            <p className="sponsor-status">Proudly supported by</p>
            <h2>Polymaker</h2>
            <p>
              Polymaker is the RoboKnights&apos; sole current sponsor, supporting our
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
            <p className="kicker">05 / Build with us</p>
            <h2>Back the next breakthrough.</h2>
            <p>
              We are actively welcoming new sponsors and partners. Your support gives
              our students the tools, materials, and mentorship to keep turning
              ambitious ideas into competitive performance.
            </p>
            <div className="partner-actions">
              <a className="button button-dark" href="mailto:paceroboknights15290@gmail.com">
                Email the team <ArrowUpRight />
              </a>
              <span>Recruit · Mentor · Sponsor</span>
            </div>
          </div>
          <SponsorForm />
        </div>
      </section>

      <footer>
        <div className="shell footer-content">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark">R</span>
            <span><strong>The RoboKnights</strong><small>FTC #15290</small></span>
          </a>
          <p>Pace Academy · Atlanta, Georgia</p>
          <div className="footer-links">
            <a href="mailto:paceroboknights15290@gmail.com">Email</a>
            <a href="https://www.instagram.com/roboknights15290/" target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <a href="#top" className="back-top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
