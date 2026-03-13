"use client"

import { Box, Typography } from "@mui/material";
import { useSession, useUser } from "@clerk/nextjs";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useRef } from "react";
import { setClerkToken } from "@/utills/auth-token";
import { syncUser } from "@/redux/slices/user-slice";
import NoteList from "../../components/notes/NoteList";


const Notes = () => {
  const { session, isLoaded, isSignedIn } = useSession();

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
      }}
    >
      {!isSignedIn && (
        <>
          <Typography variant="h3">Quick Notes</Typography>
          <Typography> Capture your thoughts instantly ✨</Typography>
        </>
      )}

      {isSignedIn && (
        <>
          <Typography variant="h3">Quick Notes</Typography>
          <NoteList />
        </>
      )}
    </Box>
  );
};

export default Notes;
