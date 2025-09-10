import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Button, TextField, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { MedicalServices as DoctorIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import Modal from './Modal';
import { FormData } from '../types';
import { useAppContext } from '../context/AppContext';


const EvaluatorsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const { evaluators, addEvaluator, evaluatorsLoading, evaluatorsError, loadEvaluators } = useAppContext();

  const getInitials = (name: string | undefined) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddEvaluator = async (formData: FormData): Promise<void> => {
    try {
      const newEvaluator = {
        name: formData.evaluatorName as string,
        contact: formData.evaluatorContact as string
      };
      await addEvaluator(newEvaluator);
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding evaluator:', error);
      // Error is handled in context
    }
  };

  // Filter evaluators based on search term
  const filteredEvaluators = (() => {
    if (!searchTerm.trim()) return evaluators;
    
    const term = searchTerm.toLowerCase();
    return evaluators.filter(evaluator => 
      evaluator.name.toLowerCase().includes(term) ||
      evaluator.contact.toLowerCase().includes(term)
    );
  })();

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
            <DoctorIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />
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
              Doctors Information
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ 
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 }
            }}
          >
            Add Doctor
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {evaluatorsError && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={loadEvaluators}>
              Retry
            </Button>
          }
        >
          {evaluatorsError}
        </Alert>
      )}

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search doctors by name or contact..."
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
        {filteredEvaluators.length} doctor{filteredEvaluators.length !== 1 ? 's' : ''} found
      </Typography>

      {/* Loading State */}
      {evaluatorsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Evaluators Grid */}
      {!evaluatorsLoading && (
        <Grid container spacing={2}>
          {filteredEvaluators.map((evaluator, index) => {
            if (!evaluator) {
              console.warn('Undefined evaluator at index:', index);
              return null;
            }
            
            return (
            <Grid item xs={12} sm={6} lg={4} key={evaluator.id || index}>
              <Card sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}>
                <CardContent sx={{ p: 2 }}>
                  {/* Header with Avatar and Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      width: 40, 
                      height: 40,
                      fontSize: '0.9rem'
                    }}>
                      {getInitials(evaluator.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        {evaluator.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Contact Information */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Contact
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {evaluator.contact || 'No contact'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Doctor"
        fields={[
          { name: 'evaluatorName', label: 'Doctor Name', type: 'text', required: true },
          { name: 'evaluatorContact', label: 'Doctor Contact', type: 'text', required: true }
        ]}
        onSubmit={handleAddEvaluator}
        submitButtonText="Add Doctor"
      />
    </Container>
  );
};

export default EvaluatorsPage;
