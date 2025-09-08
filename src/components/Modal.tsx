import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { ModalProps, FormData } from '../types';

const Modal: React.FC<ModalProps> = ({ 
  open, 
  onClose, 
  title, 
  fields, 
  onSubmit, 
  submitButtonText = 'Save' 
}) => {
  const [formData, setFormData] = useState<FormData>({});
  
  const getPlaceholder = (fieldName: string): string => {
    if (fieldName === 'patientAge') return 'Enter age';
    if (fieldName === 'patientContact' || fieldName === 'evaluatorContact') return 'Enter contact number';
    return '';
  };

  useEffect(() => {
    if (open) {
      // Reset form data when modal opens
      const initialData: FormData = {};
      fields.forEach(field => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
    }
  }, [open, fields]);

  const handleInputChange = (fieldName: string, value: string | number): void => {
    // Special validation for numeric fields
    if (fieldName === 'patientAge' || fieldName === 'patientContact' || fieldName === 'evaluatorContact') {
      const stringValue = value.toString();
      let numericValue;
      
      if (fieldName === 'patientAge') {
        // Patient age: only allow digits and limit to 3 characters
        numericValue = stringValue.replace(/\D/g, '').slice(0, 3);
      } else {
        // Contact fields: only allow digits and limit to 10 characters
        numericValue = stringValue.replace(/\D/g, '').slice(0, 10);
      }
      
      setFormData(prev => ({
        ...prev,
        [fieldName]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
  };

  const handleSubmit = (): void => {
    onSubmit(formData);
    onClose();
  };

  const isFormValid = fields.every(field => {
    const value = formData[field.name];
    if (field.required && (!value || value.toString().trim() === '')) {
      return false;
    }
    if (field.type === 'number' && value && isNaN(Number(value))) {
      return false;
    }
    if ((field.name === 'patientAge' || field.name === 'patientContact' || field.name === 'evaluatorContact') && value) {
      const numericValue = value.toString();
      if (!/^\d+$/.test(numericValue) || numericValue.length === 0) {
        return false;
      }
    }
    return true;
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {fields.map((field) => (
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              margin="normal"
              required={field.required}
              placeholder={getPlaceholder(field.name)}
              helperText=""
              inputProps={field.type === 'number' ? { min: 0 } : {}}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          sx={{ fontSize: '0.9rem' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!isFormValid}
          sx={{ fontSize: '0.9rem' }}
        >
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
