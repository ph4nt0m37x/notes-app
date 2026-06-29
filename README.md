# Notes App

A simple Notes application demonstrating a complete DevOps workflow using Docker, Kubernetes, GitHub Actions, and Argo CD.

## Project Structure

notes-app
├── backend/
├── frontend/
├── k8s/
├── .github/workflows/
├── docker-compose.yml
└── README.md

## Tech Stack
- Frontend: React
- Backend: Flask
- Database: MongoDB
- Containerization: Docker & Docker Compose
- CI: GitHub Actions
- CD: Argo CD (GitOps)
- Orchestration: Kubernetes (k3d)

## Running locally


### Docker Compose

```docker-compose up --build```

### Kubernetes

- Create the cluster:

```k3d cluster create mycluster```

- Install Argo CD:

```kubectl create namespace argocd```

```kubectl apply -n argocd \ -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.1.9/manifests/install.yaml```

- Deploy the application:

Create a new application in Argo CD using:

- Repository URL: [https://github.com/ph4nt0m37x/notes-app](https://github.com/ph4nt0m37x/notes-app/)
- Revision: main
- Path: k8s
- Destination Namespace: notes-app

Enable Automatic Sync and Argo CD will deploy and keep the application synchronized with the Kubernetes cluster.
