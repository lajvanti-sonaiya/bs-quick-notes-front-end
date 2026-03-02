"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Box, Button } from "@mui/material";

const Header = () => {
  const { user } = useUser();
  return (
    <header>
      <Box
        sx={{
          boxShadow: "0 10px 8px #00000033",
          padding: 2,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <SignedOut>
          <Box sx={{display:"flex", gap:2}}>
            <SignInButton>
              <Button variant="contained">sign in</Button>
            </SignInButton>

            <SignUpButton>
              <Button variant="contained">sign up</Button>
            </SignUpButton>
          </Box>
        </SignedOut>
        <SignedIn>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UserButton />
            {user?.firstName}
          </Box>
        </SignedIn>
      </Box>
    </header>
  );
};

export default Header;
