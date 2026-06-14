import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ProfileRecord } from "@/lib/repositories/profiles";
import { publicConfig } from "@/lib/config";

export function profilePhotoUrl(profile: ProfileRecord, file = profile.photos[0]) {
  return file ? `${publicConfig.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${profile.collectionId}/${profile.id}/${encodeURIComponent(file)}?thumb=640x840` : "";
}

export function ProfileCard({ profile, onHide }: { profile: ProfileRecord; onHide?: (userId: string) => void }) {
  return <article className="discovery-card"><div className="discovery-photo" style={{ backgroundImage: `linear-gradient(180deg,transparent 48%,rgba(37,29,24,.78)),url(${profilePhotoUrl(profile)})` }}><div className="discovery-name"><h2>{profile.display_name}, {profile.age}</h2><p><MapPin size={13} /> {profile.city}</p></div></div><div className="discovery-card-body"><p>{profile.bio}</p><div className="profile-tags">{profile.values.slice(0,3).map((value) => <span key={value}>{value}</span>)}</div><div className="card-actions"><Link className="button" href={`/profile/${profile.user}`}>View profile</Link>{onHide && <button className="not-for-me" onClick={() => onHide(profile.user)}>Not for me</button>}</div></div></article>;
}
