# Reqs.ai - AI-Powered Requirements Engineering

Generate comprehensive PRDs, design documents, and tech stack recommendations from a single project idea. Powered by AI.

## 🚀 Project Overview

Reqs.ai transforms your project ideas into production-ready documentation using advanced AI orchestration. Simply describe your concept, answer a few clarifying questions, and receive:

- **PRD (Product Requirements Document)** - Comprehensive project specifications
- **Design Document** - Technical architecture and system design
- **Tech Stack Document** - AI-recommended technologies tailored to your needs

**Repository**: <https://github.com/Aqib2607/reqs.ai.git>

## 🎨 Color Palette

- **#080808** - Background (Black)
- **#387F39** - Primary (Dark Green)
- **#A2CA71** - Accent (Light Green)
- **#F4CE14** - Secondary (Yellow)

## 🛠️ Technology Stack

**Frontend:**

- React 18 with TypeScript
- Vite (Build tool)
- shadcn/ui (Component library)
- Tailwind CSS (Styling)
- React Router (Routing)
- Zustand (State management)

**Backend:**

- Laravel 12 (PHP 8.3+)
- MySQL (Database)
- Laravel Sanctum (API authentication)
- DomPDF (PDF generation)

**AI Providers:**

- OpenAI GPT-4
- Google Gemini
- Anthropic Claude
- Groq
- OpenRouter

## 📋 Prerequisites

- Node.js 18+ & npm
- PHP 8.3+
- Composer
- MySQL 8.0+
- Git

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Aqib2607/reqs.ai.git
cd reqs.ai
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Build frontend (outputs to backend/public/)
npm run build

# For development with hot reload
npm run dev
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=reqs_ai
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Start Laravel development server
php artisan serve
```

### 4. Configure AI API Keys

Visit `http://127.0.0.1:8000/api-config` after logging in to add your AI provider API keys:

- OpenAI
- Google Gemini
- Anthropic Claude
- Groq
- OpenRouter

## 🎯 Development

### Frontend Development

```bash
# Development server (port 5173)
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Backend Development

```bash
cd backend

# Start server
php artisan serve

# Run migrations
php artisan migrate

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:clear
```

### Quick Rebuild Script

```powershell
# Windows PowerShell
./rebuild.ps1
```

## 📁 Project Structure

```
reqs.ai/
├── backend/              # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/AI/
│   ├── database/migrations/
│   ├── routes/
│   └── public/          # Frontend build output
├── src/                 # React frontend
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── store/
└── public/
```

## 🔑 Key Features

- **AI Orchestration** - Automatic failover across 5 AI providers
- **Deep Research Pipeline** - 5-pass iterative refinement
- **Secure API Management** - Encrypted key storage
- **Version History** - Track document changes
- **Export Options** - Markdown, Clean PDF, Academic PDF
- **Team Collaboration** - Multi-user support
- **Real-time Generation** - Streaming AI responses

## 🌐 API Endpoints

Base URL: `http://127.0.0.1:8000/api`

### Authentication

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Projects

- `GET /projects` - List all projects
- `POST /projects` - Create project
- `GET /projects/{id}` - Get project details
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Documents

- `POST /documents/generate` - Generate document with AI
- `POST /documents/regenerate` - Regenerate document section
- `GET /documents/{id}` - Get document
- `PUT /documents/{id}` - Update document
- `GET /documents/{id}/versions` - Get version history

### Export

- `GET /export/{id}/markdown` - Export as Markdown
- `GET /export/{id}/pdf` - Export as Clean PDF
- `GET /export/{id}/pdf-academic` - Export as Academic PDF

### API Keys

- `GET /api-keys` - List API keys
- `POST /api-keys` - Add API key
- `PUT /api-keys/{id}` - Update API key
- `DELETE /api-keys/{id}` - Delete API key

## 📖 Documentation

Comprehensive documentation is available in the `backend/docs/` directory:

- **API_DOCUMENTATION.md** - Complete API reference
- **AI_INTEGRATION.md** - AI orchestration guide
- **SYSTEM_ARCHITECTURE.md** - Technical architecture
- **USER_GUIDE.md** - End-user documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Authors

- **Aqib Jawwad** - [@Aqib2607](https://github.com/Aqib2607)

## 🙏 Acknowledgments

- OpenAI, Anthropic, Google, Groq, and OpenRouter for AI APIs
- Laravel and React communities
- shadcn/ui for beautiful components
