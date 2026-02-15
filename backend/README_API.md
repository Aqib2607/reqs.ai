# Reqs.ai Backend API

Laravel-based backend system for Reqs.ai - an AI-powered requirements documentation platform with multi-provider orchestration, automatic failover, and comprehensive document generation.

## Features

### Core Functionality

- ✅ **Multi-Provider AI Orchestration** (OpenAI, Gemini, Anthropic, Groq, OpenRouter)
- ✅ **Automatic Provider Failover** with priority-based routing
- ✅ **Deep Research Pipeline** with 5-pass document generation
- ✅ **Document Version Control** for PRD, Design, and Tech Stack documents
- ✅ **PDF Export** (Clean & Academic formats)
- ✅ **Markdown Export** for all documents
- ✅ **API Key Encryption** using Laravel Crypt
- ✅ **Sanctum API Authentication**
- ✅ **Input Sanitization** to prevent prompt injection
- ✅ **AI Usage Logging** with latency and token tracking

## Tech Stack

- **Framework**: Laravel 12
- **PHP**: 8.2+
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **PDF Generation**: DomPDF
- **HTTP Client**: Guzzle

## Installation

### 1. Install Dependencies

```bash
cd backend
composer install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```env
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

# Sanctum CORS Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Run Migrations

```bash
php artisan migrate
```

### 5. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

```
POST /api/register
POST /api/login
POST /api/logout (authenticated)
GET /api/user (authenticated)
```

### Projects

```
POST /api/projects (authenticated)
GET /api/projects (authenticated)
GET /api/projects/{id} (authenticated)
```

### Documents

```
POST /api/prd/generate (authenticated)
POST /api/design/generate (authenticated)
POST /api/techstack/generate (authenticated)
POST /api/document/regenerate (authenticated)
POST /api/document/approve (authenticated)
```

### API Keys

```
POST /api/keys (authenticated)
GET /api/keys (authenticated)
PATCH /api/keys/{id} (authenticated)
DELETE /api/keys/{id} (authenticated)
```

### Export

```
GET /api/export/markdown/{project_id} (authenticated)
GET /api/export/pdf-clean/{project_id} (authenticated)
GET /api/export/pdf-academic/{project_id} (authenticated)
```

## API Usage Examples

### Register a User

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

### Create a Project

```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My SaaS App",
    "description": "A task management application"
  }'
```

### Add an API Key

```bash
curl -X POST http://localhost:8000/api/keys \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "key": "sk-...",
    "name": "OpenAI GPT-4",
    "priority": 10
  }'
```

### Generate PRD

```bash
curl -X POST http://localhost:8000/api/prd/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "project_description": "Build a SaaS task management app with real-time collaboration",
    "use_deep_research": true
  }'
```

## AI Orchestration System

### Provider Priority

The system automatically routes requests based on:

1. **Manual Priority** (user-set priority value)
2. **Average Latency** (faster providers preferred)
3. **Active Status** (only active keys are used)

### Automatic Failover

If a provider fails:

1. Error is logged with details
2. Next provider in priority order is tried
3. Up to `AI_MAX_RETRIES` attempts
4. Performance metrics are updated

### Deep Research Pipeline

Multi-pass document generation process:

1. **Draft Pass**: Initial content generation
2. **Critique Pass**: AI reviews and identifies issues
3. **Gap Detection**: Structured gap analysis
4. **Expansion Pass**: Content enrichment
5. **Validation Pass**: Final polish and consistency check

## Database Schema

### Key Tables

- `users` - User accounts
- `projects` - User projects
- `prd_documents` - Product Requirements Documents
- `design_documents` - Design Documents
- `tech_stack_documents` - Tech Stack Documents
- `document_versions` - Version history (polymorphic)
- `api_keys` - Encrypted AI provider keys
- `ai_logs` - AI request logging and metrics

## Security Features

### 1. API Key Encryption

All API keys are encrypted using Laravel Crypt before storage:

```php
$apiKey->encrypted_key = Crypt::encryptString($value);
```

### 2. Input Sanitization

Middleware strips potential prompt injection patterns:

- "Ignore previous instructions"
- System/Assistant role markers
- Common injection delimiters

### 3. Output Validation

AI-generated content is validated for:

- Minimum length requirements
- Required section headings
- Proper markdown structure
- No malicious scripts

### 4. CORS Configuration

Sanctum stateful domains configured for frontend integration.

## Performance Monitoring

All AI requests are logged with:

- Provider and model used
- Prompt/completion/total tokens
- Latency in milliseconds
- Success/failure status
- Error messages (if applicable)

Provider metrics are automatically updated:

- Total requests count
- Successful requests count
- Average latency
- Last used timestamp

## Development

### Running Tests

```bash
php artisan test
```

### Code Style

```bash
./vendor/bin/pint
```

### Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## Production Deployment

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Configure proper database credentials
4. Run migrations: `php artisan migrate --force`
5. Optimize: `php artisan config:cache && php artisan route:cache`
6. Configure web server (Nginx/Apache)
7. Setup SSL/TLS certificates
8. Configure queue workers for background jobs

## Troubleshooting

### Database Connection Issues

Ensure MySQL is running and credentials in `.env` are correct.

### CORS Errors

Check `SANCTUM_STATEFUL_DOMAINS` includes your frontend domain.

### API Key Decryption Errors

Ensure `APP_KEY` in `.env` hasn't changed after encrypting keys.

### Migration Errors

Run `php artisan migrate:fresh` to reset database (WARNING: deletes all data).

## License

MIT

## Support

For issues and questions, contact the development team.
