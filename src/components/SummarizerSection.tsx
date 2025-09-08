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


  // Initialize OpenAI client
  const getOpenAIClient = async (): Promise<any> => {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      console.log('API Key check:', {
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0,
        apiKeyStart: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
        isDefaultValue: apiKey === 'your_openai_api_key_here'
      });
      
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        console.log('API key not configured or is default value');
        return null;
      }
      
      const { default: OpenAI } = await import('openai');
      return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true 
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      return null;
    }
  };

  const getButtonText = (): string => {
    if (isLoading) return 'Processing...';
    if (transcriptionText.trim()) return 'Evaluate';
    return 'Record first to evaluate';
  };

  const handleSummarize = async (): Promise<void> => {
    if (!transcriptionText.trim()) {
      return;
    }

    // Stop recording automatically when summarize is clicked
    stopRecording();

    setIsLoading(true);
    setError('');

    try {
      // Get OpenAI client
      const openai = await getOpenAIClient();
      if (!openai) {
        throw new Error('OpenAI API key not configured. Please add your API key to the .env file.');
      }

      // Call OpenAI API to improve the transcription
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical transcription assistant. Your task is to improve the formatting and clarity of medical speech-to-text transcriptions. Only reformat and improve the existing text - do not add any new information, diagnoses, or medical advice. Focus on proper grammar, punctuation, and medical terminology formatting."
          },
          {
            role: "user",
            content: `Please improve the formatting and clarity of this medical transcription while keeping all the original information intact:\n\n${transcriptionText}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      });

      const improvedText = response.choices[0]?.message?.content || transcriptionText;
      
      // Extract 2-3 key points from the improved text
      const keyPointsResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical assistant. Extract 2-3 key points from the given medical text. Return only the key points in bullet format, without adding any new information."
          },
          {
            role: "user",
            content: `Extract 2-3 key points from this medical text:\n\n${improvedText}`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      const keyPoints = keyPointsResponse.choices[0]?.message?.content || "• Key points could not be extracted";
      
      setSummary(improvedText);
      setNotes(keyPoints);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving the summarized record
  const handleSaveRecord = (): void => {
    if (!summary || !notes || !selectedPatient || !selectedEvaluator) {
      setError('Please complete assessment and ensure student and doctor are selected');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    const evaluator = evaluators.find(e => e.id === selectedEvaluator);

    if (!patient || !evaluator) {
      setError('Student or doctor not found');
      return;
    }

    const newRecord = {
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      evaluatorName: evaluator.name,
      evaluatorContact: evaluator.contact,
      date: new Date().toISOString(),
      transcriptionText: transcriptionText,
      aiSummary: summary,
      keyPoints: notes,
      duration: Math.ceil(transcriptionText.split(' ').length / 2) 
    };

    addPatientRecord(newRecord);
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
