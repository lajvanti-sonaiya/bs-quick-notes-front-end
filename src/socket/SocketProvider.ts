"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from ".";
import {
  socketNoteCreated,
  socketNoteDeleted,
  socketNoteUpdated,
} from "@/redux/slices/note-slice";
import { useAuth } from "@clerk/nextjs";

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", userId);

    socket.on("note:created", (note) => {
      dispatch(socketNoteCreated(note));
    });

    socket.on("note:updated", (note) => {
      dispatch(socketNoteUpdated(note));
    });

    socket.on("note:deleted", (note) => {
      dispatch(socketNoteDeleted(note));
    });

    return () => {
      socket.off("note:created");
      socket.off("note:updated");
      socket.off("note:deleted");
      socket.disconnect();
    };
  }, []);

  return children;
}
