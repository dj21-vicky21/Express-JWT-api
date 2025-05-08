# Express JWT Authentication API

An Express.js API with JWT authentication and MongoDB integration.

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