# Connecting Reqs.ai to MongoDB

This project uses **MongoDB** as its database. The connection is managed by the backend service using `mongoose`.

## Prerequisites

1. **MongoDB Instance**: You need a running MongoDB database. This can be:
    * **MongoDB Atlas** (Cloud - Recommended): creating a cluster at [mongodb.com](https://www.mongodb.com/).
    * **Local MongoDB**: Installing MongoDB Community Server locally.

2. **Connection String**: You need the connection URI.
    * Atlas Example: `mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?appName=Cluster0`
    * Local Example: `mongodb://localhost:27017/reqsai`

## Configuration Steps

The database connection is configured via environment variables in the **backend** directory.

1. **Navigate to the backend directory**:

    ```bash
    cd backend
    ```

2. **Open/Create the `.env` file**:
    Ensure you have a `.env` file (copy from `.env.example` if needed).

3. **Update `DATABASE_URL`**:
    Find the `DATABASE_URL` variable and paste your connection string.

    ```ini
    # backend/.env
    DATABASE_URL=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/your_db_name
    ```

    > **Note**: If using MongoDB Atlas, verify that your IP address is whitelisted in the Atlas "Network Access" settings.

## Running the Application

Once configured, start the backend server:

```bash
cd backend
npm run dev
```

The server logs should verify the connection:
`MongoDB Connected: <cluster-host>`

## Code Reference

* **Configuration**: `backend/src/config/index.ts` loads the `.env` file.
* **Connection Logic**: `backend/src/config/database.ts` handles the connection using `mongoose.connect()`.

## Troubleshooting

### Connection Errors

If you see errors like `MongooseServerSelectionError` or `SSL routines:ssl3_read_bytes:tlsv1 alert internal error`, it is likely due to **IP Whitelisting**.

#### How to Fix (MongoDB Atlas)

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Security** -> **Network Access** in the left sidebar.
3. Click **+ Add IP Address**.
4. Select **Add Current IP Address** (or allow access from anywhere `0.0.0.0/0` for testing).
5. Wait a few minutes for changes to propagate.
6. Restart the backend server.
