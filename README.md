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

- **AI Orchestration v2** - Automatic failover across 5 AI providers with multiple active API key support.
- **Dynamic Clarify Scope** - AI-driven interview process that generates specific questions to refine project requirements before documentation begins.
- **Deep Research Pipeline** - Iterative refinement process for high-quality technical documents.
- **Comprehensive Profile Hub** - Categorized management for Personal Info, Professional Details (Company/Role), Security (Password/2FA), and Preferences.
- **Secure API Management** - Encrypted key storage with health check tracking and status monitoring.
- **Advanced Export System** - Fast, client-side Markdown and Multi-page PDF generation via Blob API and jsPDF.
- **Responsive Workspace** - Optimized for all screen sizes with smooth sidebar and navigation transitions.

## 🌐 API Endpoints

Base URL: `http://127.0.0.1:8000/api`

### Authentication & User

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /user` - Get current user data
- `PATCH /user/profile` - Update personal & professional info
- `PATCH /user/preferences` - Toggle notifications and 2FA
- `POST /user/password` - Secure password change
- `POST /user/delete-account` - Permanent account removal

### Projects & Scoping

- `GET /projects` - List all projects
- `POST /projects` - Create project metadata
- `POST /projects/clarify` - Generate dynamic scope questions
- `GET /projects/{id}` - Get project details with documents
- `PUT /projects/{id}` - Update project status
- `DELETE /projects/{id}` - Delete project

### Documents

- `POST /documents/generate` - Generate full suite (PRD, Design, Tech Stack)
- `POST /documents/regenerate` - Refine specific document sections
- `GET /documents/{id}/versions` - Access full version history

### API Key Management

- `GET /api-keys` - List all configured keys
- `POST /api-keys` - Add new provider key
- `PATCH /api-keys/{id}/status` - Enable/Disable key
- `PATCH /api-keys/{id}/backup` - Toggle backup provider status
- `DELETE /api-keys/{id}` - Revoke API key

## 📖 Documentation

Comprehensive documentation is available in the `backend/` directory:

- **[README_API.md](backend/README_API.md)** - Complete API reference and usage examples
- **[SETUP_GUIDE.md](backend/SETUP_GUIDE.md)** - Quick setup and installation guide
- **[IMPLEMENTATION_SUMMARY.md](backend/IMPLEMENTATION_SUMMARY.md)** - Full system architecture and features
- **[STATUS.md](backend/STATUS.md)** - Implementation status and deployment readiness

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
