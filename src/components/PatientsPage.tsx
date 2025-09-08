import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import PatientList from './PatientList';
import PatientDetailModal from './PatientDetailModal';
import { PatientRecord } from '../types';
import { useAppContext } from '../context/AppContext';


const PatientsPage: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { patientRecords } = useAppContext();

  const handleRecordClick = (record: PatientRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  

  return (
    <Container maxWidth="lg" sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <PersonIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              Past Evaluation
            </Typography>
          </Box>
          
        </Box>
      </Box>

      <PatientList 
        records={patientRecords}
        onRecordClick={handleRecordClick}
      />

      <PatientDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        record={selectedRecord}
        allRecords={patientRecords}
      />

      
    </Container>
  );
};

export default PatientsPage;
