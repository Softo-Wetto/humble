export type ChatMatch = { participantOneId: string; participantTwoId: string; status: "active" | "unmatched" | "blocked" | "admin_closed" };
export function canSendMessage(actorId: string, match: ChatMatch, body: string) {
  if (actorId !== match.participantOneId && actorId !== match.participantTwoId) return { success: false as const, message: "You are not part of this match." };
  if (match.status !== "active") return { success: false as const, message: "This conversation has ended." };
  const trimmed = body.trim(); if (!trimmed || trimmed.length > 2000) return { success: false as const, message: "Messages must contain between 1 and 2000 characters." };
  return { success: true as const, body: trimmed };
}
export function countUnreadMessages(userId: string, messages: { senderId: string; readAt: string | null }[]) { return messages.filter((message) => message.senderId !== userId && !message.readAt).length; }
