# Woovi's Leaky Bucket Challenge

### Features

- **Node.js HTTP server** with Koa.js
- **Multi-tenancy**: Each user has their own bucket (10 tokens max)
- **Bearer Token Authentication**
- **Leaky Bucket Algorithm**:
  - Each request consumes 1 token
  - On success, token is kept; on failure, token is lost
  - 1 token is replenished every hour (max 10)

## Requirements
- Node.js v20.13.1
- Docker & Docker Compose

## Getting Started
1. **Install dependencies**
   ```
   npm install
   ```

2. **Run docker**
   ```
   docker-compose up --build
   ```

3. **Start the server**
    ```
    npm run start
    ```