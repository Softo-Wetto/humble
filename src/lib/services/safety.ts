export function relationshipEndState(action: "block" | "unmatch") { return action === "block" ? "blocked" as const : "unmatched" as const; }
export function buildEvidenceSnapshot<T extends Record<string, unknown>>(content: T): T { return structuredClone(content); }
