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
import TeamtList from "../../components/team-list";
import { useTeams } from "../../hooks/useTeams";
import { TeamContext } from "../../context/team-context";

const Teams = () => {
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState<TicketDataType[]>([]);
  const { teams, loading, error, createTeam } = useTeams();
  
  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setSearch(e.target.value);
    const newList = teams.filter((ticket) =>
      ticket.name.toLowerCase().includes(search.toLowerCase())
    );
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
              <TeamtList teamList={teams} />
            </Box>
          </Box>
        ) : (
          <Box width="100%">
            <Typography>
              Found {searchList.length} results for "{search}"{""}
            </Typography>
            <TeamtList teamList={teams} />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Teams;
