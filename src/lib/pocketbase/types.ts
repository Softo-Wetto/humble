export type PocketBaseRecord = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  [key: string]: unknown;
};

export type AuthRecord = PocketBaseRecord & {
  email: string;
  birth_date: string;
  role: "member" | "admin";
  account_state: "active" | "paused" | "deactivated" | "suspended" | "pending_deletion";
  onboarding_complete: boolean;
};

export type AuthResponse = { token: string; record: AuthRecord };
