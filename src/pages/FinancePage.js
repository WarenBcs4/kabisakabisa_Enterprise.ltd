import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useQuery } from 'react-query';
import { genericDataAPI } from '../services/api';
import { formatCurrency } from '../theme';

const FinancePage = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());

  const formatDate = (date) => date.toISOString().split('T')[0];

  // Fetch financial data
  const { data: trips = [] } = useQuery('trips', () => genericDataAPI.getAll('Trips'));
  const { data: maintenance = [] } = useQuery('maintenance', () => genericDataAPI.getAll('Vehicle_Maintenance'));
  const { data: sales = [] } = useQuery('sales', () => genericDataAPI.getAll('Sales'));

  // Filter data by date range
  const filteredTrips = trips.filter(trip => {
    const tripDate = new Date(trip.trip_date);
    return tripDate >= startDate && tripDate <= endDate;
  });

  const filteredMaintenance = maintenance.filter(m => {
    const maintenanceDate = new Date(m.maintenance_date);
    return maintenanceDate >= startDate && maintenanceDate <= endDate;
  });

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date || sale.created_at);
    return saleDate >= startDate && saleDate <= endDate;
  });

  // Calculate totals
  const logisticsRevenue = filteredTrips.reduce((sum, trip) => sum + (parseFloat(trip.amount_charged) || 0), 0);
  const fuelExpenses = filteredTrips.reduce((sum, trip) => sum + (parseFloat(trip.fuel_cost) || 0), 0);
  const maintenanceExpenses = filteredMaintenance.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
  const salesRevenue = filteredSales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount) || 0), 0);

  const totalRevenue = logisticsRevenue + salesRevenue;
  const totalExpenses = fuelExpenses + maintenanceExpenses;
  const netProfit = totalRevenue - totalExpenses;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Financial Overview
        </Typography>

        {/* Date Range Selector */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setStartDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
                    setEndDate(new Date());
                  }}
                >
                  Reset to Current Month
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h5" color="success.main">
                  {formatCurrency(totalRevenue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h5" color="error.main">
                  {formatCurrency(totalExpenses)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Net Profit
                </Typography>
                <Typography variant="h5" color={netProfit >= 0 ? "success.main" : "error.main"}>
                  {formatCurrency(netProfit)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Profit Margin
                </Typography>
                <Typography variant="h5">
                  {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Revenue Breakdown */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Breakdown
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Source</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Logistics Revenue</TableCell>
                        <TableCell align="right">{formatCurrency(logisticsRevenue)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sales Revenue</TableCell>
                        <TableCell align="right">{formatCurrency(salesRevenue)}</TableCell>
                      </TableRow>
                      <TableRow sx={{ fontWeight: 'bold' }}>
                        <TableCell><strong>Total Revenue</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(totalRevenue)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expense Breakdown
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Fuel Expenses</TableCell>
                        <TableCell align="right">{formatCurrency(fuelExpenses)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maintenance Expenses</TableCell>
                        <TableCell align="right">{formatCurrency(maintenanceExpenses)}</TableCell>
                      </TableRow>
                      <TableRow sx={{ fontWeight: 'bold' }}>
                        <TableCell><strong>Total Expenses</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(totalExpenses)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default FinancePage;