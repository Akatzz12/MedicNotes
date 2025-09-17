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
import { EvaluatorSelectorProps, FormData, Evaluator } from '../types';

const EvaluatorSelector: React.FC<EvaluatorSelectorProps> = ({ 
  evaluators, 
  selectedEvaluator, 
  onInstructorSelect, 
  onInstructorAdd 
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleAddInstructor = async (formData: FormData): Promise<void> => {
    try {
      const newInstructor = {
        name: formData.instructorName as string,
        contact: formData.instructorContact as string
      };
      await (onInstructorAdd as (evaluator: Omit<Evaluator, 'id'>) => Promise<void>)(newInstructor);
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding instructor:', error);
    }
  };

  return (
    <>
      <Box>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, color: 'text.primary', fontWeight: 600, fontSize: '1.2rem' }}>
          Instructor Information
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          p: 2.5,
          backgroundColor: 'rgba(76, 175, 80, 0.04)',
          borderRadius: 2,
          border: '1px solid rgba(76, 175, 80, 0.12)'
        }}>
          <Autocomplete
            key={evaluators.length} 
            sx={{ minWidth: 250 }}
            options={evaluators}
            getOptionLabel={(option) => option.name}
            value={evaluators.find(e => e.id === selectedEvaluator) || null}
            onChange={(event, newValue) => {
              onInstructorSelect(newValue?.id || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Instructor"
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
                    display: 'none', 
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
                    {option.contact}
                  </Typography>
                </Box>
              </Box>
            )}
            noOptionsText="No instructors found"
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
              fontSize: '0.9rem',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Add Instructor
          </Button>
        </Box>
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Instructor"
        fields={[
          { name: 'instructorName', label: 'Instructor Name', type: 'text', required: true },
          { name: 'instructorContact', label: 'Instructor Contact', type: 'text', required: true }
        ]}
        onSubmit={handleAddInstructor}
      />
    </>
  );
};

export default EvaluatorSelector;
