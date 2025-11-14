import React from 'react';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const ExpenseForm = ({ register, watch, vehicles, branches }) => {
  const categories = [
    { value: 'fuel', label: 'Fuel & Transportation', icon: '⛽' },
    { value: 'office_supplies', label: 'Office Supplies', icon: '📝' },
    { value: 'utilities', label: 'Utilities (Phone, Internet)', icon: '💡' },
    { value: 'maintenance', label: 'Equipment Maintenance', icon: '🔧' },
    { value: 'marketing', label: 'Marketing & Advertising', icon: '📢' },
    { value: 'meals', label: 'Business Meals', icon: '🍽️' },
    { value: 'travel', label: 'Travel Expenses', icon: '✈️' },
    { value: 'rent', label: 'Rent & Facilities', icon: '🏢' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️' },
    { value: 'professional_services', label: 'Professional Services', icon: '👔' },
    { value: 'other', label: 'Other Business Expenses', icon: '📋' }
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Expense Date *"
            type="date"
            {...register('expense_date', { required: true })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Category *</InputLabel>
            <Select
              {...register('category', { required: true })}
              label="Category *"
              value={watch('category') || ''}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount *"
            type="number"
            step="0.01"
            {...register('amount', { required: true, min: 0.01 })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Receipt Number"
            {...register('receipt_number')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Vehicle (Optional)</InputLabel>
            <Select
              {...register('vehicle_id')}
              label="Vehicle (Optional)"
              value={watch('vehicle_id') || ''}
            >
              <MenuItem value="">No Vehicle</MenuItem>
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate_number} - {vehicle.vehicle_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Supplier Name"
            {...register('supplier_name')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description *"
            multiline
            rows={3}
            {...register('description', { required: true })}
            placeholder="Describe the business purpose of this expense..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseForm;