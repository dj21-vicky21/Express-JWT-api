# Express JWT Authentication API

Secure REST API built with Express.js and TypeScript featuring JWT authentication, MongoDB integration, and comprehensive request logging.

## Features

- 🔐 Secure JWT authentication with 24-hour token expiry
- 📝 User registration and login
- 🛡️ Protected routes with middleware
- 🗄️ MongoDB integration for data persistence
- 📊 Comprehensive API request and response logging
- 🐳 Docker and Docker Compose support
- 🧩 TypeScript for type safety

## Table of Contents

- [Local Development](#local-development)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (locally installed or remote access)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dj21-vicky21/Express-JWT-api.git
   cd express_JWT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   MONGO_URI=mongodb://localhost:27017/authdemo
   JWT_SECRET=your_secret_key_here
   PORT=3001
   ```

4. Start MongoDB (if using local MongoDB):
   ```bash
   mongod --dbpath=/path/to/data/db
   ```

5. Build and run the app:
   ```bash
   # Build TypeScript
   npm run build
   
   # Start the server
   npm start
   
   # Or, for development with auto-reload
   npm run dev
   ```

6. The API will be available at http://localhost:3001

## Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Running with Docker

1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. The API will be available at http://localhost:3001

3. To stop the containers:
   ```
   docker-compose down
   ```

4. To view logs:
   ```
   docker-compose logs -f app
   ```

### Development with Docker

- Changes to your code will be reflected immediately due to volume mapping

### Environment Variables

Docker Compose sets these automatically:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `PORT`: The port the API runs on (3001)

## API Endpoints

For protected routes, pass the JWT as:
```
Authorization: Bearer <token>
``` 