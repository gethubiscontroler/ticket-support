import * as React from 'react';
import { DataGrid, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, IconButton, Typography, Chip, Box, Fab, CircularProgress } from "@mui/material";
import { Team } from '../../model/team';
import { TicketStatus } from '../../enum/TicketStatus';
import { Priority } from '../../enum/Priority';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStatusColor } from '../../constants/StatusColor';
import { getPriorityColor } from '../../constants/PriorityColor';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CreateTicketModal from '../modal/CreateTicketModal';
import { useTickets } from '../../hooks/useTickets';
import { NotificationDataType } from './NotificationDataType';
import { NotificationType } from '../../enum/NotificationType';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationListProps {
    onTicketDelete?: (deletedIds: number[]) => void;
    onTicketEdit?: (ticket: NotificationDataType) => void;
}

interface NotificationRow {
    id?: number; // Optional for new tickets
    message: string;
    type: NotificationType;
    readed: string;
    recipient: {
        id: number;
        name: string;
        email: string;
    };
    dateSent: Date; // ISO date string format (YYYY-MM-DD)
}

const NotificationList = ({ }: NotificationListProps) => {
    const [open, setOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<NotificationRow | null>(null);
    const [openEdit, setOpenEdit] = React.useState(false);

    // Use the updated hook with pagination
    const {
        notifications,
        loading,
        error,
        totalCount,
        currentPage,
        pageSize,
        goToPage,
        changePageSize,
    } = useNotifications();

    // Handle pagination change from DataGrid
    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        if (newPaginationModel.page !== currentPage - 1) {
            goToPage(newPaginationModel.page + 1); // Convert 0-based to 1-based
        }
        if (newPaginationModel.pageSize !== pageSize) {
            changePageSize(newPaginationModel.pageSize);
        }
    };

    const columns = [
        {
            field: "message",
            headerName: "Message",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip title={params.value}>
                    <span>{params.value}</span>
                </Tooltip>
            )
        },
        {
            field: "type",
            headerName: "Type",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    color={getStatusColor(params.value)}
                    size="small"
                    variant="filled"
                />
            )
        },
        {
            field: "recipient",
            headerName: "Creé Par",
            width: 150,
            valueGetter: (params) => params?.name || '',
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip title={`${params.row.recipient?.name} (${params.row.recipient?.email})`}>
                    <span>{params.row.recipient?.name}</span>
                </Tooltip>
            )
        },
        {
            field: "dateSent",
            headerName: "Date d'envoie",
            width: 150,
            valueGetter: (params) => params ? new Date(params).toLocaleDateString() : '',
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewClick(params.row)}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const handleViewClick = (row: NotificationRow) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };


    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                columns={columns}
                rows={notifications}
                rowCount={totalCount}
                loading={loading}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={{
                    page: currentPage - 1, // Convert 1-based to 0-based for DataGrid
                    pageSize: pageSize
                }}
                paginationMode="server"
                onPaginationModelChange={handlePaginationModelChange}
                disableRowSelectionOnClick
                getRowId={(row) => row.id || `temp-${Date.now()}-${Math.random()}`}
                sx={{
                    '& .MuiDataGrid-main': {
                        '& .MuiDataGrid-overlayWrapper': {
                            minHeight: 52,
                        },
                    },
                }}
            />

            {/* Modal/Dialog for viewing ticket details */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Row Details</DialogTitle>
                <DialogContent dividers>
                    {selectedRow && (
                        <div>
                            <p><b>Titre:</b> {selectedRow.type}</p>
                            <p><b>Nom:</b> {selectedRow.recipient.name}</p>
                            <p><b>Email:</b> {selectedRow.message}</p>
                            <p><b>Description:</b> {selectedRow.readed}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default NotificationList;