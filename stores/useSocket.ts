import { Manager, Socket } from "socket.io-client";
import parser from "socket.io-msgpack-parser";
import { create } from "zustand";

// Type definitions for the store
type SocketStoreType = {
  crashSocket: (token: string | null) => Socket | null;
  wheelSocket: (token: string | null) => Socket | null;
  streamSocket: (token: string | null) => void;
  cacheStreamSocket: Socket | null;
};

// Function to create a new socket manager
const createSocketManager = (url: string): Manager => {
  return new Manager(url, {
    autoConnect: false,
    transports: ["websocket"],
    forceNew: true,
    timeout: 2000,
    reconnection: true,
    parser: parser,
  });
};

// Create the socket store using Zustand
const useSocketStore = create<SocketStoreType>((set, get) => ({
  crashSocket: (token: string | null) => {
    const manager = createSocketManager(
      process.env.NEXT_PUBLIC_CRASH_SOCKET_URL!,
    );
    return manager.socket("/crash", {
      auth: {
        token: token,
      },
    });
  },
  wheelSocket: (token: string | null) => {
    const manager = createSocketManager(
      process.env.NEXT_PUBLIC_WHEEL_SOCKET_URL!,
    );
    return manager.socket("/wheel", {
      auth: {
        token: token,
      },
    });
  },
  cacheStreamSocket: null,
  streamSocket: (token: string | null) => {
    if (get().cacheStreamSocket) {
      const auth = (get().cacheStreamSocket?.auth as { [key: string]: any })
        .token;
      if (auth === token) return;

      if (get().cacheStreamSocket?.connected)
        get().cacheStreamSocket?.disconnect();
    }

    const manager = createSocketManager(
      process.env.NEXT_PUBLIC_STREAM_SOCKET_URL!,
    );
    set({
      cacheStreamSocket: manager.socket("/stream", {
        auth: {
          token: token,
        },
      }),
    });
  },
}));

export { useSocketStore };
