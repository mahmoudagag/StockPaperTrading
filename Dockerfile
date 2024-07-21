###### Stage 1: Build the React application
FROM node:14-alpine as build_frontend

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY frontend/package*.json ./

# Install dependencies
RUN npm install --production

# Set environment variable
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Copy the rest of the application code
COPY /frontend .

# Build the React app for production
RUN npm run build

###### Stage 2: build backend
FROM golang:1.21 AS build_backend

# Set destination for COPY
WORKDIR /build

# Copy go mod and sum files
COPY /backend/go.mod /backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY /backend .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -o /build/StockPaperTrading

ARG API_KEY
ENV API_KEY=$API_KEY
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI
ARG JWT_ENCRIPTION_KEY
ENV JWT_ENCRIPTION_KEY=$JWT_ENCRIPTION_KEY

# Copy the built executable from builder stage
COPY --from=build_frontend /app  .

# Specify the command to run the executable
CMD ["/build/StockPaperTrading"]