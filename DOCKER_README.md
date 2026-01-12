# Docker Setup for Customer Churn Prediction

This project uses Docker to containerize both the backend (FastAPI) and frontend (React) applications.

## Files Created:

1. **`backend/Dockerfile`** - Builds the FastAPI backend container
2. **`frontend/Dockerfile`** - Builds the React frontend container
3. **`docker-compose.yml`** - Orchestrates both services
4. **`requirements.txt`** (root) - Python dependencies (used by both local development and Docker)
5. **`.dockerignore`** (root) - Files to exclude from backend Docker builds
7. **`frontend/.dockerignore`** - Files to exclude from frontend Docker builds

## Architecture & Best Practices:

### Why Two Separate Dockerfiles?

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

### .dockerignore Files

This project uses **two `.dockerignore` files** following Docker best practices:

1. **`.dockerignore`** (project root) - Used by backend builds
   - Build context: `.` (project root)
   - Excludes: Python cache, Node modules, IDE files, Jupyter notebooks, Git files

2. **`frontend/.dockerignore`** - Used by frontend builds
   - Build context: `./frontend`
   - Excludes: Node modules, build files, environment files

**Why two files?** Docker only looks for `.dockerignore` in the build context directory, not parent directories. Since we have different build contexts (`.` for backend, `./frontend` for frontend), we need separate `.dockerignore` files.

**Best Practice**: One `.dockerignore` per build context. This ensures optimal build performance and prevents unnecessary files from being copied into Docker images.

### Requirements Files

**Current Setup**: This project uses a single **`requirements.txt`** at the project root, which includes all dependencies (backend API, Jupyter notebooks, visualization packages). The backend Dockerfile uses this file.

**Optional: Multiple Requirements Files**

You may choose to create separate `requirements.txt` files for different purposes:

1. **`requirements.txt`** (project root) - Full development environment
   - **Purpose**: Complete development setup
   - **Contains**: All dependencies (backend API + Jupyter notebooks + visualization)
   - **Use for**: Local development, conda environment setup, running notebooks

2. **`backend/requirements.txt`** (optional) - Minimal production runtime
   - **Purpose**: Optimized production deployment
   - **Contains**: Only backend API dependencies (no Jupyter, no visualization packages)
   - **Use for**: Docker backend container, production deployment
   - **Benefits**: 
     - Smaller Docker image (~500MB+ savings)
     - Faster Docker builds
     - Follows production best practices (only install what's needed)
     - Faster security scanning

**Why consider multiple files?** While a single `requirements.txt` works, using a minimal `backend/requirements.txt` for Docker provides production optimizations. The current setup uses one file for simplicity, which is perfectly acceptable for development and smaller deployments.

## How to Use:

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
docker build -t churn-backend -f backend/Dockerfile .

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
docker build -t churn-frontend .

# Run frontend container
docker run -p 3000:3000 churn-frontend
```

## Accessing the Application:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Important Notes:

1. **Model Files**: The models, preprocessors, and data directories are mounted as volumes, so they must exist in your project root.

2. **Ports**: Make sure ports 3000 and 8000 are not in use by other applications.

3. **Environment Variables**: The frontend uses `REACT_APP_API_URL` environment variable (set in docker-compose.yml).

4. **Hot Reload**: The frontend volumes are configured for development. For production, you'd build the frontend and serve static files.
