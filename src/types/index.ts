export interface Patient {
  id?: number;
  name: string;
  age: number;
  contact: string;
}

export interface PatientRecord {
  id?: number;
  patientId: number;
  patientName: string;
  patientAge: number;
  evaluatorName: string;
  evaluatorContact: string;
  date: string; 
  transcriptionText: string;
  aiSummary: string;
  keyPoints?: string;
  duration: number;
}

export interface Evaluator {
  id?: number;
  name: string;
  contact: string;
}

export interface ModalField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email';
  required: boolean;
}

export interface FormData {
  [key: string]: string | number;
}

export interface AppContextType {
  patients: Patient[];
  selectedPatient: number | string;
  evaluators: Evaluator[];
  selectedEvaluator: number | string;
  transcriptionText: string;
  patientRecords: PatientRecord[];
  patientsLoading: boolean;
  patientsError: string;
  evaluatorsLoading: boolean;
  evaluatorsError: string;
  patientRecordsLoading: boolean;
  patientRecordsError: string;
  loadPatients: () => Promise<void>;
  loadEvaluators: () => Promise<void>;
  loadPatientRecords: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  setSelectedPatient: (patientId: number | string) => void;
  addEvaluator: (evaluator: Omit<Evaluator, 'id'>) => Promise<void>;
  setSelectedEvaluator: (evaluatorId: number | string) => void;
  updateTranscription: (text: string) => void;
  clearTranscription: () => void;
  stopRecording: () => void;
  addPatientRecord: (record: Omit<PatientRecord, 'id'>) => Promise<void>;
  summarizeText: (text: string) => Promise<string>;
  extractKeyPoints: (text: string) => Promise<string>;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: ModalField[];
  onSubmit: (formData: FormData) => void;
  submitButtonText?: string;
}

export interface PatientSelectorProps {
  patients: Patient[];
  selectedPatient: number | string;
  onPatientSelect: (patientId: number | string) => void;
  onPatientAdd: (patient: Omit<Patient, 'id'>) => Promise<void>;
}

export interface EvaluatorSelectorProps {
  evaluators: Evaluator[];
  selectedEvaluator: number | string;
  onEvaluatorSelect: (evaluatorId: number | string) => void;
  onEvaluatorAdd: (evaluator: Omit<Evaluator, 'id'>) => Promise<void>;
}

export interface RecordingSectionProps {
  onTranscriptionUpdate: (text: string) => void;
}

export interface SummarizerSectionProps {
  transcriptionText: string;
}

