import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { Person as PersonIcon, ExpandMore as ExpandMoreIcon, History as HistoryIcon } from '@mui/icons-material';
import { PatientRecord } from '../types';

interface PatientDetailModalProps {
  open: boolean;
  onClose: () => void;
  record: PatientRecord | null;
  allRecords?: PatientRecord[];
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ open, onClose, record, allRecords = [] }) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  
  // Get all records for this patient, sorted by date (latest first)
  const patientRecords = (() => {
    if (!record) return [];
    return allRecords
      .filter(r => r.patientId === record.patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  if (!record) return null;

  const latestRecord = patientRecords[0] || record;
  const hasMultipleRecords = patientRecords.length > 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 0.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6" component="div">
            {latestRecord.patientName}
          </Typography>
          {hasMultipleRecords && (
            <Chip 
              label={`${patientRecords.length} visits`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 1.5 }}>
        <Grid container spacing={1.5}>
          {/* Patient Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Student Information
            </Typography>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{latestRecord.patientName}</Typography>
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Age</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{latestRecord.patientAge} years</Typography>
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Latest Visit</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{formatDate(latestRecord.date)}</Typography>
            </Box>
          </Grid>

          {/* Doctor Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Doctor Information
            </Typography>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Latest Doctor</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{latestRecord.evaluatorName}</Typography>
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Contact</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{latestRecord.evaluatorContact}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 0.5 }} />
          </Grid>

          {/* Latest Summary and Key Points */}
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 0.5 }}>
              Latest Assessments
            </Typography>
            <Box sx={{ 
              p: 1, 
              backgroundColor: 'rgba(156, 39, 176, 0.04)', 
              borderRadius: 1,
              border: '1px solid rgba(156, 39, 176, 0.12)',
              maxHeight: 160,
              overflow: 'auto'
            }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                {latestRecord.aiSummary || 'No summary available'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 0.5 }}>
              Key Points
            </Typography>
            <Box sx={{ 
              p: 1, 
              backgroundColor: 'rgba(76, 175, 80, 0.04)', 
              borderRadius: 1,
              border: '1px solid rgba(76, 175, 80, 0.12)',
              maxHeight: 160,
              overflow: 'auto'
            }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                {latestRecord.keyPoints || 'No key points available'}
              </Typography>
            </Box>
          </Grid>

          {/* Expandable History Section */}
          {hasMultipleRecords && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Accordion 
                expanded={expanded === 'history'} 
                onChange={handleAccordionChange('history')}
                sx={{ boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', minHeight: 36, '& .MuiAccordionSummary-content': { my: 0 } }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon color="primary" fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                      All Summaries ({patientRecords.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {patientRecords.map((visitRecord, index) => (
                      <Box key={visitRecord.id} sx={{ p: 1.5, borderBottom: index < patientRecords.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Visit {patientRecords.length - index}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(visitRecord.date)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Doctor: {visitRecord.evaluatorName}
                        </Typography>
                        <Box sx={{ 
                          p: 1, 
                          backgroundColor: 'rgba(156, 39, 176, 0.04)', 
                          borderRadius: 1,
                          border: '1px solid rgba(156, 39, 176, 0.12)',
                          mb: 1
                        }}>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                            {visitRecord.aiSummary || 'No summary available'}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          p: 1, 
                          backgroundColor: 'rgba(76, 175, 80, 0.04)', 
                          borderRadius: 1,
                          border: '1px solid rgba(76, 175, 80, 0.12)'
                        }}>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                            {visitRecord.keyPoints || 'No key points available'}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDetailModal;
