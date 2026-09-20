# TPCrop

TPCrop is a smart crop and farm management platform that enables farmers and agricultural managers to track farming operations, manage plots, plan crop seasons, and diagnose crop diseases with an AI-powered assistant.

## Features

- Register and log in as a farmer or farm manager with JWT authentication.
- Manage farming plots with crop assignments.
- Manage crops and agricultural seasons with year ranges and progress tracking.
- Create, assign, and schedule farming tasks for each season.
- Track task completions per plot in real time.
- RAG-powered AI chatbot with Google Gemini and pgvector for coffee crop disease diagnosis and consultation.
- Agricultural community forum to share articles with likes and multi-level nested comments.
- Farm dashboard and analytics with interactive charts for season progress and user statistics.
- Cloudinary integration for avatar and image uploads.

## Tech Stack

### Backend

- Java 25 & Spring Boot
- Spring Security
- Spring Data JPA & Hibernate
- JWT authentication
- PostgreSQL with pgvector extension
- Cloudinary for image storage
- Flask
- LangChain & Google Gemini API

### Frontend

- React & TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- Zustand
- React Router DOM
- Axios
- Chart.js
- Lucide React & React Toastify

## Project Structure

```text
TPCrop/
├─ database/      # Database schema
├─ nginx/         # Nginx configuration and Dockerfile
├─ ragchatbot/    # Python Flask RAG chatbot service
├─ tpcrop/        # Spring Boot backend
└─ tpcropapp/     # React frontend
```

## Prerequisites

- Docker and Docker Compose
- Or for local development:
  - Java 25 or higher
  - Node.js and npm
  - Python 3.11+
  - PostgreSQL 16+ with pgvector
  - Google Gemini API key

## Setup

1. Clone the repository
2. Configure `.env` file, use `.env.example` for reference
3. Build and start services using Docker Compose: `docker compose up -d --build`
4. Ingest knowledge base into vector database: `docker compose exec chatbot python data_process/run.py`
5. Access the application at `http://localhost`
