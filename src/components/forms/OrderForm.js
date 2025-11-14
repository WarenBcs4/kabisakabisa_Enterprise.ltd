import React from 'react';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, IconButton, Box, Typography, Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { formatCurrency } from '../../theme';

const OrderForm = ({ register, fields, append, remove, watch, branches }) => {
  const watchedItems = watch('items');

  const calculateTotal = () => {
    return watchedItems.reduce((total, item) => {
      return total + (item.quantity_ordered * item.purchase_price_per_unit);
    }, 0);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Supplier Name *"
            {...register('supplier_name', { required: true })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Order Date *"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('order_date', { required: true })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Expected Delivery Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('expected_delivery_date')}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Order Items
      </Typography>

      {fields.map((field, index) => (
        <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Product Name *"
              {...register(`items.${index}.product_name`, { required: true })}
              helperText="Enter the full product name"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Quantity *"
              type="number"
              {...register(`items.${index}.quantity_ordered`, { required: true, min: 1 })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Unit Price *"
              type="number"
              step="0.01"
              {...register(`items.${index}.purchase_price_per_unit`, { required: true, min: 0 })}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Subtotal"
              value={formatCurrency((watchedItems[index]?.quantity_ordered || 0) * (watchedItems[index]?.purchase_price_per_unit || 0))}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Destination Branch</InputLabel>
              <Select
                {...register(`items.${index}.branch_destination_id`)}
                label="Destination Branch"
              >
                <MenuItem value="">
                  <em>Select Later</em>
                </MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.branch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1}>
            <IconButton
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              color="error"
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button
        startIcon={<Add />}
        onClick={() => append({ product_name: '', quantity_ordered: 1, purchase_price_per_unit: 0 })}
        sx={{ mb: 2 }}
      >
        Add Item
      </Button>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Total: {formatCurrency(calculateTotal())}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderForm;