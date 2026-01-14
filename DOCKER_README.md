# Docker Setup for Customer Churn Prediction

This project uses Docker to containerize both the backend (FastAPI) and frontend (React) applications.

## Files

1. **`backend/backend.Dockerfile`** - Builds the FastAPI backend container
2. **`frontend/frontend.Dockerfile`** - Builds the React frontend container
3. **`docker-compose.yml`** - Orchestrates both services
4. **`backend/backend-requirements.txt`** - Backend Python dependencies for Docker
5. **`.dockerignore`** (root) - Files to exclude from backend Docker builds
6. **`frontend/.dockerignore`** - Files to exclude from frontend Docker builds

## Architecture

### A. Dockerfiles

This project uses **two separate Dockerfiles** (one for backend, one for frontend) instead of a single container. This follows Docker and microservices best practices:

**Benefits:**
- **Separation of concerns**: Backend (Python/FastAPI) and frontend (Node.js/React) are different services
- **Different technology stacks**: Backend needs Python, frontend needs Node.js
- **Independent scaling**: Scale backend and frontend independently
- **Smaller images**: Each container only includes what it needs
- **Better resource management**: Allocate resources per service
- **Easier debugging**: Isolate issues to one service
- **Independent updates**: Update one service without rebuilding the other
- **Industry standard**: Microservices pattern used in production

The `docker-compose.yml` runs both containers together, but they remain independent and can be deployed separately if needed.

### B. .dockerignore Files

This project uses **two `.dockerignore` files** following Docker best practices:

1. **`.dockerignore`** (project root) - Used by backend builds
   - Build context: `.` (project root)
   - Excludes: Python cache, Node modules, IDE files, Jupyter notebooks, Git files

2. **`frontend/.dockerignore`** - Used by frontend builds
   - Build context: `./frontend`
   - Excludes: Node modules, build files, environment files

**Why two files?** Docker only looks for `.dockerignore` in the build context directory, not parent directories. With different build contexts (`.` for backend, `./frontend` for frontend), separate `.dockerignore` files are required.

**Best Practice**: One `.dockerignore` per build context. This ensures optimal build performance and prevents unnecessary files from being copied into Docker images.

### C. Requirements Files

The backend Dockerfile uses **`backend/backend-requirements.txt`**, which contains only the dependencies needed for the API (no Jupyter, no visualization packages). This provides a smaller, faster Docker image optimized for production.

## Application Installation with Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start both services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Build and Run Separately

#### Backend:
```bash
# Build backend image
docker build -t churn-backend -f backend/backend.Dockerfile .

# Run backend container
docker run -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  -v $(pwd)/preprocessors:/app/preprocessors \
  -v $(pwd)/data:/app/data \
  churn-backend
```

#### Frontend:
```bash
# Build frontend image
cd frontend
docker build -t churn-frontend -f frontend.Dockerfile .

# Run frontend container
docker run -p 3000:3000 churn-frontend
```

## Important Notes:

1. **Model Files**: The models, preprocessors, and data directories are mounted as volumes, so they must exist in the project root.

2. **Ports**: Make sure ports 3000 and 8000 are not in use by other applications.

3. **Environment Variables**: The frontend uses `REACT_APP_API_URL` environment variable (set in docker-compose.yml).

4. **Hot Reload**: The frontend volumes are configured for development. For production, build the frontend and serve static files.