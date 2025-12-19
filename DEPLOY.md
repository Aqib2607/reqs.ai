# Deployment Guide

This guide describes how to deploy the Reqs.ai application to production.

## 1. Backend (Render / Railway)

We recommend using **Render** or **Railway** for hosting the Node.js backend to easily support the Dockerfile or Node environment.

### Deployment Steps

1. Push your code to GitHub.
2. Login to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Select the `backend` directory (Root Directory).
6. **Environment**: select **Docker** (it will pick up `backend/Dockerfile`).
7. **Environment Variables**:
    - `NODE_ENV`: `production`
    - `DATABASE_URL`: Your MongoDB Atlas URL (e.g. `mongodb+srv://...`)
    - `JWT_SECRET`: A strong secret key
    - `CORS_ORIGIN`: Your production Frontend URL (see Step 2)
    - `GEMINI_API_KEY`: Your Google Gemini API Key
8. Click **Create Web Service**.

## 2. Frontend (Vercel)

We recommend **Vercel** for the React frontend.

### Deployment Steps

1. Login to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. **Framework Preset**: Vite
5. **Root Directory**: `./` (Default)
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed Backend (e.g. `https://reqs-ai-backend.onrender.com/api/v1`)
9. Click **Deploy**.

## 3. Database (MongoDB Atlas)

Ensure your IP Access List in MongoDB Atlas allows access from anywhere (`0.0.0.0/0`) or specifically your Render/Railway IP addresses.

## 4. CI/CD

Changes pushed to the `main` branch will automatically trigger:

- **CI Pipeline**: Runs tests on GitHub Actions.
- **Render/Vercel**: Auto-deploys if configured (Enable "Auto-Deploy" in their dashboards).
