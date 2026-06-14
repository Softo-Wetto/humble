import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const profiles = [
  { name: "Maya", age: 29, tone: "profile-maya", note: "Community gardener and Sunday cook" },
  { name: "Theo", age: 31, tone: "profile-theo", note: "Ceramicist, reader, careful listener" },
  { name: "Imani", age: 28, tone: "profile-imani", note: "Museum afternoons and long-table dinners" },
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header page-shell">
        <Link className="wordmark" href="/" aria-label="Humble home">
          humble<span>.</span>
        </Link>
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="#how-it-works">How it works</Link>
          <Link href="/safety">Safety</Link>
          <Link className="text-button" href="/login">Log in</Link>
          <Link className="button button-small" href="/signup">Join Humble</Link>
        </nav>
      </header>

      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> Connection without the performance</p>
          <h1>Meet through what you appreciate.</h1>
          <p className="hero-lead">
            Humble is a calmer dating app where every connection begins with a sincere
            compliment, not a split-second swipe.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/signup">
              Join Humble <ArrowRight size={17} />
            </Link>
            <Link className="quiet-link" href="#how-it-works">See how it feels</Link>
          </div>
          <div className="principles" aria-label="Humble principles">
            <span><Check size={14} /> No swiping</span>
            <span><Check size={14} /> No compliment limits</span>
            <span><Check size={14} /> Adults 18+</span>
          </div>
        </div>

        <div className="hero-scene" aria-label="A preview of the Humble discovery experience">
          <div className="soft-orbit orbit-one" />
          <div className="soft-orbit orbit-two" />
          <article className="feature-profile">
            <div className="portrait portrait-primary" role="img" aria-label="Portrait placeholder for Maya">
              <span>M</span>
            </div>
            <div className="profile-copy">
              <p className="profile-place">West End, Brisbane</p>
              <h2>Maya, 29</h2>
              <p>Community gardener, careful listener, and enthusiastic Sunday cook.</p>
              <div className="profile-tags"><span>Kindness</span><span>Outdoors</span><span>Cooking</span></div>
            </div>
          </article>
          <div className="compliment-note">
            <MessageCircleHeart size={20} />
            <div><span>A thoughtful start</span><p>“Your love for bringing people together really stood out.”</p></div>
          </div>
        </div>
      </section>

      <section className="belief-strip">
        <p>Less judging. More noticing.</p>
        <span>Profiles worth reading</span><i />
        <span>Intentions made clear</span><i />
        <span>Safety built in</span>
      </section>

      <section id="how-it-works" className="steps-section page-shell section-spacing">
        <div className="section-heading">
          <p className="eyebrow">A kinder rhythm</p>
          <h2>Connection should feel human from the beginning.</h2>
          <p>Take your time, notice the whole person, and say what genuinely resonated.</p>
        </div>
        <div className="steps-grid">
          <article><span>01</span><Heart size={23} /><h3>Discover thoughtfully</h3><p>Browse complete profiles with clear Previous and Next controls. No swipe decisions.</p></article>
          <article><span>02</span><MessageCircleHeart size={23} /><h3>Offer a compliment</h3><p>Start with your own words. Compliments are always free and never rationed.</p></article>
          <article><span>03</span><Sparkles size={23} /><h3>Connect by choice</h3><p>When a compliment is accepted, a private match opens for conversation.</p></article>
        </div>
      </section>

      <section className="people-section page-shell section-spacing">
        <div className="section-heading compact">
          <p className="eyebrow">People, not profiles to score</p>
          <h2>Space for what matters to come through.</h2>
        </div>
        <div className="profile-row">
          {profiles.map((profile, index) => (
            <article className={`person-card ${index === 1 ? "person-card-raised" : ""}`} key={profile.name}>
              <div className={`portrait ${profile.tone}`} role="img" aria-label={`Portrait placeholder for ${profile.name}`}>
                <span>{profile.name[0]}</span>
              </div>
              <div><h3>{profile.name}, {profile.age}</h3><p>{profile.note}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="safety-section page-shell section-spacing">
        <div className="safety-panel">
          <div className="safety-icon"><ShieldCheck size={28} /></div>
          <div><p className="eyebrow">Quietly serious about safety</p><h2>Your boundaries belong to you.</h2></div>
          <p>Block privately, report clearly, pause discovery, and leave any match without pressure. Humble is designed so respect is structural, not decorative.</p>
          <Link className="quiet-link" href="/safety">Our safety approach <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-shell closing-inner">
          <p className="eyebrow">Something sincere is a good place to start</p>
          <h2>Make room for a gentler kind of connection.</h2>
          <Link className="button button-light" href="/signup">Create your profile <ArrowRight size={17} /></Link>
        </div>
      </section>

      <footer className="site-footer page-shell">
        <Link className="wordmark" href="/">humble<span>.</span></Link>
        <p>Dating with a little more care.</p>
        <nav aria-label="Footer navigation"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/safety">Safety</Link></nav>
      </footer>
    </main>
  );
}
