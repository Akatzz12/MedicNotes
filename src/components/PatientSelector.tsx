import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Autocomplete,
  TextField
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Modal from './Modal';
import PatientDetailModal from './PatientDetailModal';
import { PatientSelectorProps, Patient, FormData } from '../types';
import { useAppContext } from '../context/AppContext';

const PatientSelector: React.FC<PatientSelectorProps> = ({ 
  patients, 
  selectedPatient, 
  onPatientSelect, 
  onPatientAdd 
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const { patientRecords } = useAppContext();

  const handleAddPatient = (formData: FormData): void => {
    const newPatient: Patient = {
      id: Date.now(),
      name: formData.patientName as string,
      age: parseInt(formData.patientAge as string),
      contact: formData.patientContact as string
    };
    onPatientAdd(newPatient);
    onPatientSelect(newPatient.id);
    setModalOpen(false);
  };

  return (
    <>
      <Box>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, color: 'text.primary', fontWeight: 600, fontSize: '1.2rem' }}>
          Student Information
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          p: 2.5,
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          borderRadius: 2,
          border: '1px solid rgba(25, 118, 210, 0.12)'
        }}>
          <Autocomplete
            key={patients.length} 
            sx={{ minWidth: 200 }}
            options={patients}
            getOptionLabel={(option) => option.name}
            value={patients.find(p => p.id === selectedPatient) || null}
            onChange={(event, newValue) => {
              onPatientSelect(newValue ? newValue.id : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Student"
                sx={{
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiAutocomplete-endAdornment': {
                    display: 'none', // Hide dropdown arrow
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {option.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Age: {option.age} • {option.contact}
                  </Typography>
                </Box>
              </Box>
            )}
            noOptionsText="No students found"
            clearOnEscape
            selectOnFocus
            handleHomeEndKeys
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ 
              px: 2.5,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          >
            Add Student
          </Button>
          <Button
            variant="outlined"
            onClick={() => setHistoryOpen(true)}
            disabled={
              !selectedPatient ||
              !patientRecords.some(r => r.patientId === selectedPatient)
            }
            sx={{ 
              px: 2.5,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          >
            Past Evaluation
          </Button>
        </Box>
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Student"
        fields={[
          { name: 'patientName', label: 'Student Name', type: 'text', required: true },
          { name: 'patientAge', label: 'Student Age', type: 'text', required: true },
          { name: 'patientContact', label: 'Student Contact', type: 'text', required: true }
        ]}
        onSubmit={handleAddPatient}
      />
      {historyOpen && (
        <PatientDetailModal
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          record={(() => {
            const recs = patientRecords
              .filter(r => r.patientId === selectedPatient)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return recs[0] || null;
          })()}
          allRecords={patientRecords}
        />
      )}
    </>
  );
};

export default PatientSelector;
