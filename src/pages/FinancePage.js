import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Assessment,
  Receipt,
  Payment,
  Business,
  PieChart,
  BarChart,
  Timeline,
  Download,
  Print,
  Share,
  MoreVert,
  Add,
  Refresh
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { salesAPI, expensesAPI, branchesAPI, ordersAPI } from '../services/api';
import { formatCurrency } from '../theme';

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [anchorEl, setAnchorEl] = useState(null);

  // Data queries
  const { data: branches = [] } = useQuery('branches', () => branchesAPI.getAll());
  const { data: salesData = [], isLoading: salesLoading } = useQuery(
    ['salesData', dateRange],
    () => Promise.all(branches.map(branch => 
      salesAPI.getByBranch(branch.id, dateRange).catch(() => [])
    )).then(results => results.flat()),
    { enabled: branches.length > 0 }
  );
  const { data: expensesData = [] } = useQuery(
    ['expensesData', dateRange],
    () => expensesAPI.getAll(dateRange)
  );
  const { data: ordersData = [] } = useQuery(
    ['ordersData'],
    () => ordersAPI.getAll().catch(() => [])
  );

  // Financial calculations
  const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const totalExpenses = expensesData.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;
  const totalOrders = ordersData.length;
  const pendingPayments = ordersData.reduce((sum, order) => sum + (order.balance_remaining || 0), 0);

  // Cash flow data (last 6 months)
  const cashFlowData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().slice(0, 7);
    
    const monthRevenue = salesData
      .filter(sale => sale.sale_date?.startsWith(monthStr))
      .reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    
    const monthExpenses = expensesData
      .filter(expense => expense.expense_date?.startsWith(monthStr))
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: monthRevenue,
      expenses: monthExpenses,
      profit: monthRevenue - monthExpenses
    };
  }).reverse();

  // Top expenses
  const topExpenses = expensesData
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 5);

  // Branch performance
  const branchPerformance = branches.map(branch => {
    const branchSales = salesData.filter(sale => 
      sale.branch_id === branch.id || (Array.isArray(sale.branch_id) && sale.branch_id.includes(branch.id))
    );
    const revenue = branchSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    return {
      name: branch.branch_name || branch.name,
      revenue,
      salesCount: branchSales.length,
      percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  if (salesLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h4">Financial Dashboard</Typography>
          <LinearProgress sx={{ flexGrow: 1, ml: 2 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Financial Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Add />} variant="contained" size="small">
            New Transaction
          </Button>
          <Button startIcon={<Refresh />} variant="outlined" size="small">
            Refresh
          </Button>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>
              <Download sx={{ mr: 1 }} /> Export Data
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Print sx={{ mr: 1 }} /> Print Report
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Share sx={{ mr: 1 }} /> Share
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Date Range Filter */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Period:</Typography>
          <TextField
            label="From"
            type="date"
            size="small"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="outlined" size="small">Apply</Button>
        </Box>
      </Card>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Revenue</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    +12.5% from last month
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Expenses</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {formatCurrency(totalExpenses)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    -3.2% from last month
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Net Profit</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {formatCurrency(netProfit)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Margin: {profitMargin.toFixed(1)}%
                  </Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Pending Payments</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {formatCurrency(pendingPayments)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    {totalOrders} orders
                  </Typography>
                </Box>
                <Payment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<BarChart />} label="Cash Flow" />
            <Tab icon={<PieChart />} label="Branch Performance" />
            <Tab icon={<Receipt />} label="Expense Analysis" />
            <Tab icon={<Timeline />} label="Trends" />
          </Tabs>
        </Box>

        {/* Cash Flow Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>6-Month Cash Flow</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Expenses</TableCell>
                      <TableCell align="right">Net Profit</TableCell>
                      <TableCell align="right">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cashFlowData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell align="right">{formatCurrency(item.revenue)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.expenses)}</TableCell>
                        <TableCell align="right">
                          <Typography color={item.profit >= 0 ? 'success.main' : 'error.main'}>
                            {formatCurrency(item.profit)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {item.profit >= 0 ? 
                            <TrendingUp color="success" /> : 
                            <TrendingDown color="error" />
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Quick Stats</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Assessment /></ListItemIcon>
                  <ListItemText 
                    primary="Average Monthly Revenue" 
                    secondary={formatCurrency(totalRevenue / 6)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Receipt /></ListItemIcon>
                  <ListItemText 
                    primary="Average Monthly Expenses" 
                    secondary={formatCurrency(totalExpenses / 6)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TrendingUp /></ListItemIcon>
                  <ListItemText 
                    primary="Best Month" 
                    secondary={cashFlowData.reduce((best, current) => 
                      current.profit > best.profit ? current : best
                    ).month}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Branch Performance Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>Revenue by Branch</Typography>
          <Grid container spacing={3}>
            {branchPerformance.map((branch, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{branch.name}</Typography>
                      <Business color="primary" />
                    </Box>
                    <Typography variant="h4" color="primary.main" gutterBottom>
                      {formatCurrency(branch.revenue)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Sales: {branch.salesCount}</Typography>
                      <Typography variant="body2">{branch.percentage.toFixed(1)}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={branch.percentage} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Expense Analysis Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Top Expenses</Typography>
              <List>
                {topExpenses.map((expense, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={expense.description || 'Expense'}
                      secondary={`${expense.category || 'Other'} • ${expense.expense_date}`}
                    />
                    <Typography variant="h6" color="error.main">
                      {formatCurrency(expense.amount)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Expense Categories</Typography>
              {Object.entries(
                expensesData.reduce((acc, expense) => {
                  const category = expense.category || 'Other';
                  acc[category] = (acc[category] || 0) + (expense.amount || 0);
                  return acc;
                }, {})
              ).map(([category, amount]) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">{category}</Typography>
                    <Typography variant="body1">{formatCurrency(amount)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(amount / totalExpenses) * 100} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Trends Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>Financial Trends & Insights</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Revenue Trend</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp color="success" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" color="success.main">+12.5%</Typography>
                      <Typography variant="body2">vs last period</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Expense Trend</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingDown color="success" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" color="success.main">-3.2%</Typography>
                      <Typography variant="body2">vs last period</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Container>
  );
};

export default FinancePage;