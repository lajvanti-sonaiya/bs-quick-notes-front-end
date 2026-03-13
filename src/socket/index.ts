"use client";
import { envObj } from "@/config";
import { io } from "socket.io-client";

export const socket = io(envObj.SOCKET_URL, {
  transports: ["websocket"],
});
