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
import { Team } from "../../model/team";
import { TicketDataType } from "../ticket-list/TicketDataType";
import { useUsers } from "../../hooks/useUsers";
import { User } from "../../model/user";
import { useTeams } from "../../hooks/useTeams";

interface CreateTicketModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (ticket: TicketDataType) => void;
    initialData?: TicketDataType;
    isEdit?: boolean;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ 
    open,
    onClose,
    onSave,
    initialData,
    isEdit 
}) => {
    // Create initial empty form data
    const getInitialFormData = (): TicketDataType => ({
        id: Date.now(),
        title: "",
        description: "",
        creationDate: new Date(),
        status: TicketStatus.OPEN,
        priority: Priority.MEDIUM,
        createdBy: { id: 0, name: "", email: "" },
        assignedTeam: {} as Team,
    });

    const [formData, setFormData] = React.useState<TicketDataType>(
        initialData || getInitialFormData()
    );

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else if (open && !isEdit) {
            // Reset form when opening for create mode
            setFormData(getInitialFormData());
        }
    }, [initialData, open, isEdit]);

    const handleChange = (field: keyof TicketDataType, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleUserSelect = (userId: number) => {
        const selectedUser = users.find((u: User) => u.id === userId);
        if (selectedUser) {
            setFormData({ ...formData, createdBy: selectedUser });
        }
    };

    const handleTeamSelect = (teamId: number) => {
        const selectedTeam = teams.find((t: Team) => t.id === teamId);
        if (selectedTeam) {
            setFormData({ ...formData, assignedTeam: selectedTeam });
        }
    };

    const handleSave = () => {
        // Validate required fields
        if (!formData.title.trim()) {
            alert("Title is required");
            return;
        }
        if (!formData.description.trim()) {
            alert("Description is required");
            return;
        }
        if (!formData.createdBy.id) {
            alert("Please select a user");
            return;
        }
        if (!formData.assignedTeam.id) {
            alert("Please select a team");
            return;
        }

        // Pass the form data to parent component
        // The parent will handle the API call through useTickets hook
        onSave(formData);
        
        // Reset form data for create mode
        if (!isEdit) {
            setFormData(getInitialFormData());
        }
    };

    const handleClose = () => {
        // Reset form data when closing if in create mode
        if (!isEdit) {
            setFormData(getInitialFormData());
        }
        onClose();
    };

    const { users, loading: usersLoading, error: usersError } = useUsers();
    const { teams, loading: teamsLoading, error: teamsError } = useTeams();

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        required
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        required
                    />
                    {/* Select Created By from Users */}
                    {usersLoading ? (
                        <CircularProgress size={24} />
                    ) : usersError ? (
                        <p style={{ color: "red" }}>Error loading users</p>
                    ) : (
                        <TextField
                            select
                            label="Created By"
                            value={formData.createdBy.id || ""}
                            onChange={(e) => handleUserSelect(Number(e.target.value))}
                            required
                        >
                            {users.map((user: User) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    {/* Select Team from Teams */}
                    {teamsLoading ? (
                        <CircularProgress size={24} />
                    ) : teamsError ? (
                        <p style={{ color: "red" }}>Error loading teams</p>
                    ) : (
                        <TextField
                            select
                            label="Team"
                            value={formData.assignedTeam.id || ""}
                            onChange={(e) => handleTeamSelect(Number(e.target.value))}
                            required
                        >
                            {teams.map((team: Team) => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    <TextField
                        select
                        label="Status"
                        value={formData.status}
                        onChange={(e) => handleChange("status", e.target.value as TicketStatus)}
                    >
                        {Object.values(TicketStatus).map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Priority"
                        value={formData.priority}
                        onChange={(e) => handleChange("priority", e.target.value as Priority)}
                    >
                        {Object.values(Priority).map((priority) => (
                            <MenuItem key={priority} value={priority}>
                                {priority}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    {isEdit ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTicketModal;