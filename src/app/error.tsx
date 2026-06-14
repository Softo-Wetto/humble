"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="state-page"><p className="eyebrow">A quiet interruption</p><h1>That did not come together.</h1><p>Your information is still here. Check your connection and try once more.</p><button className="button" onClick={reset}>Try again</button></main>;
}
