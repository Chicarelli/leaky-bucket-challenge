# Leaky Bucket Challenge

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

3. **Run docker**
   ```
    create and fill a .env file based on the .env.example file
   ```

4. **Start the server**
    ```
    npm run start
    ```


## Key Mutation

**Endpoint:** `/graphql`  
**Mutation:** `addKey`

Creates a new Pix key for the authenticated user. 
- `type`: `"phone"` or `"email"` (no validation)
- `value`: The value for the key (must be unique per type+value)

**Example:**
```graphql
mutation {
  addKey(user_id: 1, type: "phone", value: "11999999999") {
    type
    value
  }
}
```
- If a key with the same `type` and `value` already exists, the mutation will fail and a token will be subtract from the user.

---

## Pix Mutation

**Endpoint:** `/graphql`  
**Mutation:** `addPix`

Sends a Pix payment to a key.  
- `amount`: Amount in cents (integer). Must be **greater than 100** (i.e., more than $1.00).
- `type_key`: The type of the destination key (`"phone"` or `"email"`)
- `value_key`: The value of the destination key ('test@email.com')

**Example:**
```graphql
mutation {
  addPix(amount: 150, value_key: "teste@email.com", type_key: "email") {
    amount
    key {
      type
      value
    }
    to
    from
  }
}
```
**Rules:**
- If `amount` is **less than 100**, the request costs 1 token and will fail.
- The destination key (`type_key` + `value_key`) **must exist**. If not, the request costs 1 token. and will fail

---

**Note:**  
All graphql interactions require Bearer authentication.