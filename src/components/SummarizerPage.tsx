import React from 'react';
import { Container, Grid } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import PatientSelector from './PatientSelector';
import EvaluatorSelector from './EvaluatorSelector';
import RecordingSection from './RecordingSection';
import SummarizerSection from './SummarizerSection';

const SummarizerPage: React.FC = () => {
  const {
    patients,
    selectedPatient,
    evaluators,
    selectedEvaluator,
    transcriptionText,
    addPatient,
    addEvaluator,
    setSelectedPatient,
    setSelectedEvaluator
  } = useAppContext();

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <PatientSelector
            patients={patients}
            selectedPatient={selectedPatient}
            onPatientSelect={setSelectedPatient}
            onPatientAdd={addPatient}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <EvaluatorSelector
            evaluators={evaluators}
            selectedEvaluator={selectedEvaluator}
            onEvaluatorSelect={setSelectedEvaluator}
            onEvaluatorAdd={addEvaluator}
          />
        </Grid>
      </Grid>
      
      <RecordingSection onTranscriptionUpdate={() => {}} />
      
      <SummarizerSection
        transcriptionText={transcriptionText}
      />
    </Container>
  );
};

export default SummarizerPage;
