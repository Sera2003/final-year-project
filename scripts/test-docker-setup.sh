#!/bin/bash

# Script to test the Docker setup for WolfFitness

echo "Testing WolfFitness Docker setup..."

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

# Test Docker Compose configuration
echo "Validating docker-compose configuration..."
if docker-compose config > /dev/null 2>&1; then
    echo "✓ docker-compose.yml is valid"
else
    echo "✗ docker-compose.yml is invalid"
    exit 1
fi

# Test if we can build the images
echo "Testing Docker image builds..."
if docker-compose build --no-cache > /dev/null 2>&1; then
    echo "✓ Docker images can be built successfully"
else
    echo "✗ Failed to build Docker images"
    exit 1
fi

echo "Docker setup test completed successfully!"
echo "You can now run the application with: docker-compose up"