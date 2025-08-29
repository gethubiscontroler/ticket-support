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
import { TicketContext } from "../../context/ticket-context";
import { TicketStatus } from "../../enum/TicketStatus";
import TicketList from "../../components/ticket-list";
import { useTickets } from "../../hooks/useTickets";

const Tickets = () => {
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState<TicketDataType[]>([]);
  const { tickets, loading, error, createTicket } = useTickets();

  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setSearch(e.target.value);
    const newList = tickets.filter((ticket) =>
      ticket.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchList(newList);
  };



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
              <TicketList />
            </Box>
          </Box>
        ) : (
          <Box width="100%">
            <Typography>
              Found {searchList.length} results for "{search}"{""}
            </Typography>
            <TicketList />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Tickets;
