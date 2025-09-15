import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Alert
} from '@mui/material';
import { Mic as MicIcon, Stop as StopIcon } from '@mui/icons-material';
import { RecordingSectionProps } from '../types';
import { useAppContext } from '../context/AppContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const RecordingSection: React.FC<RecordingSectionProps> = ({ onTranscriptionUpdate }) => {
  const [error, setError] = useState<string>('');
  const { transcriptionText, updateTranscription } = useAppContext();

  const {
    finalTranscript,
    interimTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    } else {
      setError('');
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    const combined = `${finalTranscript}${interimTranscript ? ` ${interimTranscript}` : ''}`.trim();
    updateTranscription(combined);
    onTranscriptionUpdate(combined);
  }, [finalTranscript, interimTranscript, updateTranscription, onTranscriptionUpdate]);

  useEffect(() => {
    const handleStopRecording = () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };

    window.addEventListener('stopRecording', handleStopRecording);
    return () => {
      window.removeEventListener('stopRecording', handleStopRecording);
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [listening]);

  const handleRecordingToggle = (): void => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      setError('');
      resetTranscript();
      updateTranscription('');
      SpeechRecognition.startListening({ continuous: true, interimResults: true, language: 'en-US', clearTranscriptOnListen: true });
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Title and Recording Button Row */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        mb: 2
      }}>
        <Typography variant="h6" component="h2" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.2rem' }}>
          Record Your Evaluation
        </Typography>
        <Button
          variant={listening ? "contained" : "outlined"}
          color={listening ? "error" : "warning"}
          startIcon={listening ? <StopIcon /> : <MicIcon />}
          onClick={handleRecordingToggle}
          disabled={!browserSupportsSpeechRecognition}
          size="medium"
          sx={{ 
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            minWidth: 180
          }}
        >
          {listening ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </Box>

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

      {/* Browser Support Warning */}
      {!browserSupportsSpeechRecognition && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Speech recognition is not supported in this browser. Please use Chrome or Edge for the best experience.
        </Alert>
      )}

      {/* Real-time Transcription Display */}
      <Box sx={{ 
        p: 3,
        backgroundColor: 'rgba(255, 152, 0, 0.04)',
        borderRadius: 2,
        border: '1px solid rgba(255, 152, 0, 0.12)',
        minHeight: 200
      }}>
        {transcriptionText ? (
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Live Speech-to-Text Transcription"
            value={transcriptionText}
            InputProps={{
              readOnly: true,
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 2
              }
            }}
          />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: 200,
            color: 'text.secondary',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {listening ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  🎤 Listening... Speak clearly into your microphone
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your speech will be transcribed in real-time
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Click "Start Recording" to begin your evaluation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Make sure your microphone is enabled and working
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RecordingSection;
