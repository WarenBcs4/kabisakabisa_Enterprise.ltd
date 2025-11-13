import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { CloudUpload, Download, Delete, Search, Folder } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import toast from 'react-hot-toast';

const DocumentManager = () => {
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadData, setUploadData] = useState({
    category: 'general',
    description: '',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'invoices', label: 'Tax Invoices' },
    { value: 'receipts', label: 'Receipts' },
    { value: 'delivery_notes', label: 'Delivery Notes' },
    { value: 'certificates', label: 'Compliance Certificates' },
    { value: 'contracts', label: 'Contracts' },
    { value: 'reports', label: 'Reports' },
    { value: 'general', label: 'General' }
  ];

  // Query documents using the documents API endpoint
  const { data: documents = [], isLoading, refetch } = useQuery(
    ['documents', category, searchTerm],
    () => {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (searchTerm) params.append('search', searchTerm);
      
      return fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/documents?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.ok ? res.json() : [])
      .catch(() => []);
    },
    { refetchInterval: 30000, retry: false }
  );

  // Airtable attachment upload mutation
  const uploadMutation = useMutation(
    async (formData) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData // Don't set Content-Type header for FormData
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success('Document uploaded successfully!');
        setShowUpload(false);
        setSelectedFile(null);
        setUploadData({ category: 'general', description: '', tags: '' });
        queryClient.invalidateQueries('documents');
      },
      onError: (error) => {
        toast.error(error.message || 'Upload failed');
      }
    }
  );

  const deleteMutation = useMutation(
    async (documentId) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Delete failed');
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success('Document deleted successfully!');
        queryClient.invalidateQueries('documents');
      },
      onError: (error) => {
        toast.error(error.message || 'Delete failed');
      }
    }
  );

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    
    // Create FormData for Airtable attachment upload
    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('category', uploadData.category);
    formData.append('description', uploadData.description);
    formData.append('tags', uploadData.tags);
    formData.append('subcategory', uploadData.subcategory || '');
    formData.append('display_name', uploadData.display_name || '');
    formData.append('is_public', uploadData.is_public || false);

    try {
      await uploadMutation.mutateAsync(formData);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      if (doc.attachments && doc.attachments.length > 0) {
        // Use Airtable's direct download URL
        const attachment = doc.attachments[0];
        window.open(attachment.url, '_blank');
        toast.success('Download started');
      } else {
        toast.error('No file attachment found');
      }
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (cat) => {
    const colors = {
      invoices: 'error',
      receipts: 'success',
      delivery_notes: 'info',
      certificates: 'warning',
      contracts: 'secondary',
      reports: 'primary',
      general: 'default'
    };
    return colors[cat] || 'default';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Document Management System
      </Typography>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => setShowUpload(true)}
                fullWidth
              >
                Upload Document
              </Button>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<Search />}
                onClick={() => refetch()}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Documents ({documents.length})
          </Typography>

          {isLoading ? (
            <LinearProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Uploaded</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Folder sx={{ mr: 1, color: 'text.secondary' }} />
                          {doc.file_name || (doc.attachments && doc.attachments[0]?.filename)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={doc.category}
                          color={getCategoryColor(doc.category)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{doc.description || '-'}</TableCell>
                      <TableCell>
                        {doc.attachments && doc.attachments[0] ? formatFileSize(doc.attachments[0].size) : formatFileSize(doc.file_size)}
                      </TableCell>
                      <TableCell>
                        {new Date(doc.uploaded_at || doc.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(doc)}
                          color="primary"
                        >
                          <Download />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteMutation.mutate(doc.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {documents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No documents found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onClose={() => setShowUpload(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              style={{ marginBottom: '16px' }}
            />
            
            {selectedFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </Typography>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={uploadData.category}
                onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.filter(cat => cat.value !== 'all').map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              margin="normal"
              value={uploadData.description}
              onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
            />

            <TextField
              fullWidth
              label="Display Name (optional)"
              margin="normal"
              value={uploadData.display_name}
              onChange={(e) => setUploadData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Custom name for display"
            />

            <TextField
              fullWidth
              label="Subcategory (optional)"
              margin="normal"
              value={uploadData.subcategory}
              onChange={(e) => setUploadData(prev => ({ ...prev, subcategory: e.target.value }))}
              placeholder="Additional classification"
            />

            <TextField
              fullWidth
              label="Tags (comma separated)"
              margin="normal"
              value={uploadData.tags}
              onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="invoice, 2024, important"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={uploadData.is_public}
                  onChange={(e) => setUploadData(prev => ({ ...prev, is_public: e.target.checked }))}
                />
              }
              label="Make document public"
            />
          </Box>
          
          {uploading && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpload(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || uploading}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentManager;