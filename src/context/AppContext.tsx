import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, Patient, Evaluator, PatientRecord } from '../types';
import { apiService } from '../services/api';

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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | string>('');
  const [patientsLoading, setPatientsLoading] = useState<boolean>(false);
  const [patientsError, setPatientsError] = useState<string>('');

  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState<number | string>('');
  const [evaluatorsLoading, setEvaluatorsLoading] = useState<boolean>(false);
  const [evaluatorsError, setEvaluatorsError] = useState<string>('');

  const [transcriptionText, setTranscriptionText] = useState<string>('');

  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [patientRecordsLoading, setPatientRecordsLoading] = useState<boolean>(false);
  const [patientRecordsError, setPatientRecordsError] = useState<string>('');
  const loadPatients = async (): Promise<void> => {
    setPatientsLoading(true);
    setPatientsError('');
    try {
      const data = await apiService.getPatients();
      setPatients(data);
    } catch (error) {
      setPatientsError(error instanceof Error ? error.message : 'Failed to load patients');
      console.error('Error loading patients:', error);
    } finally {
      setPatientsLoading(false);
    }
  };

  const loadEvaluators = async (): Promise<void> => {
    setEvaluatorsLoading(true);
    setEvaluatorsError('');
    try {
      const data = await apiService.getDoctors();
      setEvaluators(data);
    } catch (error) {
      setEvaluatorsError(error instanceof Error ? error.message : 'Failed to load evaluators');
      console.error('Error loading evaluators:', error);
    } finally {
      setEvaluatorsLoading(false);
    }
  };

  const loadPatientRecords = async (): Promise<void> => {
    setPatientRecordsLoading(true);
    setPatientRecordsError('');
    try {
      const data = await apiService.getPatientRecords();
      setPatientRecords(data);
    } catch (error) {
      setPatientRecordsError(error instanceof Error ? error.message : 'Failed to load patient records');
      console.error('Error loading patient records:', error);
    } finally {
      setPatientRecordsLoading(false);
    }
  };

  const addPatient = async (newPatient: Omit<Patient, 'id'>): Promise<void> => {
    try {
      const createdPatient = await apiService.addPatient(newPatient);
      setPatients(prev => [...prev, createdPatient]);
      await loadPatients();
    } catch (error) {
      setPatientsError(error instanceof Error ? error.message : 'Failed to add patient');
      throw error;
    }
  };

  const addEvaluator = async (newEvaluator: Omit<Evaluator, 'id'>): Promise<void> => {
    try {
      const createdEvaluator = await apiService.addDoctor(newEvaluator);
      setEvaluators(prev => [...prev, createdEvaluator]);
      await loadEvaluators();
    } catch (error) {
      setEvaluatorsError(error instanceof Error ? error.message : 'Failed to add evaluator');
      throw error;
    }
  };
  const updateTranscription = (text: string): void => {
    setTranscriptionText(text);
  };

  const clearTranscription = (): void => {
    setTranscriptionText('');
  };

  const stopRecording = (): void => {
    window.dispatchEvent(new CustomEvent('stopRecording'));
  };

  const addPatientRecord = async (record: Omit<PatientRecord, 'id'>): Promise<void> => {
    try {
      const createdRecord = await apiService.savePatientRecord(record);
      setPatientRecords(prev => [createdRecord, ...prev]);
      await loadPatientRecords();
    } catch (error) {
      console.error('Error adding patient record:', error);
      throw error;
    }
  };
  const summarizeText = async (text: string): Promise<string> => {
    try {
      const response = await apiService.summarizeText(text);
      return response.summary;
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw error;
    }
  };

  const extractKeyPoints = async (text: string): Promise<string> => {
    try {
      const response = await apiService.extractKeyPoints(text);
      return response.key_points;
    } catch (error) {
      console.error('Error extracting key points:', error);
      throw error;
    }
  };


  useEffect(() => {
    loadPatients();
    loadEvaluators();
    loadPatientRecords();
  }, []);

  const value: AppContextType = {
    patients,
    selectedPatient,
    evaluators,
    selectedEvaluator,
    transcriptionText,
    patientRecords,
    patientsLoading,
    patientsError,
    evaluatorsLoading,
    evaluatorsError,
    patientRecordsLoading,
    patientRecordsError,
    loadPatients,
    loadEvaluators,
    loadPatientRecords,
    addPatient,
    setSelectedPatient,
    addEvaluator,
    setSelectedEvaluator,
    updateTranscription,
    clearTranscription,
    stopRecording,
    addPatientRecord,
    summarizeText,
    extractKeyPoints
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
