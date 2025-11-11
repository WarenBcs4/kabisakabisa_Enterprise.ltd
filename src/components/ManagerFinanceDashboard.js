import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { TrendingUp, TrendingDown, Assessment } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { formatCurrency } from '../theme';

const ManagerFinanceDashboard = () => {
  // Fetch all required data (read-only for manager)
  const { data: sales = [] } = useQuery(
    'sales-manager-finance',
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/Sales`)
      .then(res => res.ok ? res.json() : []).catch(() => []),
    { retry: false }
  );

  const { data: saleItems = [] } = useQuery(
    'sale-items-manager-finance',
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/Sale_Items`)
      .then(res => res.ok ? res.json() : []).catch(() => []),
    { retry: false }
  );

  const { data: stock = [] } = useQuery(
    'stock-manager-finance',
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/Stock`)
      .then(res => res.ok ? res.json() : []).catch(() => []),
    { retry: false }
  );

  const { data: branches = [] } = useQuery(
    'branches-manager-finance',
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/data/Branches`)
      .then(res => res.ok ? res.json() : []).catch(() => []),
    { retry: false }
  );

  // Calculate business performance
  const calculateBusinessPerformance = () => {
    const branchMap = new Map();
    
    branches.forEach(branch => {
      branchMap.set(branch.id, {
        branch_id: branch.id,
        branch_name: branch.branch_name,
        total_revenue: 0,
        total_cost: 0,
        total_profit: 0,
        quantity_sold: 0
      });
    });

    // Add sales revenue
    sales.forEach(sale => {
      if (sale.branch_id) {
        const branchId = Array.isArray(sale.branch_id) ? sale.branch_id[0] : sale.branch_id;
        const existing = branchMap.get(branchId);
        if (existing) {
          existing.total_revenue += sale.total_amount || 0;
        }
      }
    });

    // Calculate costs and profits
    saleItems.forEach(item => {
      if (item.branch_id) {
        const branchId = Array.isArray(item.branch_id) ? item.branch_id[0] : item.branch_id;
        const existing = branchMap.get(branchId);
        if (existing) {
          const stockItem = stock.find(s => s.product_name === item.product_name);
          const cost = (stockItem?.cost_price || 0) * (item.quantity_sold || 0);
          
          existing.total_cost += cost;
          existing.quantity_sold += item.quantity_sold || 0;
          existing.total_profit = existing.total_revenue - existing.total_cost;
        }
      }
    });

    return Array.from(branchMap.values()).map(branch => ({
      ...branch,
      profit_margin: branch.total_revenue > 0 ? (branch.total_profit / branch.total_revenue) * 100 : 0
    }));
  };

  const branchPerformance = calculateBusinessPerformance();
  const totalRevenue = branchPerformance.reduce((sum, branch) => sum + branch.total_revenue, 0);
  const totalProfit = branchPerformance.reduce((sum, branch) => sum + branch.total_profit, 0);
  const overallMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Top performing products
  const topProducts = saleItems.reduce((acc, item) => {
    const existing = acc.find(p => p.product_name === item.product_name);
    if (existing) {
      existing.total_sales += item.subtotal || 0;
      existing.quantity_sold += item.quantity_sold || 0;
    } else {
      acc.push({
        product_name: item.product_name,
        total_sales: item.subtotal || 0,
        quantity_sold: item.quantity_sold || 0
      });
    }
    return acc;
  }, []).sort((a, b) => b.total_sales - a.total_sales).slice(0, 5);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assessment color="primary" />
        Business Financial Overview
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Revenue
              </Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Profit
              </Typography>
              <Typography variant="h6" color={totalProfit >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(totalProfit)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Profit Margin
              </Typography>
              <Typography variant="h6" color={overallMargin >= 0 ? 'success.main' : 'error.main'}>
                {overallMargin.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Branch Performance */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Branch Performance
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Branch</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Profit</TableCell>
                      <TableCell align="right">Margin</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {branchPerformance.map((branch) => (
                      <TableRow key={branch.branch_id}>
                        <TableCell>{branch.branch_name}</TableCell>
                        <TableCell align="right">{formatCurrency(branch.total_revenue)}</TableCell>
                        <TableCell align="right" sx={{ color: branch.total_profit >= 0 ? 'success.main' : 'error.main' }}>
                          {formatCurrency(branch.total_profit)}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {branch.profit_margin >= 0 ? 
                              <TrendingUp color="success" fontSize="small" /> : 
                              <TrendingDown color="error" fontSize="small" />
                            }
                            {branch.profit_margin.toFixed(1)}%
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={branch.profit_margin >= 15 ? 'Excellent' : branch.profit_margin >= 5 ? 'Good' : 'Needs Attention'}
                            color={branch.profit_margin >= 15 ? 'success' : branch.profit_margin >= 5 ? 'primary' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Selling Products
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Qty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.product_name}</TableCell>
                        <TableCell align="right">{formatCurrency(product.total_sales)}</TableCell>
                        <TableCell align="right">{product.quantity_sold}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerFinanceDashboard;