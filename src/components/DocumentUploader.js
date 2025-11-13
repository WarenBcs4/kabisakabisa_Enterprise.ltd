import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  LinearProgress,
  Chip,
  Grid,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { CloudUpload, Delete, Download, AttachFile } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

const DocumentUploader = ({ 
  tableName, 
  recordId, 
  open, 
  onClose, 
  title = 'Upload Documents',
  allowedFields = null // If null, will fetch from API
}) => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedField, setSelectedField] = useState('');
  const [uploading, setUploading] = useState(false);

  // Get document capabilities for the table
  const { data: capabilities } = useQuery(
    ['document-capabilities'],
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/documents/capabilities`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    { enabled: !allowedFields }
  );

  // Get existing documents for this record
  const { data: existingDocs, refetch: refetchDocs } = useQuery(
    ['table-documents', tableName, recordId],
    () => fetch(`${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/documents/table/${tableName}/${recordId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    { enabled: open && tableName && recordId }
  );

  // Upload mutation
  const uploadMutation = useMutation(
    async ({ file, fieldName }) => {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'https://kabisakabisabackendenterpriseltd.vercel.app/api'}/documents/upload/${tableName}/${recordId}/${fieldName}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: formData
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success('Document uploaded successfully!');
        setSelectedFile(null);
        setSelectedField('');
        refetchDocs();
        queryClient.invalidateQueries(['table-documents']);
      },
      onError: (error) => {
        toast.error(error.message || 'Upload failed');
      }
    }
  );

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedField) {
      toast.error('Please select a file and field');
      return;
    }

    setUploading(true);
    try {
      await uploadMutation.mutateAsync({ file: selectedFile, fieldName: selectedField });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (attachment) => {
    window.open(attachment.url, '_blank');
    toast.success('Download started');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get available fields for this table
  const getAvailableFields = () => {
    if (allowedFields) return allowedFields;
    if (!capabilities || !capabilities.capabilities[tableName]) return [];
    return capabilities.capabilities[tableName].suggestedFields || [];
  };

  const availableFields = getAvailableFields();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Upload Section */}
          <Typography variant="h6" gutterBottom>
            Upload New Document
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv"
                style={{ marginBottom: '16px' }}
              />
              
              {selectedFile && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  disabled={availableFields.length === 0}
                >
                  {availableFields.map((field) => (
                    <MenuItem key={field.field || field} value={field.field || field}>
                      {field.label || field} {field.required && '*'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {availableFields.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This table doesn't have predefined document fields. You can still upload to custom fields.
            </Alert>
          )}

          {uploading && <LinearProgress sx={{ mt: 2 }} />}

          {/* Existing Documents Section */}
          {existingDocs && Object.keys(existingDocs.documentFields).length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Existing Documents ({existingDocs.totalAttachments})
              </Typography>
              
              {Object.entries(existingDocs.documentFields).map(([fieldName, attachments]) => (
                <Box key={fieldName} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  
                  <List dense>
                    {attachments.map((attachment, index) => (
                      <ListItem key={index}>
                        <AttachFile sx={{ mr: 1, color: 'text.secondary' }} />
                        <ListItemText
                          primary={attachment.filename}
                          secondary={`${formatFileSize(attachment.size || 0)} • ${attachment.type || 'Unknown type'}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(attachment)}
                            color="primary"
                          >
                            <Download />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Box>
          )}

          {existingDocs && Object.keys(existingDocs.documentFields).length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No documents uploaded yet for this record.
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || !selectedField || uploading}
          startIcon={<CloudUpload />}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUploader;