import { SignIn } from "@clerk/nextjs";
import { Box } from "@mui/material";

export default function Page() {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems:"center" ,height:"90vh" }}
    >
      <SignIn />
    </Box>
  );
}
