// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Types for API responses
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  user_id: number;
  name: string;
  description: string;
  status: 'draft' | 'generating' | 'completed';
  created_at: string;
  updated_at: string;
  prd_document?: PrdDocument;
  design_document?: DesignDocument;
  tech_stack_document?: TechStackDocument;
}

export interface PrdDocument {
  id: number;
  project_id: number;
  content: string;
  version: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface DesignDocument {
  id: number;
  project_id: number;
  content: string;
  version: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface TechStackDocument {
  id: number;
  project_id: number;
  content: string;
  version: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: number;
  user_id: number;
  provider: 'openai' | 'gemini' | 'anthropic' | 'groq' | 'openrouter';
  name: string;
  masked_key: string;
  priority: number;
  is_active: boolean;
  total_requests: number;
  successful_requests: number;
  average_latency: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: number;
  versionable_type: string;
  versionable_id: number;
  content: string;
  version_number: number;
  change_summary: string | null;
  created_at: string;
}

export interface AiLog {
  id: number;
  user_id: number;
  provider: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  latency_ms: number;
  status: 'success' | 'failed';
  error_message: string | null;
  created_at: string;
}

// API Error Response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Auth Token Management
class AuthManager {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'auth_user';

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// API Client Class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = AuthManager.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      AuthManager.clearAuth();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        errors: data.errors,
      } as ApiError;
    }

    return data;
  }

  // Authentication
  async register(name: string, email: string, password: string, password_confirmation: string, company?: string, role?: string, phone?: string) {
    const data = await this.request<{ user: User; token: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation, company, role, phone }),
    });
    AuthManager.setToken(data.token);
    AuthManager.setUser(data.user);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ user: User; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    AuthManager.setToken(data.token);
    AuthManager.setUser(data.user);
    return data;
  }

  async logout() {
    await this.request('/logout', { method: 'POST' });
    AuthManager.clearAuth();
  }

  async getUser() {
    return this.request<{ user: User }>('/user');
  }

  // Projects
  async getProjects() {
    return this.request<{ projects: Project[] }>('/projects');
  }

  async getProject(id: number) {
    return this.request<{ project: Project }>(`/projects/${id}`);
  }

  async createProject(name: string, description: string) {
    return this.request<{ project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async deleteProject(id: number) {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Documents
  async generatePrd(project_id: number, project_description: string, use_deep_research: boolean = false) {
    return this.request<{ document: PrdDocument; message: string }>('/prd/generate', {
      method: 'POST',
      body: JSON.stringify({ project_id, project_description, use_deep_research }),
    });
  }

  async generateDesign(project_id: number, prd_content: string, use_deep_research: boolean = false) {
    return this.request<{ document: DesignDocument; message: string }>('/design/generate', {
      method: 'POST',
      body: JSON.stringify({ project_id, prd_content, use_deep_research }),
    });
  }

  async generateTechStack(project_id: number, prd_content: string, design_content: string, use_deep_research: boolean = false) {
    return this.request<{ document: TechStackDocument; message: string }>('/techstack/generate', {
      method: 'POST',
      body: JSON.stringify({ project_id, prd_content, design_content, use_deep_research }),
    });
  }

  async regenerateDocument(
    document_type: 'prd' | 'design' | 'techstack',
    document_id: number,
    section_name: string,
    feedback: string
  ) {
    return this.request<{ document: PrdDocument | DesignDocument | TechStackDocument; message: string }>('/document/regenerate', {
      method: 'POST',
      body: JSON.stringify({ document_type, document_id, section_name, feedback }),
    });
  }

  async approveDocument(document_type: 'prd' | 'design' | 'techstack', document_id: number) {
    return this.request<{ message: string }>('/document/approve', {
      method: 'POST',
      body: JSON.stringify({ document_type, document_id }),
    });
  }

  async getDocumentVersions(document_type: 'prd' | 'design' | 'techstack', document_id: number) {
    return this.request<{ versions: DocumentVersion[] }>(`/documents/${document_type}/${document_id}/versions`);
  }

  // API Keys
  async getApiKeys() {
    return this.request<{ api_keys: ApiKey[] }>('/keys');
  }

  async addApiKey(provider: string, key: string, name: string, priority: number = 10) {
    return this.request<{ api_key: ApiKey }>('/keys', {
      method: 'POST',
      body: JSON.stringify({ provider, key, name, priority }),
    });
  }

  async updateApiKey(id: number, data: { name?: string; priority?: number; is_active?: boolean }) {
    return this.request<{ api_key: ApiKey }>(`/keys/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteApiKey(id: number) {
    return this.request<{ message: string }>(`/keys/${id}`, {
      method: 'DELETE',
    });
  }

  // Export
  async exportMarkdown(project_id: number) {
    const token = AuthManager.getToken();
    const response = await fetch(`${this.baseUrl}/export/markdown/${project_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${project_id}.zip`;
    a.click();
  }

  async exportPdfClean(project_id: number) {
    const token = AuthManager.getToken();
    const response = await fetch(`${this.baseUrl}/export/pdf-clean/${project_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${project_id}-clean.pdf`;
    a.click();
  }

  async exportPdfAcademic(project_id: number) {
    const token = AuthManager.getToken();
    const response = await fetch(`${this.baseUrl}/export/pdf-academic/${project_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${project_id}-academic.pdf`;
    a.click();
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
export { AuthManager };
