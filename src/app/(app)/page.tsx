"use client";
import { Box } from "@mui/material";
import { useSession } from "@clerk/nextjs";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useRef } from "react";
import { setClerkToken } from "@/utills/auth-token";
import { syncUser } from "@/redux/slices/user-slice";
import Board from "../components/Board";

export default function Home() {
  const { session, isLoaded } = useSession();

  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isLoaded || !session) return;
    hasInitialized.current = true;
    const init = async () => {
      const token = await session.getToken();
      if (!token) return;
      setClerkToken(token);
      dispatch(syncUser());
    };

    init();
  }, [isLoaded, session]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        marginTop: 6,
        padding:4
      }}
    >
      <Board/>
    </Box>
  );
}
