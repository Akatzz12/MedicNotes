import React, { useState, useEffect, useRef } from 'react';
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

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

const RecordingSection: React.FC<RecordingSectionProps> = ({ onTranscriptionUpdate }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const { transcriptionText, updateTranscription } = useAppContext();
  const finalTranscriptRef = useRef<string>('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    } else {
      setIsSupported(true);
      setError('');
    }
  }, []);

  useEffect(() => {
    onTranscriptionUpdate(transcriptionText);
  }, [transcriptionText, onTranscriptionUpdate]);

  useEffect(() => {
    const handleStopRecording = () => {
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    };

    window.addEventListener('stopRecording', handleStopRecording);
    return () => {
      window.removeEventListener('stopRecording', handleStopRecording);
    };
  }, [isRecording]);

  const initializeSpeechRecognition = (): SpeechRecognition | null => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          // Add final transcript to our permanent storage
          finalTranscriptRef.current += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      
      const displayText = finalTranscriptRef.current + (interimTranscript ? ` ${interimTranscript}` : '');
      updateTranscription(displayText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      updateTranscription(finalTranscriptRef.current);
    };

    return recognition;
  };

  const handleRecordingToggle = (): void => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setError('');
      updateTranscription('');
      finalTranscriptRef.current = ''; 
      
      const recognition = initializeSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

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
          variant={isRecording ? "contained" : "outlined"}
          color={isRecording ? "error" : "warning"}
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          onClick={handleRecordingToggle}
          disabled={!isSupported}
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
          {isRecording ? 'Stop Recording' : 'Start Recording'}
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
      {!isSupported && (
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
            {isRecording ? (
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
