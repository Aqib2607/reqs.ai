# 🚀 Reqs.ai Backend - Quick Setup Guide

## Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL 5.7+ or 8.0+
- Git (optional)

## Installation Steps

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

This will install:

- Laravel Framework 12
- Laravel Sanctum (API Authentication)
- DomPDF (PDF Generation)
- All other dependencies

### Step 3: Configure Environment

The `.env` file already exists, but verify these key settings:

```env
# Application
APP_NAME=Reqs.ai
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database - Update if needed
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reqs_ai
DB_USERNAME=root
DB_PASSWORD=

# AI Configuration
AI_MAX_RETRIES=3
AI_DEFAULT_MODEL=gpt-4
AI_TIMEOUT=120

# Sanctum - Frontend CORS
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### Step 4: Create Database

Open MySQL and create the database:

```sql
CREATE DATABASE reqs_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or use command line:

```bash
mysql -u root -p -e "CREATE DATABASE reqs_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 5: Run Migrations

```bash
php artisan migrate
```

This creates all 11 tables:

- users
- projects
- prd_documents
- design_documents
- tech_stack_documents
- document_versions
- api_keys
- ai_logs
- personal_access_tokens
- cache
- jobs

### Step 6: Start Development Server

```bash
php artisan serve
```

The API will be available at: **<http://localhost:8000>**

---

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Expected Response:**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-02-15T19:00:00.000000Z",
    "updated_at": "2026-02-15T19:00:00.000000Z"
  },
  "token": "1|abc123...xyz789"
}
```

**Save the token!** You'll need it for all authenticated requests.

### 2. Create a Project

```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My SaaS App",
    "description": "A task management application with real-time collaboration"
  }'
```

### 3. Add an AI Provider Key

```bash
curl -X POST http://localhost:8000/api/keys \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "key": "sk-YOUR_OPENAI_KEY",
    "name": "OpenAI GPT-4",
    "priority": 10
  }'
```

**Supported Providers:**

- `openai` - GPT-4, GPT-3.5
- `gemini` - Google Gemini Pro
- `anthropic` - Claude 3
- `groq` - Llama 3
- `openrouter` - Multiple models

### 4. Generate a PRD

```bash
curl -X POST http://localhost:8000/api/prd/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "project_description": "Build a SaaS task management app with real-time collaboration, Kanban boards, and team workspaces",
    "use_deep_research": true
  }'
```

**Note:** Deep research uses 5 AI passes and takes longer but produces better results.

---

## API Endpoints Quick Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | Register new user |
| POST | /api/login | Login and get token |
| POST | /api/logout | Logout (revoke token) |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/projects | Create project |
| GET | /api/projects | List projects |
| GET | /api/projects/{id} | Get project details |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/prd/generate | Generate PRD |
| POST | /api/design/generate | Generate Design Doc |
| POST | /api/techstack/generate | Generate Tech Stack |
| POST | /api/document/regenerate | Regenerate with feedback |
| POST | /api/document/approve | Approve document |

### API Keys

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/keys | Add AI provider key |
| GET | /api/keys | List keys (masked) |
| PATCH | /api/keys/{id} | Update key settings |
| DELETE | /api/keys/{id} | Delete key |

### Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/export/markdown/{project_id} | Export as Markdown |
| GET | /api/export/pdf-clean/{project_id} | Export clean PDF |
| GET | /api/export/pdf-academic/{project_id} | Export academic PDF |

---

## Troubleshooting

### "Connection refused" Error

**Problem:** Laravel server not running  
**Solution:** Run `php artisan serve`

### "Access denied for user" Error

**Problem:** Database credentials incorrect  
**Solution:** Check DB_USERNAME and DB_PASSWORD in .env

### "Base table or view not found"

**Problem:** Migrations not run  
**Solution:** Run `php artisan migrate`

### "CORS Error" from Frontend

**Problem:** Frontend domain not in SANCTUM_STATEFUL_DOMAINS  
**Solution:** Add your frontend URL to .env

### "No active AI providers available"

**Problem:** No API keys configured  
**Solution:** Add at least one AI provider key via `/api/keys` endpoint

### "The key is too long"

**Problem:** APP_KEY not set  
**Solution:** Run `php artisan key:generate`

---

## Environment Configuration

### Development

```env
APP_ENV=local
APP_DEBUG=true
```

### Production

```env
APP_ENV=production
APP_DEBUG=false
DB_HOST=your-production-db-host
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
```

---

## Additional Commands

### Clear All Caches

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### View All Routes

```bash
php artisan route:list
```

### Run Tests

```bash
php artisan test
```

### Reset Database (WARNING: Deletes all data)

```bash
php artisan migrate:fresh
```

### Check Database Connection

```bash
php artisan db:show
```

---

## Development Tips

### Using Postman/Insomnia

1. Set Authorization header:

   ```
   Authorization: Bearer YOUR_TOKEN
   ```

2. Set Content-Type header:

   ```
   Content-Type: application/json
   ```

3. For protected routes, always include the token from registration/login

### Viewing Logs

Logs are stored in: `storage/logs/laravel.log`

View recent logs:

```bash
tail -f storage/logs/laravel.log
```

### Database GUI Tools

You can use these tools to view the database:

- phpMyAdmin
- MySQL Workbench
- TablePlus
- DBeaver

---

## Security Notes

### API Keys

- Never commit API keys to Git
- Keys are encrypted in database
- Only last 4 digits shown in API responses
- Use `***XXXX` format for display

### Authentication

- Tokens are stored in `personal_access_tokens` table
- Logout revokes the current token
- Tokens don't expire by default (configurable in sanctum.php)

### Input Sanitization

- All inputs are sanitized for prompt injection
- XSS protection enabled
- SQL injection prevented by Eloquent ORM

---

## Next Steps

1. ✅ Backend is ready
2. 🔄 Integrate with React frontend
3. 🔄 Add your AI provider keys
4. 🔄 Test document generation
5. 🔄 Deploy to production

---

## Support

For issues or questions:

1. Check `storage/logs/laravel.log` for errors
2. Review `README_API.md` for detailed documentation
3. Check `IMPLEMENTATION_SUMMARY.md` for system overview

---

## Status: ✅ READY FOR USE

All systems operational and ready for frontend integration!
