import Link from "next/link";
import { HeartHandshake, Inbox, MessagesSquare, Search, UserRound } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export function AppShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const items = [["discover", "/discover", "Discover", Search], ["compliments", "/compliments", "Compliments", Inbox], ["matches", "/matches", "Matches", MessagesSquare], ["profile", "/profile", "Profile", UserRound]] as const;
  return <div className="app-frame"><aside className="app-sidebar"><Link className="wordmark" href="/discover">humble<span>.</span></Link><nav aria-label="Application navigation">{items.map(([key, href, label, Icon]) => <Link className={active === key ? "active" : ""} href={href} key={key}><Icon size={18} />{label}</Link>)}</nav><div className="sidebar-note"><HeartHandshake size={19} /><p>There is no rush here.</p></div><LogoutButton /></aside><main className="app-main">{children}</main><nav className="mobile-app-nav" aria-label="Mobile application navigation">{items.slice(0,4).map(([key, href, label, Icon]) => <Link className={active === key ? "active" : ""} href={href} key={key}><Icon size={18} /><span>{label}</span></Link>)}</nav></div>;
}
