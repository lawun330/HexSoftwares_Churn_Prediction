/** TypeScript type definitions for the application (API responses, form data, errors) */

// API Response Types
export interface PredictionResult {
  prediction: string;
  probability: {
    no_churn: number;
    churn: number;
  };
}

// Form Data Types
export interface CustomerData {
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
}

// API Error Response
export interface ApiError {
  detail: string;
}