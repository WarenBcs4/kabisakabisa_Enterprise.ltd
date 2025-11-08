import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
  FilterList,
  GetApp
} from '@mui/icons-material';
import { formatCurrency } from '../theme';

const DataTable = ({
  data = [],
  columns = [],
  title = 'Data Table',
  onEdit,
  onDelete,
  onView,
  onExport,
  searchable = true,
  filterable = true,
  paginated = true,
  dense = false,
  actions = true
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(col => {
          const value = row[col.field];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply column filter
    if (filterColumn && filterValue) {
      filtered = filtered.filter(row => {
        const value = row[filterColumn];
        return value && value.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    }

    return filtered;
  }, [data, columns, searchTerm, filterColumn, filterValue]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!paginated) return filteredData;
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage, paginated]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) return '-';

    switch (column.type) {
      case 'currency':
        return formatCurrency(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      case 'boolean':
        return (
          <Chip
            label={value ? 'Yes' : 'No'}
            color={value ? 'success' : 'default'}
            size="small"
          />
        );
      case 'status':
        const statusColors = {
          active: 'success',
          inactive: 'default',
          pending: 'warning',
          completed: 'success',
          cancelled: 'error',
          approved: 'success',
          rejected: 'error'
        };
        return (
          <Chip
            label={value}
            color={statusColors[value.toLowerCase()] || 'default'}
            size="small"
          />
        );
      case 'array':
        return Array.isArray(value) ? value.join(', ') : value;
      default:
        return value.toString();
    }
  };

  const searchableColumns = columns.filter(col => col.searchable !== false);
  const filterableColumns = columns.filter(col => col.filterable !== false);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {onExport && (
            <Tooltip title="Export Data">
              <IconButton onClick={onExport} size="small">
                <GetApp />
              </IconButton>
            </Tooltip>
          )}
          <Typography variant="body2" color="text.secondary">
            {filteredData.length} records
          </Typography>
        </Box>
      </Box>

      {/* Search and Filter Controls */}
      {(searchable || filterable) && (
        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {searchable && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 200 }}
            />
          )}
          
          {filterable && filterableColumns.length > 0 && (
            <>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filter Column</InputLabel>
                <Select
                  value={filterColumn}
                  onChange={(e) => setFilterColumn(e.target.value)}
                  label="Filter Column"
                >
                  <MenuItem value="">None</MenuItem>
                  {filterableColumns.map(col => (
                    <MenuItem key={col.field} value={col.field}>
                      {col.headerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {filterColumn && (
                <TextField
                  size="small"
                  placeholder="Filter value..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterList />
                      </InputAdornment>
                    )
                  }}
                  sx={{ minWidth: 150 }}
                />
              )}
            </>
          )}
        </Box>
      )}

      {/* Table */}
      <TableContainer>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sx={{ fontWeight: 'bold' }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              {actions && (
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow hover key={row.id || index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align={column.align || 'left'}
                  >
                    {formatCellValue(row[column.field], column)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {onView && (
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => onView(row)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(row)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(row)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography color="text.secondary">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {paginated && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default DataTable;