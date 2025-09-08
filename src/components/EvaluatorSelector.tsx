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
import { EvaluatorSelectorProps, Evaluator, FormData } from '../types';

const EvaluatorSelector: React.FC<EvaluatorSelectorProps> = ({ 
  evaluators, 
  selectedEvaluator, 
  onEvaluatorSelect, 
  onEvaluatorAdd 
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleAddEvaluator = (formData: FormData): void => {
    const newEvaluator: Evaluator = {
      id: Date.now(),
      name: formData.evaluatorName as string,
      contact: formData.evaluatorContact as string
    };
    onEvaluatorAdd(newEvaluator);
    onEvaluatorSelect(newEvaluator.id);
    setModalOpen(false);
  };

  return (
    <>
      <Box>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, color: 'text.primary', fontWeight: 600, fontSize: '1.2rem' }}>
          Doctor Information
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
              onEvaluatorSelect(newValue ? newValue.id : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Doctor"
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
            noOptionsText="No doctors found"
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
            Add Doctor
          </Button>
        </Box>
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Doctor"
        fields={[
          { name: 'evaluatorName', label: 'Doctor Name', type: 'text', required: true },
          { name: 'evaluatorContact', label: 'Doctor Contact', type: 'text', required: true }
        ]}
        onSubmit={handleAddEvaluator}
      />
    </>
  );
};

export default EvaluatorSelector;
