/** API service layer - handles HTTP communication with the FastAPI backend */
import { CustomerData, PredictionResult, ApiError } from '../types';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Predict churn API
export const predictChurn = async (data: CustomerData): Promise<PredictionResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Prediction failed');
    }

    const result: PredictionResult = await response.json();
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error('An unknown error occurred');
  }
};