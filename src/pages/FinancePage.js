import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Receipt,
  Payment,
  Assessment,
  PieChart,
  Print,
  GetApp,
  Add,
  CheckCircle,
  Schedule,
  AttachMoney
} from '@mui/icons-material';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../theme';

const FinancePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Fetch all financial data
  const { data: sales = [] } = useQuery(
    'sales-finance',
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/Sales`)
      .then(res => res.ok ? res.json() : []).catch(() => []),
    { retry: false }
  );

  const { data: expenses = [] } = useQuery(
    'expenses-finance',
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/Expenses`)
      .then(res => res.ok ? res.json() : []).catch(() => []),
    { retry: false }
  );

  const { data: orders = [] } = useQuery(
    'orders-finance',
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/Orders`)
      .then(res => res.ok ? res.json() : []).catch(() => []),
    { retry: false }
  );

  const { data: payroll = [] } = useQuery(
    'payroll-finance',
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/Payroll`)
      .then(res => res.ok ? res.json() : []).catch(() => []),
    { retry: false }
  );

  // Calculate financial metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalCOGS = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalPayroll = payroll.reduce((sum, pay) => sum + (pay.gross_pay || 0), 0);
  
  const grossProfit = totalRevenue - totalCOGS;
  const netProfit = grossProfit - totalExpenses - totalPayroll;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Pie chart data
  const expenseBreakdown = [
    { name: 'Operating Expenses', value: totalExpenses, color: '#ff6b6b' },
    { name: 'Cost of Goods', value: totalCOGS, color: '#4ecdc4' },
    { name: 'Payroll', value: totalPayroll, color: '#45b7d1' },
    { name: 'Net Profit', value: Math.max(0, netProfit), color: '#96ceb4' }
  ];

  // Recent transactions
  const recentTransactions = [
    ...sales.slice(-5).map(s => ({ ...s, type: 'Income', amount: s.total_amount, date: s.sale_date })),
    ...expenses.slice(-5).map(e => ({ ...e, type: 'Expense', amount: -e.amount, date: e.expense_date }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  // Outstanding invoices (unpaid orders)
  const outstandingInvoices = orders.filter(order => (order.total_amount || 0) > (order.amount_paid || 0));
  const totalOutstanding = outstandingInvoices.reduce((sum, order) => sum + ((order.total_amount || 0) - (order.amount_paid || 0)), 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalance />
          Financial Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Print />}>Print Report</Button>
          <Button variant="outlined" startIcon={<GetApp />}>Export</Button>
          <Button variant="contained" startIcon={<Add />}>New Transaction</Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {formatCurrency(totalRevenue)}
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Net Profit
                  </Typography>
                  <Typography variant="h5" color={netProfit >= 0 ? 'success.main' : 'error.main'}>
                    {formatCurrency(netProfit)}
                  </Typography>
                </Box>
                {netProfit >= 0 ? 
                  <TrendingUp color="success" sx={{ fontSize: 40 }} /> :
                  <TrendingDown color="error" sx={{ fontSize: 40 }} />
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Outstanding
                  </Typography>
                  <Typography variant="h5" color="warning.main">
                    {formatCurrency(totalOutstanding)}
                  </Typography>
                </Box>
                <Schedule color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Profit Margin
                  </Typography>
                  <Typography variant="h5" color={profitMargin >= 0 ? 'success.main' : 'error.main'}>
                    {profitMargin.toFixed(1)}%
                  </Typography>
                </Box>
                <Assessment color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Dashboard" />
          <Tab label="Transactions" />
          <Tab label="Invoices" />
          <Tab label="Reports" />
          <Tab label="Accounts" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Financial Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Transactions
                </Typography>
                <List>
                  {recentTransactions.slice(0, 8).map((transaction, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {transaction.type === 'Income' ? 
                          <TrendingUp color="success" /> : 
                          <TrendingDown color="error" />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.customer_name || transaction.description || 'Transaction'}
                        secondary={new Date(transaction.date).toLocaleDateString()}
                      />
                      <Typography 
                        variant="body2" 
                        color={transaction.amount >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(Math.abs(transaction.amount))}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">All Transactions</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Box>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.customer_name || transaction.description || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.type} 
                          color={transaction.type === 'Income' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: transaction.amount >= 0 ? 'success.main' : 'error.main' }}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </TableCell>
                      <TableCell>
                        <Chip label="Completed" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Outstanding Invoices
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell align="right">Total Amount</TableCell>
                    <TableCell align="right">Amount Paid</TableCell>
                    <TableCell align="right">Outstanding</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {outstandingInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.supplier_name || 'N/A'}</TableCell>
                      <TableCell>{new Date(invoice.order_date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{formatCurrency(invoice.total_amount || 0)}</TableCell>
                      <TableCell align="right">{formatCurrency(invoice.amount_paid || 0)}</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main' }}>
                        {formatCurrency((invoice.total_amount || 0) - (invoice.amount_paid || 0))}
                      </TableCell>
                      <TableCell>
                        <Chip label={invoice.status || 'Pending'} color="warning" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profit & Loss Statement
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="success.main">Revenue</Typography>
                  <Typography variant="body2">Total Sales: {formatCurrency(totalRevenue)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="error.main">Expenses</Typography>
                  <Typography variant="body2">Cost of Goods: {formatCurrency(totalCOGS)}</Typography>
                  <Typography variant="body2">Operating Expenses: {formatCurrency(totalExpenses)}</Typography>
                  <Typography variant="body2">Payroll: {formatCurrency(totalPayroll)}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="h6" color={netProfit >= 0 ? 'success.main' : 'error.main'}>
                    Net Profit: {formatCurrency(netProfit)}
                  </Typography>
                  <Typography variant="body2">
                    Profit Margin: {profitMargin.toFixed(2)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cash Flow Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">Cash In: {formatCurrency(totalRevenue)}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">Cash Out: {formatCurrency(totalExpenses + totalCOGS + totalPayroll)}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">Outstanding Receivables: {formatCurrency(totalOutstanding)}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" color={netProfit >= 0 ? 'success.main' : 'error.main'}>
                  Net Cash Flow: {formatCurrency(netProfit)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Chart of Accounts
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Assets</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><AttachMoney /></ListItemIcon>
                    <ListItemText primary="Cash & Bank" secondary={formatCurrency(netProfit)} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Receipt /></ListItemIcon>
                    <ListItemText primary="Accounts Receivable" secondary={formatCurrency(totalOutstanding)} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Liabilities & Equity</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Payment /></ListItemIcon>
                    <ListItemText primary="Accounts Payable" secondary={formatCurrency(totalOutstanding)} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle /></ListItemIcon>
                    <ListItemText primary="Owner's Equity" secondary={formatCurrency(Math.max(0, netProfit))} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default FinancePage;