import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    MenuItem,
    CircularProgress
} from "@mui/material";
import { TicketStatus } from "../../enum/TicketStatus";
import { Priority } from "../../enum/Priority";
import { CreateTeamRequest, Team } from "../../model/team";
import { useUsers } from "../../hooks/useUsers";
import { User } from "../../model/user";
import { TeamDataType } from "../team-list/TeamDataType";
import { TeamService } from "../../api/services/teamService";

interface CreateTeamModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (team: TeamDataType) => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ open, onClose, onSave }) => {
    const [team, setTeam] = useState<TeamDataType>({
        id:0,
        name: "",
        description: "",
    });

    const handleChange = (field: keyof TeamDataType, value: any) => {
        setTeam({ ...team, [field]: value });
    };

    const handleUserSelect = (userId: number) => {
        const selectedUser = users.find((u: User) => u.id === userId);
        if (selectedUser) {
            setTeam({ ...team });
        }
    };

    const handleSave = async () => {
        try {
            const teamRequest: CreateTeamRequest = {
                name: team.name,
                description: team.description,
            };

            // Call backend
            const newTeam = await TeamService.createTeam(teamRequest);

            // Pass created ticket back to parent
            onSave(newTeam);
            onClose();
        } catch (error) {
            console.error("Error creating ticket:", error);
            alert("Failed to create ticket. Please try again.");
        }
    };

    const { users, loading: usersLoading, error: usersError } = useUsers();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Créer une nouvelle équipe</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Title"
                        value={team.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={team.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTeamModal;
