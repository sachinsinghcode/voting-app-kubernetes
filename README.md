# Two-Tier Voting Application

This repository contains a two-tier voting application consisting of a frontend and a backend. The application is Dockerized and can be deployed to a Kubernetes cluster using Minikube.

## Prerequisites

- Docker
- Minikube
- kubectl

## Application Structure

- **Frontend**: An Express.js application serving static files and proxying API requests to the backend.
- **Backend**: A Node.js application handling API requests.

## Dockerizing the Application

### Backend

1. Create a `Dockerfile` for the backend:

    ```Dockerfile
    # filepath: /backend/Dockerfile
    FROM node:14
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    EXPOSE 3001
    CMD ["node", "index.js"]
    ```

2. Build and push the Docker image:

    ```sh
    docker build -t your-dockerhub-username/voting-backend:latest ./backend
    docker push your-dockerhub-username/voting-backend:latest
    ```

### Frontend

1. Create a `Dockerfile` for the frontend:

    ```Dockerfile
    # filepath: /frontend/Dockerfile
    FROM node:14
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    EXPOSE 3000
    CMD ["node", "index.js"]
    ```

2. Build and push the Docker image:

    ```sh
    docker build -t your-dockerhub-username/voting-frontend:latest ./frontend
    docker push your-dockerhub-username/voting-frontend:latest
    ```

## Kubernetes Deployment

### Backend Deployment and Service

1. Create `backend-deployment.yml`:

    ```yaml
    # filepath: /k8s/backend-deployment.yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: backend-deployment
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: backend
      template:
        metadata:
          labels:
            app: backend
        spec:
          containers:
          - name: backend
            image: your-dockerhub-username/voting-backend:latest
            ports:
            - containerPort: 3001
    ```

2. Create `backend-service.yml`:

    ```yaml
    # filepath: /k8s/backend-service.yml
    apiVersion: v1
    kind: Service
    metadata:
      name: backend-service
    spec:
      selector:
        app: backend
      ports:
        - protocol: TCP
          port: 3001
          targetPort: 3001
      type: ClusterIP
    ```

### Frontend Deployment and Service

1. Create `frontend-deployment.yml`:

    ```yaml
    # filepath: /k8s/frontend-deployment.yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: frontend-deployment
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: frontend
      template:
        metadata:
          labels:
            app: frontend
        spec:
          containers:
          - name: frontend
            image: your-dockerhub-username/voting-frontend:latest
            ports:
            - containerPort: 3000
    ```

2. Create frontend-service.yml:

    ```yaml
    # filepath: /k8s/frontend-service.yml
    apiVersion: v1
    kind: Service
    metadata:
      name: frontend-service
    spec:
      selector:
        app: frontend
      ports:
        - protocol: TCP
          port: 3000
          targetPort: 3000
          nodePort: 30036 # You can specify a port in the range 30000-32767 or let Kubernetes assign one
      type: NodePort
    ```

### Deploy to Minikube

1. Start Minikube:

    ```sh
    minikube start
    ```

2. Apply the Kubernetes manifests:

    ```sh
    kubectl apply -f k8s/backend-deployment.yml
    kubectl apply -f k8s/backend-service.yml
    kubectl apply -f k8s/frontend-deployment.yml
    kubectl apply -f k8s/frontend-service.yml
    ```

3. Access the frontend application:

    ```sh
    minikube service frontend-service
    ```

    This command will open the service in your default web browser. If you prefer to get the URL without opening the browser, you can use:

    ```sh
    minikube service frontend-service --url
    ```

## Conclusion

You have successfully Dockerized and deployed a two-tier voting application to a Kubernetes cluster using Minikube. The frontend application is accessible via a NodePort service, and it proxies API requests to the backend service.
