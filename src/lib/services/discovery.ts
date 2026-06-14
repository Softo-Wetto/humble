import { isDiscoverable, type DiscoveryCandidate, type DiscoveryExclusions, type DiscoveryPreferences } from "@/lib/domain/discovery";

export type OrderedCandidate = DiscoveryCandidate & { updatedAt: string };

export function filterDiscoveryCandidates(viewer: DiscoveryPreferences, candidates: OrderedCandidate[], exclusions: DiscoveryExclusions) {
  return candidates
    .filter((candidate) => isDiscoverable(viewer, candidate, exclusions))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.userId.localeCompare(right.userId));
}
