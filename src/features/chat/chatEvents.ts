/** Fired when user opens chat so unread badges can clear for that order. */
export const CHAT_MESSAGES_READ_EVENT = "homeservice:chat-messages-read" as const

export type ChatMessagesReadDetail = { orderId: string }
