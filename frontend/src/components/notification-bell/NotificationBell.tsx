import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
    IconButton,
    Badge,
    Box,
    Typography,
    Popover,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    let stompClient: Client;
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.subscribe("/topic/notifications", (msg) => {
                    if (msg.body) {
                        const notif = JSON.parse(msg.body);
                        setNotifications((prev) => [notif, ...prev]);
                    }
                });
            },
        });

        stompClient.activate();
    }, []);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);

    return (
        <Box>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Box
                    sx={{
                        width: 300,
                        maxHeight: 400,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    <List dense>
                        {notifications.length === 0 && (
                            <Typography sx={{ p: 2, textAlign: "center" }}>
                                No notifications
                            </Typography>
                        )}
                        {notifications.map((n, i) => (
                            <ListItem key={i} divider>
                                <ListItemText primary={n.message} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Popover>
        </Box>
    );
}
