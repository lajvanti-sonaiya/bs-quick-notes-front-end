"use client";
  
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Box, Button, Typography } from "@mui/material";

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "22px",
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
              cursor: "default",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            QuickBoard
          </Typography>

          <Box>
            <SignedOut>
              <Box sx={{ display: "flex", gap: 2 }}>
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
        </Box>
      </Box>
    </header>
  );
};

export default Header;
