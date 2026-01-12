from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np
import os
import logging


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Initialize FastAPI app
app = FastAPI(title="Customer Churn Prediction API", version="1.0")


# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load model and preprocessing objects
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(PROJECT_ROOT, "models")
PREPROCESSORS_DIR = os.path.join(PROJECT_ROOT, "preprocessors")
DATA_DIR = os.path.join(PROJECT_ROOT, "data", "processed")

model = joblib.load(os.path.join(MODEL_DIR, "churn_predictor_xgboost.joblib"))
ordinal_encoder = joblib.load(os.path.join(PREPROCESSORS_DIR, "ordinal_encoder.joblib"))
OH_encoder = joblib.load(os.path.join(PREPROCESSORS_DIR, "onehot_encoder.joblib"))
feature_names = joblib.load(os.path.join(DATA_DIR, "feature_names.joblib"))
one_hot_cols_order = joblib.load(os.path.join(DATA_DIR, "one_hot_encoded_cols_order.joblib"))


# Input schema
class CustomerData(BaseModel):
    gender: str = Field(..., description="Gender: Male or Female")
    SeniorCitizen: int = Field(..., ge=0, le=1)
    Partner: str = Field(..., description="Partner: Yes or No")
    Dependents: str = Field(..., description="Dependents: Yes or No")
    tenure: int = Field(..., ge=0, description="Tenure in months")
    PhoneService: str = Field(..., description="Phone Service: Yes or No")
    MultipleLines: str = Field(..., description="Multiple Lines: No, Yes, or No phone service")
    InternetService: str = Field(..., description="Internet Service: DSL, Fiber optic, or No")
    OnlineSecurity: str = Field(..., description="Online Security: No, Yes, or No internet service")
    OnlineBackup: str = Field(..., description="Online Backup: No, Yes, or No internet service")
    DeviceProtection: str = Field(..., description="Device Protection: No, Yes, or No internet service")
    TechSupport: str = Field(..., description="Tech Support: No, Yes, or No internet service")
    StreamingTV: str = Field(..., description="Streaming TV: No, Yes, or No internet service")
    StreamingMovies: str = Field(..., description="Streaming Movies: No, Yes, or No internet service")
    Contract: str = Field(..., description="Contract: Month-to-month, One year, or Two year")
    PaperlessBilling: str = Field(..., description="Paperless Billing: Yes or No")
    PaymentMethod: str = Field(..., description="Payment Method: Electronic check, Mailed check, Bank transfer (automatic), or Credit card (automatic)")
    MonthlyCharges: float = Field(..., ge=0)
    TotalCharges: float = Field(..., ge=0)


# Preprocess input data
def preprocess_input(data: CustomerData) -> pd.DataFrame:
    """Preprocess input data using the same pipeline as training"""
    df = pd.DataFrame([data.dict()])
    
    # Convert TotalCharges to numeric
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
    df["TotalCharges"] = df["TotalCharges"].fillna(0.0)
    
    # Binary encoding
    binary_mapping = {'Male': 1, 'Female': 0, 'Yes': 1, 'No': 0}
    binary_cols = ['gender', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling']
    
    for col in binary_cols:
        if col == 'gender':
            df['is_male'] = df[col].map(binary_mapping)
            df = df.drop(columns=[col])
        else:
            df[col] = df[col].map(binary_mapping)
    
    # Ordinal encoding
    df['Contract'] = ordinal_encoder.transform(df[['Contract']])
    
    # One-hot encoding
    if hasattr(OH_encoder, 'feature_names_in_'):
        # Use the encoder's stored feature names (exact order from training)
        expected_onehot_cols = list(OH_encoder.feature_names_in_)
    else:
        # Fallback to saved order
        expected_onehot_cols = one_hot_cols_order

    # Reorder columns to match encoder's expected order
    df_onehot = df[expected_onehot_cols].copy()

    # Transform the data
    encoded = OH_encoder.transform(df_onehot)
    encoded_df = pd.DataFrame(encoded, columns=OH_encoder.get_feature_names_out(expected_onehot_cols))
    df = df.drop(columns=expected_onehot_cols)
    df = pd.concat([df, encoded_df], axis=1)
    
    # Ensure feature order matches training data
    df = df.reindex(columns=feature_names, fill_value=0)
    
    return df


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Customer Churn Prediction API", "version": "1.0"}


# Prediction endpoint
@app.post("/predict")
def predict_churn(customer: CustomerData):
    """Predict customer churn"""
    try:
        processed_data = preprocess_input(customer)
        prediction = model.predict(processed_data)[0]
        probability = model.predict_proba(processed_data)[0]
        
        return {
            "prediction": "Churn" if prediction == 1 else "No Churn",
            "probability": {
                "no_churn": float(probability[0]),
                "churn": float(probability[1])
            },
        }
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")


# Health check endpoint - use "curl http://localhost:8000/health" to check if the server is running
@app.get("/health")
def health_check():
    return {"status": "Customer Churn Prediction API is running"}


# Run the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)