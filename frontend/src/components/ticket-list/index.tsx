import * as React from 'react';
import { DataGrid, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, IconButton, Typography, Chip, Box, Fab, CircularProgress } from "@mui/material";
import { TicketDataType } from './TicketDataType';
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
import { CreateTicketRequest } from '../../model/ticket';

interface TicketListProps {
  onTicketDelete?: (deletedIds: number[]) => void;
  onTicketEdit?: (ticket: TicketDataType) => void;
}

interface TicketRow {
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  id: number;
  title: string;
  creationDate: Date;
  status: TicketStatus;
  priority: Priority;
  description: string;
  assignedTeam: Team;
}

const TicketList = ({ }: TicketListProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<TicketRow | null>(null);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [ticketToEdit, setTicketToEdit] = React.useState<TicketDataType | null>(null);
  const [openCreate, setOpenCreate] = React.useState(false);

  // Use the updated hook with pagination
  const {
    tickets,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    goToPage,
    changePageSize,
    createTicket,
    updateTicket,
    deleteTicket,
    refreshTickets
  } = useTickets();

  // Handle pagination change from DataGrid
  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    console.log('handlePaginationModelChange ',newPaginationModel)
    if (newPaginationModel.page !== currentPage - 1) {
       console.log('handlePaginationModelChange ',newPaginationModel.page + 1)
      goToPage(newPaginationModel.page + 1); // Convert 0-based to 1-based
    }
    if (newPaginationModel.pageSize !== pageSize) {
      changePageSize(newPaginationModel.pageSize);
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
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
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={getPriorityColor(params.value)}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: "createdBy",
      headerName: "Creé Par",
      width: 120,
      valueGetter: (params) => params?.name || '',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={`${params.row.createdBy?.name} (${params.row.createdBy?.email})`}>
          <span>{params.row.createdBy?.name}</span>
        </Tooltip>
      )
    },
    {
      field: "assignedTeam",
      headerName: "Equipe",
      width: 100,
      valueGetter: (params) => params?.name || '',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={`${params.row.assignedTeam?.name}`}>
          <span>{params.row.assignedTeam?.name}</span>
        </Tooltip>
      )
    },
    {
      field: "creationDate",
      headerName: "Creation Date",
      width: 120,
      valueGetter: (params) => params ? new Date(params).toLocaleDateString() : '',
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
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
          <Tooltip title="Edit Ticket">
            <IconButton
              size="small"
              color="success"
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Ticket">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteSingle(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleViewClick = (row: TicketRow) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleEditClick = (row: TicketRow) => {
    setTicketToEdit(row as TicketDataType);
    setOpenEdit(true);
  };

  const handleUpdateTicket = async (updatedTicket: TicketDataType) => {
    try {
      await updateTicket(updatedTicket.id || 0, updatedTicket);
      setOpenEdit(false);
      setTicketToEdit(null);
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Error updating ticket. Please try again.');
    }
  };

  const handleDeleteSingle = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(id);
      } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('Error deleting ticket. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleCreateTicket = async (newTicket: TicketDataType) => {
    if (!newTicket) {
      alert('Error: Invalid ticket data received');
      return;
    }

    try {
      const ticketRequest: CreateTicketRequest = {
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        status: newTicket.status,
        createdBy: { id: newTicket.createdBy.id },
        assignedTeam: {
          id: newTicket.assignedTeam.id,
          name: newTicket.assignedTeam.name
        },
        creationDate: new Date()
      };
      await createTicket(ticketRequest);
      setOpenCreate(false);
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket. Please try again.');
    }
  };

  // Show error state
  if (error) {
    return (
      <div style={{ height: 500, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">
          Error loading tickets: {error}
          <Button onClick={refreshTickets} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Typography>
      </div>
    );
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <div style={{ marginBottom: 10 }}>
        <Tooltip title="Crée un Nouveau Ticket">
          <Fab
            sx={{ backgroundColor: "#7c8cff", color: "#fff" }}
            aria-label="add"
            onClick={() => setOpenCreate(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </div>

      <DataGrid
        columns={columns}
        rows={tickets}
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
              <p><b>Titre:</b> {selectedRow.title}</p>
              <p><b>Nom:</b> {selectedRow.createdBy?.name}</p>
              <p><b>Email:</b> {selectedRow.createdBy?.email}</p>
              <p><b>Description:</b> {selectedRow.description}</p>
              <p><b>Date de Création:</b> {selectedRow.creationDate?.toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreateTicket}
      />

      {/* Edit Ticket Modal */}
      <CreateTicketModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setTicketToEdit(null);
        }}
        onSave={handleUpdateTicket}
        initialData={ticketToEdit || undefined}
        isEdit
      />
    </div>
  );
};

export default TicketList;