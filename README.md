# Customer Churn Prediction

Machine learning project for predicting customer churn using XGBoost, Random Forest, and Decision Tree models. The project includes a FastAPI backend and React TypeScript frontend for model deployment.

## Dataset

[Telco Customer Churn Dataset](https://www.kaggle.com/datasets/blastchar/telco-customer-churn) from Kaggle

## Installation

### Option 1: Conda Environment (Recommended)
```bash
conda env create -f churn_prediction_env.yaml
conda activate churn_prediction_env
```

### Option 2: pip Requirements
```bash
pip install -r requirements.txt
```

## Running the Application

### Option 1: Normal Python

**Backend:**
```bash
cd backend
uvicorn app:app --reload
```

**Frontend:**
```bash
cd frontend
npm install  # First time only - installs dependencies
npm start    # Starts the development server
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### Option 2: Docker

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

For detailed Docker setup, see [DOCKER_README.md](DOCKER_README.md)
