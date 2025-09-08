import React, { useMemo, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Button, TextField, InputAdornment } from '@mui/material';
import { Person as PersonIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import Modal from './Modal';
import { FormData, Patient } from '../types';
import { useAppContext } from '../context/AppContext';


const PatientInfoPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { patients, addPatient } = useAppContext();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddPatient = (formData: FormData): void => {
    const newPatient: Patient = {
      id: Date.now(),
      name: formData.patientName as string,
      age: parseInt(formData.patientAge as string),
      contact: formData.patientContact as string
    };
    addPatient(newPatient);
    setModalOpen(false);
  };

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;

    const term = searchTerm.toLowerCase();
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(term) ||
      String(patient.age).includes(term) ||
      patient.contact.toLowerCase().includes(term)
    );
  }, [patients, searchTerm]);

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
              Student Information
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
            Add Student
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search students by name, age, or contact..."
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

      {/* Results */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filteredPatients.length} student{filteredPatients.length !== 1 ? 's' : ''} found
      </Typography>

      <Grid container spacing={2}>
        {filteredPatients.map((patient) => (
          <Grid item xs={12} sm={6} lg={4} key={patient.id}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}>
              <CardContent sx={{ p: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    width: 40, 
                    height: 40,
                    fontSize: '0.9rem'
                  }}>
                    {getInitials(patient.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                      {patient.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age: {patient.age}
                    </Typography>
                  </Box>
                </Box>

                {/* Contact Information */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Contact
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {patient.contact}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
        submitButtonText="Add Patient"
      />
    </Container>
  );
};

export default PatientInfoPage;


