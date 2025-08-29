import React, { useState, SetStateAction, useContext } from "react";
import Layout from "../../layout/Layout";
import {
  Box,
  Paper,
  InputBase,
  InputAdornment,
  Typography,
} from "@mui/material";
import { TicketDataType } from "../../components/ticket-list/TicketDataType";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationList from "../../components/notifications-list";
import { NotificationContext } from "../../context/notification-context";

const Notifications = () => {
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState<TicketDataType[]>([]);
  const { state } = useContext(NotificationContext);
  const { notifications, loading, error } = useNotifications();

  return (
    <Layout>
      <Box>
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "default",
            p: 1,
            backgroundColor: "#10141f",
            border: "none",
          }}
        >
        </Paper>
      </Box>
      <Box py={2} px={4}>
        {search === "" ? (
          <Box width="100%">
            <Box width="100%">
              {/* <MovieTrendList trendingList={trendingList} /> */}
            </Box>
            <Box width="100%">
              <NotificationList />
            </Box>
          </Box>
        ) : (
          <Box width="100%">
            <Typography>
              Found {searchList.length} results for "{search}"{""}
            </Typography>
            <NotificationList />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Notifications;
