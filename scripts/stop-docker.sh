#!/bin/bash

# Script to stop the WolfFitness application Docker services

echo "Stopping WolfFitness application Docker services..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose is not installed."
    exit 1
fi

# Stop the services
echo "Stopping services..."
docker-compose down

echo "WolfFitness application services have been stopped."