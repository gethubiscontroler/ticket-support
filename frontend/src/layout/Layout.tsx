import { ReactNode } from "react";
import { AppBar, Avatar, Badge, Box, Typography } from "@mui/material";
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar";
import { Toolbar } from '@mui/material';
import NotificationBell from "../components/notification-bell/NotificationBell";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#10141F",
        display: "flex",
        flexDirection: {
          xs: "column",
          lg: "row",
        },
        color: "white",
        padding: 3,
        gap: 3,
        overflowY: "hidden",
        height: "100vh",
        paddingLeft: "0%",
        paddingRight: "0%"
      }}
    >
      <Sidebar />
      <Box sx={{
        width: "100%",
        overflow: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", backgroundColor:"#1E1E2F" }}>
            {/* LEFT: app name */}
            <Box display="flex" alignItems="center" gap={2}>
              <NotificationBell />
              <Avatar alt="test" src="test" />
              <Typography variant="body1">Anas</Typography>
            </Box>
          </Toolbar>
        </AppBar>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
