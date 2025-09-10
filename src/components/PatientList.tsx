import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { PatientRecord } from '../types';

interface PatientListProps {
  records: PatientRecord[];
  onRecordClick: (record: PatientRecord) => void;
}

const PatientList: React.FC<PatientListProps> = ({ records, onRecordClick }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Group records by patient and get latest summary for each
  const groupedRecords = (() => {
    const grouped = records.reduce((acc, record) => {
      const key = record.patientId;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
      return acc;
    }, {} as Record<number, PatientRecord[]>);

    // Sort each group by date (latest first) and return the latest record with visit count
    return Object.values(grouped).map(patientRecords => {
      const sorted = [...patientRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return {
        ...sorted[0], // Latest record
        visitCount: sorted.length
      };
    });
  })();

  const filteredRecords = (() => {
    if (!searchTerm.trim()) return groupedRecords;
    
    const term = searchTerm.toLowerCase();
    return groupedRecords.filter(record => {
      const patientName = String(record?.patientName || '');
      const evaluatorName = String(record?.evaluatorName || '');
      const aiSummary = String(record?.aiSummary || '');
      
      return patientName.toLowerCase().includes(term) ||
             evaluatorName.toLowerCase().includes(term) ||
             aiSummary.toLowerCase().includes(term);
    });
  })();

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

  const getInitials = (name: string | undefined) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search students, doctors, or summaries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white'
            }
          }}
        />
      </Box>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filteredRecords.length} student{filteredRecords.length !== 1 ? 's' : ''} found
      </Typography>

      {/* Patient Records Grid */}
      <Grid container spacing={2}>
        {filteredRecords.map((record) => (
          <Grid item xs={12} sm={6} lg={4} key={record.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
              onClick={() => onRecordClick(record)}
            >
              <CardContent sx={{ p: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      width: 40, 
                      height: 40,
                      fontSize: '0.9rem'
                    }}>
                      {getInitials(record.patientName)}
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          {record.patientName}
                        </Typography>
                        {record.visitCount > 1 && (
                          <Chip 
                            label={`${record.visitCount} visits`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Age: {record.patientAge}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
                    }}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Doctor Info */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Evaluated by
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: 'success.main' 
                    }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {record.evaluatorName}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                    {record.evaluatorContact}
                  </Typography>
                </Box>

                {/* Date */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                  <TimeIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Latest: {formatDate(record.date)}
                  </Typography>
                </Box>

                {/* Summary Preview */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Latest Summary
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4
                    }}
                  >
                    {record.aiSummary || 'No summary available'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredRecords.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          color: 'text.secondary'
        }}>
          <PersonIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No records found
          </Typography>
          <Typography variant="body2">
            {searchTerm ? 'Try adjusting your search terms' : 'No patient records available yet'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PatientList;
