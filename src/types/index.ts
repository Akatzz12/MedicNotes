export interface Patient {
  id: number;
  name: string;
  age: number;
  contact: string;
}

export interface PatientRecord {
  id: number;
  patientId: number;
  patientName: string;
  patientAge: number;
  evaluatorName: string;
  evaluatorContact: string;
  date: string;
  transcriptionText: string;
  aiSummary: string;
  keyPoints: string;
  duration: number; // in minutes
  visitCount?: number; // Optional for grouped records
}

export interface Evaluator {
  id: number;
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
  // State
  patients: Patient[];
  selectedPatient: number | string;
  evaluators: Evaluator[];
  selectedEvaluator: number | string;
  transcriptionText: string;
  patientRecords: PatientRecord[];
  
  // Patient functions
  addPatient: (patient: Patient) => void;
  updatePatient: (patientId: number, updatedPatient: Partial<Patient>) => void;
  deletePatient: (patientId: number) => void;
  setSelectedPatient: (patientId: number | string) => void;
  
  // Evaluator functions
  addEvaluator: (evaluator: Evaluator) => void;
  updateEvaluator: (evaluatorId: number, updatedEvaluator: Partial<Evaluator>) => void;
  deleteEvaluator: (evaluatorId: number) => void;
  setSelectedEvaluator: (evaluatorId: number | string) => void;
  
  // Transcription functions
  updateTranscription: (text: string) => void;
  clearTranscription: () => void;
  stopRecording: () => void;
  
  // Patient record functions
  addPatientRecord: (record: Omit<PatientRecord, 'id'>) => void;
  deletePatientRecord: (recordId: number) => void;
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
  onPatientAdd: (patient: Patient) => void;
}

export interface EvaluatorSelectorProps {
  evaluators: Evaluator[];
  selectedEvaluator: number | string;
  onEvaluatorSelect: (evaluatorId: number | string) => void;
  onEvaluatorAdd: (evaluator: Evaluator) => void;
}

export interface RecordingSectionProps {
  onTranscriptionUpdate: (text: string) => void;
}

export interface SummarizerSectionProps {
  transcriptionText: string;
}

