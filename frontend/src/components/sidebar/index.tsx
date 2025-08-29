import { Link, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DashboardIcon from '@mui/icons-material/Dashboard';

import GroupIcon from '@mui/icons-material/Group';
import { JSX } from "react";

interface NavLink {
  name: string;
  icon: string | JSX.Element;
  link: string;
}
const navLinks: NavLink[] = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    link: "/dashboard",
  },
  {
    name: "Tickets",
    icon: <ConfirmationNumberIcon />,
    link: "/tickets",
  },
  {
    name: "Teams",
    icon: <GroupIcon />,
    link: "/teams",
  },
  {
    name: "Notification",
    icon: <NotificationsIcon />,
    link: "/notifications",
  }
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        backgroundColor: "#161d2f",
        padding: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: {
          xs: "row",
          lg: "column",
        },
        alignItems: "center",
        justifyContent: "space-between",
        width: {
          sm: "100%",
          lg: 200,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "row",
            lg: "column",
          },
          gap: 5,
          alignItems: {
            xs: "center",
            lg: "start",
          },
          width: "100%",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            my={2}
            fontWeight={400}
            fontSize={18}
          >
            Portail Assistance
          </Typography>
        </Box>

        <Box
          sx={{
            py: { xs: "0px", lg: "16px" },
            display: "flex",
            flexDirection: { xs: "row", lg: "column" },
            gap: 4,
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",  // 👈 aligns icon + text vertically
                  gap: 1.5,              // spacing between icon & label
                  color: "white",
                  "&:hover": { color: "#7c8cff" }, // optional hover effect
                }}
              >
                {item.icon}
                <Typography>{item.name}</Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
