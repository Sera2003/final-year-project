#!/bin/bash

# Script to test the containerized WolfFitness application

echo "Testing containerized WolfFitness application..."

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

# Check if services are running
echo "Checking if services are running..."
if docker-compose ps | grep -q "Up"; then
    echo "✓ Services are running"
else
    echo "✗ Services are not running. Starting them now..."
    docker-compose up -d
    sleep 10
fi

# Test MongoDB connection
echo "Testing MongoDB connection..."
if docker-compose exec mongodb mongo --quiet --eval "db.runCommand({ ping: 1 }).ok" > /dev/null 2>&1; then
    echo "✓ MongoDB is accessible"
else
    echo "✗ MongoDB is not accessible"
fi

# Test backend API
echo "Testing backend API..."
if curl -s --max-time 5 http://localhost:4000/ | grep -q "API Working"; then
    echo "✓ Backend API is accessible"
else
    echo "✗ Backend API is not accessible"
fi

# Test frontend
echo "Testing frontend..."
if curl -s --max-time 5 http://localhost:5173/ | grep -q "<title>WOLFITNESS</title>"; then
    echo "✓ Frontend is accessible"
else
    echo "✗ Frontend is not accessible"
fi

echo ""
echo "Containerized WolfFitness application test completed!"
echo "Access the application at:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:4000"