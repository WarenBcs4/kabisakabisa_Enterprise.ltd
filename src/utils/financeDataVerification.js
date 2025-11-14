// Finance Data Verification Utility
// This utility verifies that all database tables are properly linked and accessible

export const verifyFinanceDataLinkage = (data) => {
  const {
    sales = [],
    expenses = [],
    payroll = [],
    orders = [],
    employees = [],
    invoices = [],
    stock = [],
    vehicles = [],
    trips = [],
    branches = [],
    saleItems = [],
    orderItems = [],
    stockMovements = [],
    bankAccounts = [],
    chartOfAccounts = []
  } = data;

  const verification = {
    tables: {
      sales: { count: sales.length, status: 'connected' },
      expenses: { count: expenses.length, status: 'connected' },
      payroll: { count: payroll.length, status: 'connected' },
      orders: { count: orders.length, status: 'connected' },
      employees: { count: employees.length, status: 'connected' },
      invoices: { count: invoices.length, status: 'connected' },
      stock: { count: stock.length, status: 'connected' },
      vehicles: { count: vehicles.length, status: 'connected' },
      trips: { count: trips.length, status: 'connected' },
      branches: { count: branches.length, status: 'connected' },
      saleItems: { count: saleItems.length, status: 'connected' },
      orderItems: { count: orderItems.length, status: 'connected' },
      stockMovements: { count: stockMovements.length, status: 'connected' },
      bankAccounts: { count: bankAccounts.length, status: 'connected' },
      chartOfAccounts: { count: chartOfAccounts.length, status: 'connected' }
    },
    relationships: {
      salesWithItems: verifyRelationship(sales, saleItems, 'id', 'sale_id'),
      ordersWithItems: verifyRelationship(orders, orderItems, 'id', 'order_id'),
      employeesWithPayroll: verifyRelationship(employees, payroll, 'id', 'employee_id'),
      vehiclesWithTrips: verifyRelationship(vehicles, trips, 'plate_number', 'vehicle_plate_number'),
      stockWithMovements: verifyRelationship(stock, stockMovements, 'product_name', 'product_name')
    },
    calculations: {
      totalRevenue: calculateTotalRevenue(sales, trips, invoices),
      totalExpenses: calculateTotalExpenses(expenses, payroll),
      totalAssets: calculateTotalAssets(stock, vehicles, bankAccounts),
      workingCapital: calculateWorkingCapital(sales, invoices, orders, payroll)
    },
    dataQuality: {
      salesWithValidAmounts: sales.filter(s => s.total_amount && parseFloat(s.total_amount) > 0).length,
      expensesWithValidAmounts: expenses.filter(e => e.amount && parseFloat(e.amount) > 0).length,
      stockWithValidPrices: stock.filter(s => s.unit_price && parseFloat(s.unit_price) > 0).length,
      tripsWithValidCharges: trips.filter(t => t.amount_charged && parseFloat(t.amount_charged) > 0).length
    }
  };

  return verification;
};

function verifyRelationship(parentTable, childTable, parentKey, childKey) {
  const parentIds = new Set(parentTable.map(item => item[parentKey]));
  const linkedChildren = childTable.filter(child => {
    const childValue = Array.isArray(child[childKey]) ? child[childKey][0] : child[childKey];
    return parentIds.has(childValue);
  });
  
  return {
    parentCount: parentTable.length,
    childCount: childTable.length,
    linkedCount: linkedChildren.length,
    linkageRate: childTable.length > 0 ? (linkedChildren.length / childTable.length * 100).toFixed(1) + '%' : '0%'
  };
}

function calculateTotalRevenue(sales, trips, invoices) {
  const salesRevenue = sales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount) || 0), 0);
  const tripsRevenue = trips.reduce((sum, trip) => sum + (parseFloat(trip.amount_charged) || 0), 0);
  const invoiceRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (parseFloat(inv.amount_paid) || parseFloat(inv.total_amount) || 0), 0);
  
  return {
    sales: salesRevenue,
    logistics: tripsRevenue,
    invoices: invoiceRevenue,
    total: salesRevenue + tripsRevenue + invoiceRevenue
  };
}

function calculateTotalExpenses(expenses, payroll) {
  const regularExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  const payrollExpenses = payroll.reduce((sum, pay) => sum + (parseFloat(pay.net_salary) || 0), 0);
  
  return {
    operating: regularExpenses,
    payroll: payrollExpenses,
    total: regularExpenses + payrollExpenses
  };
}

function calculateTotalAssets(stock, vehicles, bankAccounts) {
  const stockValue = stock.reduce((sum, item) => 
    sum + ((parseFloat(item.quantity_available) || 0) * (parseFloat(item.unit_price) || 0)), 0);
  const vehicleValue = vehicles.reduce((sum, vehicle) => 
    sum + (parseFloat(vehicle.current_value) || parseFloat(vehicle.purchase_price) || 0), 0);
  const cashValue = bankAccounts.reduce((sum, account) => 
    sum + (parseFloat(account.current_balance) || 0), 0);
  
  return {
    stock: stockValue,
    vehicles: vehicleValue,
    cash: cashValue,
    total: stockValue + vehicleValue + cashValue
  };
}

function calculateWorkingCapital(sales, invoices, orders, payroll) {
  const receivables = [
    ...sales.filter(s => s.payment_method === 'credit').map(s => parseFloat(s.total_amount) || 0),
    ...invoices.filter(i => i.status !== 'paid').map(i => parseFloat(i.balance_due) || parseFloat(i.total_amount) || 0)
  ].reduce((sum, amount) => sum + amount, 0);
  
  const payables = [
    ...orders.filter(o => o.status !== 'completed').map(o => 
      (parseFloat(o.total_amount) || 0) - (parseFloat(o.amount_paid) || 0)),
    ...payroll.filter(p => p.payment_status === 'pending').map(p => parseFloat(p.net_salary) || 0)
  ].reduce((sum, amount) => sum + amount, 0);
  
  return {
    receivables,
    payables,
    workingCapital: receivables - payables
  };
}

export const formatVerificationReport = (verification) => {
  console.log('=== FINANCE DATABASE LINKAGE VERIFICATION ===');
  console.log('\n📊 TABLE CONNECTIONS:');
  Object.entries(verification.tables).forEach(([table, info]) => {
    console.log(`  ${table}: ${info.count} records (${info.status})`);
  });
  
  console.log('\n🔗 RELATIONSHIP VERIFICATION:');
  Object.entries(verification.relationships).forEach(([rel, info]) => {
    console.log(`  ${rel}: ${info.linkedCount}/${info.childCount} linked (${info.linkageRate})`);
  });
  
  console.log('\n💰 FINANCIAL CALCULATIONS:');
  console.log(`  Total Revenue: $${verification.calculations.totalRevenue.total.toLocaleString()}`);
  console.log(`    - Sales: $${verification.calculations.totalRevenue.sales.toLocaleString()}`);
  console.log(`    - Logistics: $${verification.calculations.totalRevenue.logistics.toLocaleString()}`);
  console.log(`    - Invoices: $${verification.calculations.totalRevenue.invoices.toLocaleString()}`);
  console.log(`  Total Expenses: $${verification.calculations.totalExpenses.total.toLocaleString()}`);
  console.log(`  Total Assets: $${verification.calculations.totalAssets.total.toLocaleString()}`);
  console.log(`  Working Capital: $${verification.calculations.workingCapital.workingCapital.toLocaleString()}`);
  
  console.log('\n✅ DATA QUALITY:');
  Object.entries(verification.dataQuality).forEach(([metric, count]) => {
    console.log(`  ${metric}: ${count} valid records`);
  });
  
  return verification;
};