// =====================================================
// SOCKET CLIENT SETUP
// =====================================================

import { io, Socket } from "socket.io-client"

// =====================================================
// SOCKET URL
// =====================================================

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "http://localhost:4000"

// =====================================================
// GLOBAL TYPE (สำหรับ Next.js)
// =====================================================

declare global {
  var _socket: Socket | undefined
}

// =====================================================
// CREATE SINGLE SOCKET INSTANCE
// =====================================================

const socket: Socket = global._socket ?? io(SOCKET_URL, {

  transports: ["websocket"],

  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,

  timeout: 20000,

  autoConnect: false // ✅ ให้เรา control เอง

})

// เก็บ instance ไว้
if (!global._socket) {
  global._socket = socket
}

// =====================================================
// CONNECT FUNCTION (สำคัญมาก)
// =====================================================

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect()
  }
}

// =====================================================
// EXPORT
// =====================================================

export { socket }

// =====================================================
// DEBUG EVENTS
// =====================================================

socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id)
})

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket disconnected:", reason)
})

socket.on("reconnect", (attempt) => {
  console.log("🟡 Socket reconnected after", attempt, "attempts")
})

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message)
})