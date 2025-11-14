import React from 'react';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Box, Alert, Typography } from '@mui/material';

const EmployeeForm = ({ register, watch, branches, editingEmployee }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Full Name *"
        margin="normal"
        {...register('full_name', { required: true })}
      />
      <TextField
        fullWidth
        label="Email *"
        type="email"
        margin="normal"
        {...register('email', { required: true })}
      />
      <TextField
        fullWidth
        label="Phone"
        margin="normal"
        {...register('phone')}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Role *</InputLabel>
        <Select
          {...register('role', { required: true })}
          label="Role"
        >
          <MenuItem value="boss">Boss</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="hr">HR</MenuItem>
          <MenuItem value="sales">Sales Staff</MenuItem>
          <MenuItem value="logistics">Driver/Logistics</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Branch</InputLabel>
        <Select
          {...register('branch_id')}
          label="Branch"
        >
          <MenuItem value="">No Branch</MenuItem>
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name || branch.branch_name || 'Unknown Branch'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Salary"
        type="number"
        margin="normal"
        {...register('salary')}
      />
      <TextField
        fullWidth
        label="Hire Date"
        type="date"
        margin="normal"
        InputLabelProps={{ shrink: true }}
        {...register('hire_date')}
      />
      {editingEmployee && (
        <>
          <TextField
            fullWidth
            label="New Password (Optional)"
            type="password"
            margin="normal"
            helperText="Leave blank to keep current password. Minimum 8 characters if changing."
            {...register('new_password', { minLength: 8 })}
          />
          <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
            <Typography variant="body2">
              Only fill the password field if you want to change the employee's password.
            </Typography>
          </Alert>
        </>
      )}
      {!editingEmployee && (
        <>
          <TextField
            fullWidth
            label="Password *"
            type="password"
            margin="normal"
            helperText="Minimum 8 characters required"
            {...register('password', { required: true, minLength: 8 })}
          />
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Security Notice:</strong> Please set a secure password for the new employee.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {branches.length === 0 && 'Note: No branches available for assignment. '}
              Driver accounts will have logistics role and can be viewed in Logistics page
            </Typography>
          </Alert>
        </>
      )}
    </Box>
  );
};

export default EmployeeForm;