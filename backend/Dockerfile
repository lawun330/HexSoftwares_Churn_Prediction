# Backend Dockerfile - FastAPI application
FROM python:3.11-slim

# Set working directory (will be /app/backend when running)
WORKDIR /app/backend

# Copy backend requirements file
COPY backend/backend-requirements.txt backend-requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r backend-requirements.txt

# Copy backend application code
COPY backend/app.py ./backend/

# Note: Models, preprocessors, and data are mounted as volumes in docker-compose.yml
# They will be available at /app/models, /app/preprocessors, /app/data

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
