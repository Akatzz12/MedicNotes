import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppContextType, Patient, Evaluator, PatientRecord } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State for patients
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | string>('');

  // State for evaluators
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState<number | string>('');

  // State for transcription
  const [transcriptionText, setTranscriptionText] = useState<string>('');

  // State for patient records
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);


  // Patient management functions
  const addPatient = (newPatient: Patient): void => {
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (patientId: number, updatedPatient: Partial<Patient>): void => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, ...updatedPatient } : p));
  };

  const deletePatient = (patientId: number): void => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
    if (selectedPatient === patientId) {
      setSelectedPatient('');
    }
  };

  // Evaluator management functions
  const addEvaluator = (newEvaluator: Evaluator): void => {
    setEvaluators(prev => [...prev, newEvaluator]);
  };

  const updateEvaluator = (evaluatorId: number, updatedEvaluator: Partial<Evaluator>): void => {
    setEvaluators(prev => prev.map(e => e.id === evaluatorId ? { ...e, ...updatedEvaluator } : e));
  };

  const deleteEvaluator = (evaluatorId: number): void => {
    setEvaluators(prev => prev.filter(e => e.id !== evaluatorId));
    if (selectedEvaluator === evaluatorId) {
      setSelectedEvaluator('');
    }
  };

  // Transcription management
  const updateTranscription = (text: string): void => {
    setTranscriptionText(text);
  };

  const clearTranscription = (): void => {
    setTranscriptionText('');
  };

  const stopRecording = (): void => {
   
    window.dispatchEvent(new CustomEvent('stopRecording'));
  };

  // Patient record management functions
  const addPatientRecord = (record: Omit<PatientRecord, 'id'>): void => {
    const newRecord: PatientRecord = {
      ...record,
      id: Date.now()
    };
    setPatientRecords(prev => [newRecord, ...prev]); 
  };

  const deletePatientRecord = (recordId: number): void => {
    setPatientRecords(prev => prev.filter(record => record.id !== recordId));
  };

  const value: AppContextType = {
    patients,
    selectedPatient,
    evaluators,
    selectedEvaluator,
    transcriptionText,
    patientRecords,
    
    addPatient,
    updatePatient,
    deletePatient,
    setSelectedPatient,
    
    // Evaluator functions
    addEvaluator,
    updateEvaluator,
    deleteEvaluator,
    setSelectedEvaluator,
    
    // Transcription functions
    updateTranscription,
    clearTranscription,
    stopRecording,
    
    // Patient record functions
    addPatientRecord,
    deletePatientRecord
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
