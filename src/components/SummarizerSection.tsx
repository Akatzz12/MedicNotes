import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { SummarizerSectionProps } from '../types';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api';

const SummarizerSection: React.FC<SummarizerSectionProps> = ({ transcriptionText }) => {
  const [summary, setSummary] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const { 
    patients, 
    selectedPatient, 
    evaluators, 
    selectedEvaluator, 
    addPatientRecord,
    clearTranscription,
    setSelectedPatient,
    setSelectedEvaluator,
    stopRecording
  } = useAppContext();



  const getButtonText = (): string => {
    if (isLoading) return 'Processing...';
    if (transcriptionText.trim()) return 'Evaluate';
    return 'Record first to evaluate';
  };

  const handleSummarize = async (): Promise<void> => {
    if (!transcriptionText.trim()) {
      return;
    }

    stopRecording();

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.summarizeText(transcriptionText);
      
      setSummary(response.summary);
      
      try {
        const keyPointsResponse = await apiService.extractKeyPoints(transcriptionText);
        setNotes(keyPointsResponse.key_points);
      } catch (keyPointsError) {
        console.error('Error extracting key points:', keyPointsError);
        setNotes('');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecord = async (): Promise<void> => {
    console.log('Save record validation:', {
      summary: !!summary,
      notes: notes, 
      selectedPatient,
      selectedEvaluator,
      patientType: typeof selectedPatient,
      evaluatorType: typeof selectedEvaluator
    });
    
    if (!summary || selectedPatient === '' || selectedEvaluator === '') {
      setError('Please complete assessment and ensure student and instructor are selected');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    const evaluator = evaluators.find(e => e.id === selectedEvaluator);

    console.log('Student lookup:', {
      selectedPatient,
      patients: patients.map(p => ({ id: p.id, name: p.name })),
      foundPatient: patient
    });

    console.log('Instructor lookup:', {
      selectedEvaluator,
      evaluators: evaluators.map(e => ({ id: e.id, name: e.name })),
      foundEvaluator: evaluator
    });

    if (!patient || !evaluator) {
      setError('Student or instructor not found');
      return;
    }

    const newRecord = {
      patientId: patient.id || 0,
      patientName: patient.name,
      patientAge: patient.age,
      evaluatorName: evaluator.name,
      evaluatorContact: evaluator.contact,
      date: new Date().toISOString(), // ISO timestamp - backend will calculate visit count
      transcriptionText: transcriptionText,
      aiSummary: summary,
      keyPoints: notes,
      duration: Math.ceil(transcriptionText.split(' ').length / 2) 
    };

    try {
      await addPatientRecord(newRecord);
      setSaveSuccess(true);
      setError('');

      // Clear all fields after successful save
      setSummary('');
      setNotes('');
      clearTranscription();
      setSelectedPatient(''); 
      setSelectedEvaluator(''); 

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save student record');
    }
  };


  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, color: 'text.primary', fontWeight: 600, fontSize: '1.2rem' }}>
        Assessment
      </Typography>
      <Box sx={{ 
        p: 3,
        backgroundColor: 'rgba(156, 39, 176, 0.04)',
        borderRadius: 2,
        border: '1px solid rgba(156, 39, 176, 0.12)'
      }}>
        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {saveSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            onClose={() => setSaveSuccess(false)}
          >
            Student record saved successfully!
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleSummarize}
          disabled={!transcriptionText.trim() || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ 
            mb: 2,
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.9rem',
            backgroundColor: 'secondary.main',
            '&:hover': {
              backgroundColor: 'secondary.dark'
            },
            '&:disabled': {
              backgroundColor: 'grey.300',
              color: 'grey.500'
            }
          }}
        >
          {getButtonText()}
        </Button>
        
        
        {summary && (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="AI Enchance Notes (via OpenAI)"
              value={summary}
              InputProps={{
                readOnly: true,
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2
                }
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Key Points (2-3 main points)"
              value={notes}
              InputProps={{
                readOnly: true,
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2
                }
              }}
            />
            
            {/* Save Button */}
            <Button
              variant="contained"
              onClick={handleSaveRecord}
              startIcon={<SaveIcon />}
              sx={{ 
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                backgroundColor: 'success.main',
                '&:hover': {
                  backgroundColor: 'success.dark'
                }
              }}
            >
              Save Student Record
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SummarizerSection;
