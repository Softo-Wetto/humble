import type { AccountState } from "./account";

export type DiscoveryPreferences = {
  userId: string;
  age: number;
  gender: string;
  interestedIn: string[];
  minimumAge: number;
  maximumAge: number;
};

export type DiscoveryCandidate = DiscoveryPreferences & {
  isPublished: boolean;
  hasPhoto: boolean;
  accountState: AccountState;
};

export type DiscoveryExclusions = {
  blockedIds: string[];
  hiddenIds: string[];
};

export function isDiscoverable(
  viewer: DiscoveryPreferences,
  candidate: DiscoveryCandidate,
  exclusions: DiscoveryExclusions,
) {
  if (viewer.userId === candidate.userId) return false;
  if (!candidate.isPublished || !candidate.hasPhoto || candidate.accountState !== "active") return false;
  if (exclusions.blockedIds.includes(candidate.userId)) return false;
  if (exclusions.hiddenIds.includes(candidate.userId)) return false;
  if (!viewer.interestedIn.includes(candidate.gender)) return false;
  if (!candidate.interestedIn.includes(viewer.gender)) return false;
  if (candidate.age < viewer.minimumAge || candidate.age > viewer.maximumAge) return false;
  if (viewer.age < candidate.minimumAge || viewer.age > candidate.maximumAge) return false;
  return true;
}
