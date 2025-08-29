import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";

export default function Navbar() {
  const user = {
    name: "Anas Lhajjam",
    avatar: "https://i.pravatar.cc/40" // example avatar
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side: App title */}
        <Typography variant="h6" noWrap>
          Ticket Support System
        </Typography>

        {/* Right side: User info */}
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar alt={user.name} src={user.avatar} />
          <Typography variant="body1">{user.name}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
