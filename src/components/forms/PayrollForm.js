import React from 'react';
import { TextField, Box } from '@mui/material';

const PayrollForm = ({ register }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Period Start *"
        type="date"
        margin="normal"
        InputLabelProps={{ shrink: true }}
        {...register('period_start', { required: true })}
      />
      <TextField
        fullWidth
        label="Period End *"
        type="date"
        margin="normal"
        InputLabelProps={{ shrink: true }}
        {...register('period_end', { required: true })}
      />
      <TextField
        fullWidth
        label="Deductions Percentage"
        type="number"
        step="0.01"
        margin="normal"
        defaultValue={15}
        helperText="Default: 15% (taxes, insurance, etc.)"
        {...register('deductions_percentage')}
      />
    </Box>
  );
};

export default PayrollForm;