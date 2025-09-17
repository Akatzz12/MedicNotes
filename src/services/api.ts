
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface Patient {
  id?: number;
  name: string;
  age: number;
  contact: string;
}

export interface Evaluator {
  id?: number;
  name: string;
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

export interface StatusResponse {
  status: string;
}

export interface SummarizeResponse {
  summary: string;
}

export interface KeyPointsResponse {
  key_points: string;
}

class ApiService {
  private readonly baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Server Error: Unable to connect to server. Please ensure the server is running.');
      }
      
      throw new Error('Server Error: Unable to connect to server');
    }
  }


  async getWelcome(): Promise<{message: string}> {
    return this.request<{message: string}>('/');
  }
  async saveText(text: string): Promise<StatusResponse> {
    return this.request<StatusResponse>('/save', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async getHistory(): Promise<string[]> {
    return this.request<string[]>('/history');
  }

  async summarizeText(text: string): Promise<SummarizeResponse> {
    return this.request<SummarizeResponse>('/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async extractKeyPoints(text: string): Promise<KeyPointsResponse> {
    return this.request<KeyPointsResponse>('/key-points', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async addDoctor(doctor: Omit<Evaluator, 'id'>): Promise<Evaluator> {
    return this.request<Evaluator>('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctor),
    });
  }

  async getDoctors(): Promise<Evaluator[]> {
    return this.request<Evaluator[]>('/doctors');
  }

  async addPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    return this.request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async getPatients(): Promise<Patient[]> {
    return this.request<Patient[]>('/patients');
  }

  async savePatientRecord(record: Omit<PatientRecord, 'id'>): Promise<PatientRecord> {
    const recordText = `Student Record - ${record.date}
Student: ${record.patientName} (ID: ${record.patientId}, Age: ${record.patientAge})
Instructor: ${record.evaluatorName} (${record.evaluatorContact})
Transcription: ${record.transcriptionText}
AI Summary: ${record.aiSummary}
Key Points: ${record.keyPoints || 'None'}`;

    await this.request<StatusResponse>('/save', {
      method: 'POST',
      body: JSON.stringify({ text: recordText }),
    });
    return {
      id: Date.now(),
      patientId: record.patientId,
      patientName: record.patientName,
      patientAge: record.patientAge,
      evaluatorName: record.evaluatorName,
      evaluatorContact: record.evaluatorContact,
      date: record.date,
      transcriptionText: record.transcriptionText,
      aiSummary: record.aiSummary,
      keyPoints: record.keyPoints,
      duration: record.duration
    };
  }

  async getPatientRecords(): Promise<PatientRecord[]> {
    const history = await this.request<string[]>('/history');
    
    if (!Array.isArray(history)) {
      console.warn('History is not an array:', history);
      return [];
    }
    
    const patientRecords: PatientRecord[] = [];
    
    history.forEach((entry, index) => {
      if (entry?.startsWith('Student Record -')) {
        const lines = entry.split('\n');
        
        if (lines.length < 6) {
          console.warn('Invalid patient record format - insufficient lines:', entry);
          return;
        }
        
        const dateLine = lines[0]?.replace('Student Record - ', '') || '';
        
        const patientLine = lines[1] || '';
        const patientRegex = /Student: (.+) \(ID: (\d+), Age: (\d+)\)/;
        const patientMatch = patientRegex.exec(patientLine);
        
        const doctorLine = lines[2] || '';
        const doctorRegex = /Instructor: (.+) \((.+)\)/;
        const doctorMatch = doctorRegex.exec(doctorLine);
        
        if (patientMatch && doctorMatch && lines[3] && lines[4] && lines[5]) {
          patientRecords.push({
            id: index + 1,
            patientId: parseInt(patientMatch[2]),
            patientName: patientMatch[1],
            patientAge: parseInt(patientMatch[3]),
            evaluatorName: doctorMatch[1],
            evaluatorContact: doctorMatch[2],
            date: dateLine,
            transcriptionText: lines[3]?.replace('Transcription: ', '') || '',
            aiSummary: lines[4]?.replace('AI Summary: ', '') || '',
            keyPoints: lines[5]?.replace('Key Points: ', '') || undefined,
            duration: 0
          });
        }
      }
    });
    
    return patientRecords;
  }
}

export const apiService = new ApiService();
export default ApiService;
