import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';

const HistoricalDataViewer = ({ open, onClose, title = "Historical Data" }) => {
  const spreadsheetUrl = "https://docs.google.com/spreadsheets/d/13xeL8_lah0yMBfTdbs2sNaK9CeVWWxlzqPZ8ksZM3h4/edit?usp=drive_link";
  const embedUrl = spreadsheetUrl.replace('/edit?usp=drive_link', '/edit?usp=sharing&embedded=true');

  const openInNewTab = () => {
    window.open(spreadsheetUrl, '_blank');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: { 
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6">{title}</Typography>
        <Box>
          <IconButton 
            onClick={openInNewTab}
            title="Open in new tab"
            sx={{ mr: 1 }}
          >
            <OpenInNew />
          </IconButton>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, height: '100%' }}>
        <Box sx={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ 
              border: 'none',
              minHeight: '600px'
            }}
            title="Historical Data Spreadsheet"
            allow="clipboard-read; clipboard-write"
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          You can edit data directly in the spreadsheet. Changes are saved automatically.
        </Typography>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoricalDataViewer;