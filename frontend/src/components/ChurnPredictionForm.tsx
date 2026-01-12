/** Main form component for customer churn prediction - handles user input and displays prediction results */

import { useState, FormEvent, ChangeEvent } from 'react';
import { CustomerData, PredictionResult } from '../types';
import { predictChurn } from '../services/api';
import './ChurnPredictionForm.css';

const ChurnPredictionForm: React.FC = () => {

  // Default form data
  const [formData, setFormData] = useState<CustomerData>({
    gender: 'Male',
    SeniorCitizen: 0,
    Partner: 'No',
    Dependents: 'No',
    tenure: 0,
    PhoneService: 'Yes',
    MultipleLines: 'No',
    InternetService: 'DSL',
    OnlineSecurity: 'No',
    OnlineBackup: 'No',
    DeviceProtection: 'No',
    TechSupport: 'No',
    StreamingTV: 'No',
    StreamingMovies: 'No',
    Contract: 'Month-to-month',
    PaperlessBilling: 'No',
    PaymentMethod: 'Electronic check',
    MonthlyCharges: 0,
    TotalCharges: 0
  });

  // State variables for prediction result, loading state, and error
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'SeniorCitizen' || name === 'tenure' || 
              name === 'MonthlyCharges' || name === 'TotalCharges' 
              ? (name === 'SeniorCitizen' ? parseInt(value, 10) : parseFloat(value))
              : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictChurn(formData);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Render the component
  return (
    <div className="prediction-container">
      <h1>Customer Churn Prediction</h1>
      
      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-row">
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Senior Citizen</label>
            <select name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleChange}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Partner</label>
            <select name="Partner" value={formData.Partner} onChange={handleChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dependents</label>
            <select name="Dependents" value={formData.Dependents} onChange={handleChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tenure (months)</label>
            <input 
              type="number" 
              name="tenure" 
              value={formData.tenure} 
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Service</label>
            <select name="PhoneService" value={formData.PhoneService} onChange={handleChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Multiple Lines</label>
            <select name="MultipleLines" value={formData.MultipleLines} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No phone service">No phone service</option>
            </select>
          </div>

          <div className="form-group">
            <label>Internet Service</label>
            <select name="InternetService" value={formData.InternetService} onChange={handleChange}>
              <option value="DSL">DSL</option>
              <option value="Fiber optic">Fiber optic</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Online Security</label>
            <select name="OnlineSecurity" value={formData.OnlineSecurity} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </div>

          <div className="form-group">
            <label>Online Backup</label>
            <select name="OnlineBackup" value={formData.OnlineBackup} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </div>

          <div className="form-group">
            <label>Device Protection</label>
            <select name="DeviceProtection" value={formData.DeviceProtection} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tech Support</label>
            <select name="TechSupport" value={formData.TechSupport} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Streaming TV</label>
            <select name="StreamingTV" value={formData.StreamingTV} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </div>

          <div className="form-group">
            <label>Streaming Movies</label>
            <select name="StreamingMovies" value={formData.StreamingMovies} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contract</label>
            <select name="Contract" value={formData.Contract} onChange={handleChange}>
              <option value="Month-to-month">Month-to-month</option>
              <option value="One year">One year</option>
              <option value="Two year">Two year</option>
            </select>
          </div>

          <div className="form-group">
            <label>Paperless Billing</label>
            <select name="PaperlessBilling" value={formData.PaperlessBilling} onChange={handleChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Payment Method</label>
            <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange}>
              <option value="Electronic check">Electronic check</option>
              <option value="Mailed check">Mailed check</option>
              <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
              <option value="Credit card (automatic)">Credit card (automatic)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monthly Charges</label>
            <input 
              type="number" 
              name="MonthlyCharges" 
              value={formData.MonthlyCharges} 
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Total Charges</label>
            <input 
              type="number" 
              name="TotalCharges" 
              value={formData.TotalCharges} 
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Predicting...' : 'Predict Churn'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="result-container">
          <h2>Prediction Result: {result.prediction}</h2>
          <div className={`prediction-result ${result.prediction === 'Churn' ? 'churn' : 'no-churn'}`}>
            <div className="probability-bar">
              <div className="probability-item">
                <span>Churn: {(result.probability.churn * 100).toFixed(2)}%</span>
                <div className="bar">
                  <div 
                    className="bar-fill churn" 
                    style={{width: `${result.probability.churn * 100}%`}}
                  ></div>
                </div>
              </div>
              <div className="probability-item">
                <span>No Churn: {(result.probability.no_churn * 100).toFixed(2)}%</span>
                <div className="bar">
                  <div 
                    className="bar-fill no-churn" 
                    style={{width: `${result.probability.no_churn * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the component
export default ChurnPredictionForm;