import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider,
  Button,
  Grid
} from '@mui/material';

import { formatCurrency } from '../theme';

const XeroProfitLossReport = ({ sales = [], expenses = [], invoices = [], trips = [], employees = [], period = 'Current Month' }) => {
  // Calculate revenue from all sources
  const salesRevenue = sales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount) || 0), 0);
  const invoiceRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + (parseFloat(invoice.amount_paid) || 0), 0);
  const logisticsRevenue = trips.reduce((sum, trip) => sum + (parseFloat(trip.amount_charged) || 0), 0);
  const totalRevenue = salesRevenue + invoiceRevenue + logisticsRevenue;
  
  // Calculate expenses by actual categories from database
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other Expenses';
    acc[category] = (acc[category] || 0) + (parseFloat(expense.amount) || 0);
    return acc;
  }, {});
  
  // Add payroll expenses
  const monthlyPayroll = employees
    .filter(emp => emp.is_active !== false)
    .reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
  
  if (monthlyPayroll > 0) {
    expensesByCategory['Salaries & Wages'] = monthlyPayroll;
  }

  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  const grossProfit = totalRevenue;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Profit and Loss
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {period} • kabisakabisa enterprise
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">
              Print
            </Button>
            <Button variant="outlined" size="small">
              Export
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ '& .MuiTableCell-root': { border: '1px solid rgba(224, 224, 224, 1)', px: { xs: 1, sm: 2 } } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>Account</TableCell>
                <TableCell align="right" sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Revenue Section */}
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>REVENUE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Sales Revenue</TableCell>
                <TableCell align="right">{formatCurrency(salesRevenue)}</TableCell>
              </TableRow>
              {invoiceRevenue > 0 && (
                <TableRow>
                  <TableCell sx={{ pl: 3 }}>Invoice Revenue</TableCell>
                  <TableCell align="right">{formatCurrency(invoiceRevenue)}</TableCell>
                </TableRow>
              )}
              {logisticsRevenue > 0 && (
                <TableRow>
                  <TableCell sx={{ pl: 3 }}>Logistics Revenue</TableCell>
                  <TableCell align="right">{formatCurrency(logisticsRevenue)}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Total Revenue</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, borderTop: 1, borderColor: 'divider' }}>
                  {formatCurrency(totalRevenue)}
                </TableCell>
              </TableRow>

              {/* Gross Profit */}
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>
                  GROSS PROFIT
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>
                  {formatCurrency(grossProfit)}
                </TableCell>
              </TableRow>

              {/* Expenses Section */}
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>EXPENSES</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}></TableCell>
              </TableRow>
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <TableRow key={category}>
                  <TableCell sx={{ pl: 3, textTransform: 'capitalize' }}>
                    {category}
                  </TableCell>
                  <TableCell align="right">{formatCurrency(amount)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Total Expenses</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, borderTop: 1, borderColor: 'divider' }}>
                  {formatCurrency(totalExpenses)}
                </TableCell>
              </TableRow>

              {/* Net Profit */}
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  color: netProfit >= 0 ? 'success.main' : 'error.main',
                  py: 2,
                  borderTop: 2,
                  borderColor: 'divider'
                }}>
                  NET PROFIT
                </TableCell>
                <TableCell align="right" sx={{ 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  color: netProfit >= 0 ? 'success.main' : 'error.main',
                  py: 2,
                  borderTop: 2,
                  borderColor: 'divider'
                }}>
                  {formatCurrency(netProfit)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 3 }} />

        {/* Summary Metrics */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2" color="success.dark">Gross Profit Margin</Typography>
              <Typography variant="h5" color="success.dark" fontWeight={700}>
                {totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2" color="primary.dark">Net Profit Margin</Typography>
              <Typography variant="h5" color="primary.dark" fontWeight={700}>
                {profitMargin.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" color="info.dark">Expense Ratio</Typography>
              <Typography variant="h5" color="info.dark" fontWeight={700}>
                {totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default XeroProfitLossReport;