import * as React from 'react';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, IconButton, Typography, Chip, Box, Fab } from "@mui/material";
import { TeamDataType } from './TeamDataType';
import { Team } from '../../model/team';
import { Priority } from '../../enum/Priority';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStatusColor } from '../../constants/StatusColor';
import { getPriorityColor } from '../../constants/PriorityColor';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CreateTicketModal from '../modal/CreateTicketModal';
import CreateTeamModal from '../modal/CreateTeamModal';

interface TeamListProps {
    teamList: TeamDataType[];
    onTeamDelete?: (deletedIds: number[]) => void;
    onTeamEdit?: (team: TeamDataType) => void;
}

interface TeamRow {
    id: number;
    name: string;
    description: string;
}

const TeamtList = ({ teamList }: TeamListProps) => {

    const [open, setOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<TeamRow | null>(null);
    const columns = [
        {
            field: "name",
            headerName: "Nom d'équipe",
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip title={params.value}>
                    {params.value}
                </Tooltip>
            )
        },
        {
            field: "description",
            headerName: "Description",
            width: 300,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip title={params.value}>
                    {params.value}
                </Tooltip>
            )
        }
    ];

    const handleViewClick = (row: TeamRow) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleEditClick = (row: TeamRow) => {
        // if (onTicketEdit) {
        //   onTicketEdit(row as TicketDataType);
        // }
        // You could also open a different modal for editing
        console.log('Edit ticket:', row);
    };

    const handleDeleteSingle = (id: number) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            const newRows = rows.filter((row) => row.id !== id);
            setRows(newRows);
            // if (onTicketDelete) {
            //   onTicketDelete([id]);
            // }
        }
    };

    const handleRowClick = (row: any) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };

    const [rows, setRows] = React.useState<TeamDataType[]>(teamList);
    const [selectionModel, setSelectionModel] = React.useState<number[]>([]);

    const handleDelete = () => {
        setRows((ticketList) => ticketList.filter((row) => !selectionModel.includes(row.id as number)));
        setSelectionModel([]); // reset selection after delete
    };

    const [openCreate, setOpenCreate] = React.useState(false);
    const [newTeam, setNewTeam] = React.useState<TeamRow>({
        id: 0, // temporary ID
        name: "",
        description: ""
    });

    const handleCreateTeam = (newTeam: TeamDataType) => {
        setRows((prev) => [...prev, newTeam]);
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <div style={{ marginBottom: 10 }}>
            </div>
            <DataGrid
                columns={columns}
                rows={teamList}
                // onRowClick={handleRowClick}
                disableRowSelectionOnClick
            />
            {/* Modal/Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Row Details</DialogTitle>
                <DialogContent dividers>
                    {selectedRow && (
                        <div>
                            <p><b>Nom:</b> {selectedRow.name}</p>
                            <p><b>Description:</b> {selectedRow.description}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <CreateTeamModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSave={handleCreateTeam}
            />
        </div>
    );
};

export default TeamtList;
