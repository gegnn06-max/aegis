import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface PredictionResult {
  predictions: number[];
  fraud_rate: number;
  total_reviews: number;
}

export const api = {
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/upload-dataset`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  predict: async (file: File): Promise<PredictionResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  healthCheck: async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },
};