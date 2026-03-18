import { io, Socket } from "socket.io-client"

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "http://localhost:4000"

  let _socket: Socket | null = null
// ==============================
// GET SOCKET INSTANCE (safe)
// ==============================
export const getSocket = (): Socket => {

  if (!_socket) {

    const newSocket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],

      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,

      timeout: 20000,
      autoConnect: false
    })

    // ==============================
    // DEBUG (เฉพาะ dev)
    // ==============================
    if (process.env.NODE_ENV === "development") {

      newSocket.on("connect", () => {
        console.log("🟢 Socket connected:", newSocket.id ?? "no-id")
      })

      newSocket.on("disconnect", (reason: string) => {
        console.log("🔴 Socket disconnected:", reason)
      })

      newSocket.on("reconnect", (attempt: number) => {
        console.log("🟡 Reconnected after", attempt)
      })

      newSocket.on("connect_error", (err: unknown) => {
        console.error("❌ Socket error:", err)
      })
    }

    _socket = newSocket
  }

  return socket
}

// ==============================
// CONNECT
// ==============================
export const connectSocket = () => {

  const s = getSocket()

  if (s.connected || s.active) return

  s.connect()
}

// ==============================
// EXPORT SOCKET (lazy-safe)
// ==============================
export const socket: Socket = getSocket()