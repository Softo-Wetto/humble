import Link from "next/link";

export default function NotFoundPage() {
  return <main className="state-page"><p className="eyebrow">Page not found</p><h1>There is nothing waiting here.</h1><p>The page may have moved, or the profile may no longer be visible.</p><Link className="button" href="/">Return home</Link></main>;
}
