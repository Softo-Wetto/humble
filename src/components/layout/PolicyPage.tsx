import Link from "next/link";

export function PolicyPage({
  eyebrow,
  title,
  introduction,
  sections,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: { title: string; paragraphs: string[] }[];
}) {
  return (
    <main className="policy-page">
      <header className="site-header page-shell">
        <Link className="wordmark" href="/">humble<span>.</span></Link>
        <nav className="header-nav" aria-label="Policy navigation">
          <Link href="/safety">Safety</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link className="button button-small" href="/signup">Join Humble</Link>
        </nav>
      </header>
      <article className="policy-content page-shell">
        <div className="policy-intro">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{introduction}</p>
        </div>
        <div className="policy-sections">
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
