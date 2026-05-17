# WolfFitness

WolfFitness is a full-stack e-commerce application for fitness products and equipment.

## Project Structure

- `backend/` - Node.js Express server with MongoDB
- `frontend/` - React frontend with Vite
- `admin/` - Admin panel
- `docs/` - Documentation
- `scripts/` - Utility scripts

## Features

- User authentication and management
- Product catalog with categories and search
- Shopping cart and order processing
- Admin panel for product management
- Virtual try-on feature for apparel
- Product recommendations

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn
- Docker (optional, for containerized deployment)

## Installation

### Option 1: Manual Installation

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the required environment variables:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GITHUB_TOKEN=your_github_token
   GITHUB_USERNAME=your_github_username
   GITHUB_REPO=your_github_repo
   ```

4. Start the server:
   ```bash
   npm run server
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the required environment variables:
   ```
   VITE_BACKEND_URL=https://localhost:4000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Option 2: Docker Installation (Recommended)

1. Make sure Docker Desktop is installed and running

2. From the root directory, start all services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - MongoDB: localhost:27017

4. To stop the services:
   ```bash
   docker-compose down
   ```

### Docker Development Setup

For development with hot reloading:

1. Make sure Docker Desktop is installed and running

2. From the root directory, start all services in development mode:
   ```bash
   docker-compose up
   ```

3. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

4. Changes to your code will be reflected automatically (hot reloading)

5. To stop the services:
   ```bash
   docker-compose down
   ```

## API Endpoints

- `/api/user` - User management
- `/api/product` - Product management
- `/api/cart` - Shopping cart
- `/api/order` - Order processing
- `/api/tryon` - Virtual try-on feature
- `/api/recommendation` - AI recommendation system

## AI Recommendation Feature

The AI recommendation system suggests products based on:
- User browsing history
- Purchase history
- Similar product attributes
- User feedback (likes/dislikes)
- Collaborative filtering

### How it works:
1. Tracks user interactions (product views, purchases)
2. Analyzes product characteristics (categories, subcategories)
3. Generates personalized recommendations using a hybrid algorithm
4. Improves over time with user feedback

### API Endpoints:
- `GET /api/recommendation/recommendations` - Get personalized recommendations
- `POST /api/recommendation/feedback` - Submit feedback on recommendations
- `POST /api/recommendation/track-view` - Track product views

### Frontend Components:
- `AIRecommendations` - Displays recommendations on the home page
- `AIStylist` - Dedicated page for detailed recommendations
- Automatic tracking in `Product` page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
