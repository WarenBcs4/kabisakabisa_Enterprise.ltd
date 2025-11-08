// Table configurations for all Airtable tables
export const TABLE_CONFIGS = {
  Employees: {
    title: 'Employees',
    columns: [
      { field: 'full_name', headerName: 'Full Name', minWidth: 150 },
      { field: 'email', headerName: 'Email', minWidth: 200 },
      { field: 'phone', headerName: 'Phone', minWidth: 120 },
      { field: 'role', headerName: 'Role', minWidth: 100, type: 'status' },
      { field: 'branch_name', headerName: 'Branch', minWidth: 120 },
      { field: 'salary', headerName: 'Salary', minWidth: 100, type: 'currency' },
      { field: 'hire_date', headerName: 'Hire Date', minWidth: 100, type: 'date' },
      { field: 'is_active', headerName: 'Active', minWidth: 80, type: 'boolean' }
    ]
  },
  
  Branches: {
    title: 'Branches',
    columns: [
      { field: 'branch_name', headerName: 'Branch Name', minWidth: 150 },
      { field: 'location_address', headerName: 'Address', minWidth: 200 },
      { field: 'phone', headerName: 'Phone', minWidth: 120 },
      { field: 'email', headerName: 'Email', minWidth: 150 },
      { field: 'manager_name', headerName: 'Manager', minWidth: 120 },
      { field: 'created_at', headerName: 'Created', minWidth: 100, type: 'date' }
    ]
  },
  
  Stock: {
    title: 'Stock Items',
    columns: [
      { field: 'product_name', headerName: 'Product Name', minWidth: 150 },
      { field: 'product_id', headerName: 'Product ID', minWidth: 120 },
      { field: 'quantity_available', headerName: 'Available', minWidth: 100, align: 'right' },
      { field: 'unit_price', headerName: 'Unit Price', minWidth: 100, type: 'currency' },
      { field: 'reorder_level', headerName: 'Reorder Level', minWidth: 100, align: 'right' },
      { field: 'branch_name', headerName: 'Branch', minWidth: 120 },
      { field: 'updated_at', headerName: 'Last Updated', minWidth: 120, type: 'datetime' }
    ]
  },
  
  Sales: {
    title: 'Sales Records',
    columns: [
      { field: 'sale_date', headerName: 'Date', minWidth: 100, type: 'date' },
      { field: 'customer_name', headerName: 'Customer', minWidth: 150 },
      { field: 'total_amount', headerName: 'Total Amount', minWidth: 120, type: 'currency' },
      { field: 'payment_method', headerName: 'Payment Method', minWidth: 120, type: 'status' },
      { field: 'branch_name', headerName: 'Branch', minWidth: 120 },
      { field: 'salesperson_name', headerName: 'Salesperson', minWidth: 150 },
      { field: 'created_at', headerName: 'Created', minWidth: 120, type: 'datetime' }
    ]
  },
  
  Sale_Items: {
    title: 'Sale Items',
    columns: [
      { field: 'sale_id', headerName: 'Sale ID', minWidth: 100 },
      { field: 'product_name', headerName: 'Product', minWidth: 150 },
      { field: 'quantity_sold', headerName: 'Quantity', minWidth: 100, align: 'right' },
      { field: 'unit_price', headerName: 'Unit Price', minWidth: 100, type: 'currency' },
      { field: 'subtotal', headerName: 'Subtotal', minWidth: 100, type: 'currency' },
      { field: 'created_at', headerName: 'Created', minWidth: 120, type: 'datetime' }
    ]
  },
  
  Expenses: {
    title: 'Expenses',
    columns: [
      { field: 'expense_date', headerName: 'Date', minWidth: 100, type: 'date' },
      { field: 'category', headerName: 'Category', minWidth: 120, type: 'status' },
      { field: 'amount', headerName: 'Amount', minWidth: 100, type: 'currency' },
      { field: 'description', headerName: 'Description', minWidth: 200 },
      { field: 'vehicle_plate_number', headerName: 'Vehicle', minWidth: 120 },
      { field: 'branch_name', headerName: 'Branch', minWidth: 120 },
      { field: 'created_by_name', headerName: 'Created By', minWidth: 120 }
    ]
  },
  
  Vehicles: {
    title: 'Vehicles',
    columns: [
      { field: 'plate_number', headerName: 'Plate Number', minWidth: 120 },
      { field: 'vehicle_type', headerName: 'Type', minWidth: 100, type: 'status' },
      { field: 'purchase_date', headerName: 'Purchase Date', minWidth: 120, type: 'date' },
      { field: 'current_branch_name', headerName: 'Current Branch', minWidth: 150 },
      { field: 'status', headerName: 'Status', minWidth: 100, type: 'status' },
      { field: 'created_at', headerName: 'Added', minWidth: 120, type: 'date' }
    ]
  },
  
  Trips: {
    title: 'Trips',
    columns: [
      { field: 'trip_date', headerName: 'Date', minWidth: 100, type: 'date' },
      { field: 'vehicle_plate_number', headerName: 'Vehicle', minWidth: 120 },
      { field: 'destination', headerName: 'Destination', minWidth: 150 },
      { field: 'distance_km', headerName: 'Distance (km)', minWidth: 100, align: 'right' },
      { field: 'fuel_cost', headerName: 'Fuel Cost', minWidth: 100, type: 'currency' },
      { field: 'amount_charged', headerName: 'Amount Charged', minWidth: 120, type: 'currency' },
      { field: 'profit', headerName: 'Profit', minWidth: 100, type: 'currency' },
      { field: 'driver_name', headerName: 'Driver', minWidth: 120 }
    ]
  },
  
  Orders: {
    title: 'Purchase Orders',
    columns: [
      { field: 'order_date', headerName: 'Order Date', minWidth: 100, type: 'date' },
      { field: 'supplier_name', headerName: 'Supplier', minWidth: 150 },
      { field: 'total_amount', headerName: 'Total Amount', minWidth: 120, type: 'currency' },
      { field: 'amount_paid', headerName: 'Amount Paid', minWidth: 120, type: 'currency' },
      { field: 'balance_remaining', headerName: 'Balance', minWidth: 100, type: 'currency' },
      { field: 'status', headerName: 'Status', minWidth: 100, type: 'status' },
      { field: 'expected_delivery_date', headerName: 'Expected Delivery', minWidth: 120, type: 'date' }
    ]
  },
  
  Payroll: {
    title: 'Payroll Records',
    columns: [
      { field: 'employee_name', headerName: 'Employee', minWidth: 150 },
      { field: 'period_start', headerName: 'Period Start', minWidth: 100, type: 'date' },
      { field: 'period_end', headerName: 'Period End', minWidth: 100, type: 'date' },
      { field: 'gross_salary', headerName: 'Gross Salary', minWidth: 120, type: 'currency' },
      { field: 'deductions', headerName: 'Deductions', minWidth: 100, type: 'currency' },
      { field: 'net_salary', headerName: 'Net Salary', minWidth: 120, type: 'currency' },
      { field: 'payment_status', headerName: 'Status', minWidth: 100, type: 'status' },
      { field: 'created_at', headerName: 'Generated', minWidth: 120, type: 'datetime' }
    ]
  },
  
  Stock_Movements: {
    title: 'Stock Movements',
    columns: [
      { field: 'movement_date', headerName: 'Date', minWidth: 100, type: 'date' },
      { field: 'product_name', headerName: 'Product', minWidth: 150 },
      { field: 'movement_type', headerName: 'Type', minWidth: 100, type: 'status' },
      { field: 'quantity', headerName: 'Quantity', minWidth: 100, align: 'right' },
      { field: 'from_branch_name', headerName: 'From Branch', minWidth: 120 },
      { field: 'to_branch_name', headerName: 'To Branch', minWidth: 120 },
      { field: 'reference_id', headerName: 'Reference', minWidth: 120 },
      { field: 'created_at', headerName: 'Created', minWidth: 120, type: 'datetime' }
    ]
  },
  
  Vehicle_Maintenance: {
    title: 'Vehicle Maintenance',
    columns: [
      { field: 'maintenance_date', headerName: 'Date', minWidth: 100, type: 'date' },
      { field: 'vehicle_plate_number', headerName: 'Vehicle', minWidth: 120 },
      { field: 'maintenance_type', headerName: 'Type', minWidth: 120, type: 'status' },
      { field: 'cost', headerName: 'Cost', minWidth: 100, type: 'currency' },
      { field: 'description', headerName: 'Description', minWidth: 200 },
      { field: 'next_service_date', headerName: 'Next Service', minWidth: 120, type: 'date' },
      { field: 'created_at', headerName: 'Recorded', minWidth: 120, type: 'datetime' }
    ]
  },
  
  Documents: {
    title: 'Documents',
    columns: [
      { field: 'file_name', headerName: 'File Name', minWidth: 200 },
      { field: 'category', headerName: 'Category', minWidth: 120, type: 'status' },
      { field: 'file_size', headerName: 'Size (KB)', minWidth: 100, align: 'right' },
      { field: 'uploaded_by_name', headerName: 'Uploaded By', minWidth: 120 },
      { field: 'branch_name', headerName: 'Branch', minWidth: 120 },
      { field: 'uploaded_at', headerName: 'Uploaded', minWidth: 120, type: 'datetime' },
      { field: 'approval_status', headerName: 'Status', minWidth: 100, type: 'status' }
    ]
  },
  
  Audit_Logs: {
    title: 'Audit Logs',
    columns: [
      { field: 'timestamp', headerName: 'Timestamp', minWidth: 150, type: 'datetime' },
      { field: 'user_name', headerName: 'User', minWidth: 120 },
      { field: 'action', headerName: 'Action', minWidth: 100, type: 'status' },
      { field: 'table_name', headerName: 'Table', minWidth: 120 },
      { field: 'record_id', headerName: 'Record ID', minWidth: 120 },
      { field: 'changes', headerName: 'Changes', minWidth: 200 },
      { field: 'ip_address', headerName: 'IP Address', minWidth: 120 }
    ]
  }
};

// Get table configuration
export const getTableConfig = (tableName) => {
  return TABLE_CONFIGS[tableName] || {
    title: tableName,
    columns: [
      { field: 'id', headerName: 'ID', minWidth: 100 },
      { field: 'created_at', headerName: 'Created', minWidth: 120, type: 'datetime' }
    ]
  };
};

// Get all available tables
export const getAvailableTables = () => {
  return Object.keys(TABLE_CONFIGS);
};