import React from 'react';
import { TextField, Grid, Box } from '@mui/material';

const StockForm = ({ register, errors }) => (
  <Box sx={{ mt: 2 }}>
    <TextField
      fullWidth
      label="Product ID"
      margin="normal"
      {...register('product_id')}
      placeholder="Auto-generated if empty"
    />
    <TextField
      fullWidth
      label="Product Name *"
      margin="normal"
      {...register('product_name', { required: true })}
      error={!!errors.product_name}
    />
    <TextField
      fullWidth
      label="Quantity Available *"
      type="number"
      margin="normal"
      {...register('quantity_available', { required: true, min: 0 })}
      error={!!errors.quantity_available}
    />
    <TextField
      fullWidth
      label="Unit Price *"
      type="number"
      step="0.01"
      margin="normal"
      {...register('unit_price', { required: true, min: 0.01 })}
      error={!!errors.unit_price}
    />
    <TextField
      fullWidth
      label="Reorder Level"
      type="number"
      margin="normal"
      defaultValue={10}
      {...register('reorder_level')}
    />
  </Box>
);

export default StockForm;