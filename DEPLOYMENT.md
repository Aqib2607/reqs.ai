# Deployment Guide - Reqs.ai

## Overview

Reqs.ai is a full-stack application with:

- **Frontend**: React + Vite + TypeScript
- **Backend**: Laravel 12 + PHP 8.3

Since these are different technologies, they need separate deployment strategies.

---

## Option 1: Deploy Frontend to Vercel (Recommended for Testing)

### Prerequisites

- Backend API must be deployed separately and accessible via HTTPS

### Steps

1. **Deploy Backend First**
   - Deploy Laravel backend to: Railway, Laravel Forge, DigitalOcean, or Heroku
   - Get your backend API URL (e.g., `https://api.reqs.ai`)

2. **Update Vercel Environment Variable**

   In [vercel.json](vercel.json), change:

   ```json
   "env": {
     "VITE_API_URL": "https://your-actual-backend-url.com"
   }
   ```

3. **Create Frontend API Client** (Future Enhancement)

   Create `src/lib/api.ts`:

   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   export const API_BASE = `${API_URL}/api`;
   ```

4. **Deploy to Vercel**

   ```bash
   npm run build:vercel  # Test build locally
   vercel --prod         # Deploy
   ```

### What Gets Deployed

- ✅ React frontend (static files)
- ❌ Laravel backend (not compatible with Vercel)

---

## Option 2: Deploy Both to Railway (Full-Stack)

Railway supports both Node.js and PHP in a monorepo.

### Setup

1. **Install Railway CLI**

   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Create `railway.json`**

   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "php artisan serve --host=0.0.0.0 --port=$PORT",
       "restartPolicyType": "ON_FAILURE"
     }
   }
   ```

3. **Create `Procfile`**

   ```
   web: php artisan serve --host=0.0.0.0 --port=$PORT
   ```

4. **Deploy**

   ```bash
   railway init
   railway up
   ```

### What Gets Deployed

- ✅ React frontend (built into backend/public/)
- ✅ Laravel backend (serves both API and frontend)

---

## Option 3: Deploy to DigitalOcean App Platform

DigitalOcean supports monorepos with multiple components.

### Setup

1. **Connect Repository**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository

2. **Configure Components**

   **Component 1: Backend (PHP)**
   - Build Command: `cd backend && composer install`
   - Run Command: `php artisan serve --host=0.0.0.0 --port=8080`
   - HTTP Port: 8080

   **Component 2: Frontend (Static)**
   - Build Command: `npm install && npm run build:vercel`
   - Output Directory: `dist`

3. **Environment Variables**
   - Set all Laravel `.env` variables
   - Set database connection strings
   - Set `APP_KEY`

---

## Option 4: Traditional VPS (Full Control)

Deploy to any VPS (AWS EC2, DigitalOcean Droplet, Linode).

### Requirements

- Ubuntu 22.04 or later
- Nginx or Apache
- PHP 8.3+
- MySQL 8.0+
- Node.js 18+

### Steps

1. **Install Dependencies**

   ```bash
   sudo apt update
   sudo apt install -y php8.3 php8.3-fpm php8.3-mysql nginx mysql-server nodejs npm composer
   ```

2. **Clone Repository**

   ```bash
   cd /var/www
   git clone https://github.com/Aqib2607/reqs.ai.git
   cd reqs.ai
   ```

3. **Setup Backend**

   ```bash
   cd backend
   composer install --no-dev
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --force
   ```

4. **Build Frontend**

   ```bash
   cd ..
   npm install
   npm run build
   ```

5. **Configure Nginx**

   ```nginx
   server {
       listen 80;
       server_name reqs.ai;
       root /var/www/reqs.ai/backend/public;
       
       index index.php index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           try_files $uri $uri/ /index.php?$query_string;
       }
       
       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
           fastcgi_index index.php;
           include fastcgi_params;
       }
   }
   ```

6. **Start Services**

   ```bash
   sudo systemctl restart nginx
   sudo systemctl restart php8.3-fpm
   ```

---

## Current Configuration

### Local Development

```bash
# Backend (Terminal 1)
cd backend
php artisan serve  # http://localhost:8000

# Frontend builds into backend/public/
npm run build      # Builds to backend/public/
```

### Vercel Deployment

```bash
# Frontend only
npm run build:vercel  # Builds to dist/
```

---

## Recommended Deployment Strategy

**For MVP/Testing:**

1. Deploy backend to **Railway** (free tier available)
2. Deploy frontend to **Vercel** (free tier available)
3. Update `vercel.json` with Railway backend URL

**For Production:**

1. Deploy to **Laravel Forge** (managed Laravel hosting)
2. Or use **DigitalOcean App Platform** (supports both frontend + backend)
3. Or use **VPS** with Nginx (full control, more setup)

---

## Environment Variables

### Backend (.env)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend-url.com
```

---

## Post-Deployment Checklist

- [ ] Backend is accessible and returns 200 on health check
- [ ] Database migrations are run
- [ ] API endpoints are working (`/api/register`, `/api/login`)
- [ ] Frontend can connect to backend API
- [ ] CORS is configured correctly in backend
- [ ] SSL/TLS certificates are active (HTTPS)
- [ ] Environment variables are set correctly
- [ ] Error logging is configured
- [ ] Backups are scheduled (database)

---

## Troubleshooting

### Vercel: "No Output Directory named 'dist' found"

- Run `npm run build:vercel` locally first to test
- Check `vercel.json` has correct `buildCommand` and `outputDirectory`

### Backend: CORS Error

- Add frontend domain to `SANCTUM_STATEFUL_DOMAINS` in `.env`
- Update `config/cors.php` if needed

### Frontend: API Connection Failed  

- Check `VITE_API_URL` environment variable
- Verify backend is accessible from frontend domain
- Check browser console for CORS errors

---

## Need Help?

- Check logs: `backend/storage/logs/laravel.log`
- Review [README.md](README.md) for setup instructions
- Review [backend/SETUP_GUIDE.md](backend/SETUP_GUIDE.md) for backend setup

---

**Current Status**: Configured for both local development and Vercel deployment.
