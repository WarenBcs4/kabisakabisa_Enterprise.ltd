import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import { Add, Refresh, GetApp } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { genericDataAPI } from '../services/api';
import { getTableConfig, getAvailableTables } from '../utils/tableConfigs';
import DataTable from '../components/DataTable';
import toast from 'react-hot-toast';

const DataManagementPage = () => {
  const queryClient = useQueryClient();
  const [selectedTable, setSelectedTable] = useState('Employees');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({});

  const tableConfig = getTableConfig(selectedTable);
  const availableTables = getAvailableTables();

  // Queries
  const { data: tableData = [], isLoading, error } = useQuery(
    ['tableData', selectedTable],
    () => genericDataAPI.getAll(selectedTable),
    { enabled: !!selectedTable }
  );

  // Mutations
  const createMutation = useMutation(
    (data) => genericDataAPI.create(selectedTable, data),
    {
      onSuccess: () => {
        toast.success('Record created successfully!');
        setShowAddDialog(false);
        setFormData({});
        queryClient.invalidateQueries(['tableData', selectedTable]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create record');
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => genericDataAPI.update(selectedTable, id, data),
    {
      onSuccess: () => {
        toast.success('Record updated successfully!');
        setEditingRecord(null);
        setFormData({});
        queryClient.invalidateQueries(['tableData', selectedTable]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update record');
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => genericDataAPI.delete(selectedTable, id),
    {
      onSuccess: () => {
        toast.success('Record deleted successfully!');
        queryClient.invalidateQueries(['tableData', selectedTable]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete record');
      }
    }
  );

  const handleTableChange = (tableName) => {
    setSelectedTable(tableName);
    setFormData({});
    setEditingRecord(null);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setFormData({});
    setShowAddDialog(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData(record);
    setShowAddDialog(true);
  };

  const handleDelete = (record) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(record.id);
    }
  };

  const handleSubmit = () => {
    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(['tableData', selectedTable]);
  };

  const handleExport = () => {
    // Convert data to CSV
    const headers = tableConfig.columns.map(col => col.headerName).join(',');
    const rows = tableData.map(row => 
      tableConfig.columns.map(col => row[col.field] || '').join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderFormField = (column) => {
    const value = formData[column.field] || '';
    
    switch (column.type) {
      case 'boolean':
        return (
          <FormControl fullWidth margin="normal" key={column.field}>
            <InputLabel>{column.headerName}</InputLabel>
            <Select
              value={value}
              onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.value }))}
              label={column.headerName}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        );
      
      case 'date':
        return (
          <TextField
            key={column.field}
            fullWidth
            label={column.headerName}
            type="date"
            margin="normal"
            value={value ? value.split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        );
      
      case 'currency':
        return (
          <TextField
            key={column.field}
            fullWidth
            label={column.headerName}
            type="number"
            step="0.01"
            margin="normal"
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: parseFloat(e.target.value) || 0 }))}
          />
        );
      
      case 'status':
        const statusOptions = ['active', 'inactive', 'pending', 'completed', 'cancelled'];
        return (
          <FormControl fullWidth margin="normal" key={column.field}>
            <InputLabel>{column.headerName}</InputLabel>
            <Select
              value={value}
              onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.value }))}
              label={column.headerName}
            >
              {statusOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      default:
        return (
          <TextField
            key={column.field}
            fullWidth
            label={column.headerName}
            margin="normal"
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.value }))}
            multiline={column.field.includes('description') || column.field.includes('address')}
            rows={column.field.includes('description') || column.field.includes('address') ? 3 : 1}
          />
        );
    }
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">Error loading data: {error.message}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" gutterBottom>
        Data Management
      </Typography>

      {/* Table Selection and Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Table</InputLabel>
          <Select
            value={selectedTable}
            onChange={(e) => handleTableChange(e.target.value)}
            label="Select Table"
          >
            {availableTables.map(table => (
              <MenuItem key={table} value={table}>{table}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Record
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      {/* Data Table */}
      <DataTable
        data={tableData}
        columns={tableConfig.columns}
        title={tableConfig.title}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchable={true}
        filterable={true}
        paginated={true}
        dense={false}
      />

      {/* Add/Edit Dialog */}
      <Dialog 
        open={showAddDialog} 
        onClose={() => setShowAddDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {editingRecord ? 'Edit Record' : 'Add New Record'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {tableConfig.columns
                .filter(col => !['id', 'created_at', 'updated_at'].includes(col.field))
                .map(column => (
                  <Grid item xs={12} sm={6} key={column.field}>
                    {renderFormField(column)}
                  </Grid>
                ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {editingRecord ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataManagementPage;