import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Grid,
  Alert,
  LinearProgress
} from '@mui/material';
import { Refresh, Download, Visibility } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { formatCurrency } from '../theme';

const DataManagementPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tables = [
    'Branches', 'Employees', 'Stock', 'Stock_Movements', 'Sales', 'Sale_Items',
    'Expenses', 'Vehicles', 'Trips', 'Vehicle_Maintenance', 'Orders', 'Order_Items',
    'Payroll', 'Invoices', 'Invoice_Items', 'Chart_of_Accounts', 'Documents'
  ];

  // Fetch data for all tables
  const tableQueries = tables.map(table => 
    useQuery(
      `data-${table.toLowerCase()}`,
      () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/${table}`)
        .then(res => res.ok ? res.json() : []).catch(() => []),
      { refetchInterval: 30000, retry: false }
    )
  );

  const isLoading = tableQueries.some(query => query.isLoading);
  const currentTableData = tableQueries[activeTab]?.data || [];

  const renderTableContent = (data, tableName) => {
    if (!data || data.length === 0) {
      return (
        <Alert severity="info">
          No data available in {tableName} table
        </Alert>
      );
    }

    const columns = Object.keys(data[0] || {});
    
    return (
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { border: '1px solid rgba(224, 224, 224, 1)', px: { xs: 1, sm: 2 } } }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>
                  {column.replace(/_/g, ' ').toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, 100).map((row, index) => (
              <TableRow key={row.id || index}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {renderCellValue(row[column], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderCellValue = (value, column) => {
    if (value === null || value === undefined) return '-';
    
    // Handle currency fields
    if (column.includes('amount') || column.includes('price') || column.includes('salary') || column.includes('cost')) {
      return formatCurrency(parseFloat(value) || 0);
    }
    
    // Handle dates
    if (column.includes('date') || column.includes('_at')) {
      return new Date(value).toLocaleDateString();
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return (
        <Chip 
          label={value ? 'Yes' : 'No'} 
          color={value ? 'success' : 'default'} 
          size="small" 
        />
      );
    }
    
    // Handle arrays (Airtable links)
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    // Handle status fields
    if (column === 'status') {
      const statusColors = {
        active: 'success',
        inactive: 'default',
        pending: 'warning',
        completed: 'success',
        cancelled: 'error',
        paid: 'success',
        unpaid: 'error'
      };
      return (
        <Chip 
          label={value} 
          color={statusColors[value?.toLowerCase()] || 'default'} 
          size="small" 
        />
      );
    }
    
    return String(value);
  };

  const exportTableData = (tableName, data) => {
    if (!data || data.length === 0) return;
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => 
        typeof val === 'string' ? `"${val}"` : val
      ).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Database Management
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        View and manage all database tables
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Tables</Typography>
              <Typography variant="h5">{tables.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Current Table</Typography>
              <Typography variant="h6">{tables[activeTab]}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Records</Typography>
              <Typography variant="h5">{currentTableData.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Typography variant="h6" color={isLoading ? 'warning.main' : 'success.main'}>
                {isLoading ? 'Loading' : 'Ready'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => tableQueries[activeTab]?.refetch()}
        >
          Refresh Data
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => exportTableData(tables[activeTab], currentTableData)}
          disabled={currentTableData.length === 0}
        >
          Export CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<Visibility />}
          onClick={() => window.open('/admin', '_blank')}
        >
          Admin Panel
        </Button>
      </Box>

      {isLoading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Table Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tables.map((table, index) => (
            <Tab 
              key={table} 
              label={`${table} (${tableQueries[index]?.data?.length || 0})`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Table Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {tables[activeTab]} Table
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {Math.min(currentTableData.length, 100)} of {currentTableData.length} records
            </Typography>
          </Box>
          
          {renderTableContent(currentTableData, tables[activeTab])}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DataManagementPage;