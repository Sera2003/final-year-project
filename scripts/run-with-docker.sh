#!/bin/bash

# Script to build and run the WolfFitness application using Docker

echo "Building and starting WolfFitness application with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker Desktop and try again."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose is not installed. Please install Docker Desktop which includes docker-compose."
    exit 1
fi

# Build and start the services
echo "Building and starting services..."
docker-compose up --build -d

# Wait a few seconds for services to start
echo "Waiting for services to start..."
sleep 10

# Check if services are running
echo "Checking service status..."
docker-compose ps

echo ""
echo "WolfFitness application is now running!"
echo "Frontend: http://localhost:5173"
echo "Backend API: https://localhost:4000"
echo "MongoDB: localhost:27017"
echo ""
echo "To stop the services, run: docker-compose down"