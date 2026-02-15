import { create } from 'zustand';
import { api, Project as ApiProject, ApiKey as ApiApiKey, User, AuthManager } from '@/lib/api';

// UI-friendly type that matches what components expect
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'generating' | 'completed';
  createdAt: string;
  documents: {
    prd: boolean;
    design: boolean;
    techStack: boolean;
  };
}

export interface ApiKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  active: boolean;
  latency: number;
  priority?: number;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Projects
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (name: string, description: string) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;

  // New Project Wizard
  wizardStep: number;
  wizardIdea: string;
  wizardAnswers: Record<string, string>;
  setWizardStep: (step: number) => void;
  setWizardIdea: (idea: string) => void;
  setWizardAnswer: (key: string, value: string) => void;
  resetWizard: () => void;

  // Document Editor
  activeSection: string;
  setActiveSection: (section: string) => void;

  // API Keys
  apiKeys: ApiKey[];
  fetchApiKeys: () => Promise<void>;
  addApiKey: (provider: string, key: string, name: string, priority?: number) => Promise<void>;
  toggleApiKey: (id: string) => Promise<void>;
  removeApiKey: (id: string) => Promise<void>;
}

// Helper function to transform API project to UI project
function transformProject(apiProject: ApiProject): Project {
  return {
    id: apiProject.id.toString(),
    name: apiProject.name,
    description: apiProject.description,
    status: apiProject.status,
    createdAt: apiProject.created_at,
    documents: {
      prd: !!apiProject.prd_document,
      design: !!apiProject.design_document,
      techStack: !!apiProject.tech_stack_document,
    },
  };
}

// Helper function to transform API key to UI key
function transformApiKey(apiKey: ApiApiKey): ApiKey {
  return {
    id: apiKey.id.toString(),
    name: apiKey.name,
    provider: apiKey.provider,
    key: apiKey.masked_key,
    active: apiKey.is_active,
latency: apiKey.average_latency,
    priority: apiKey.priority,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  user: AuthManager.getUser(),
  isAuthenticated: AuthManager.isAuthenticated(),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: async () => {
    try {
      await api.logout();
      set({ user: null, isAuthenticated: false, projects: [], apiKeys: [] });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Projects
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getProjects();
      const projects = response.projects.map(transformProject);
      set({ projects, isLoading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to fetch projects', isLoading: false });
    }
  },

  createProject: async (name: string, description: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createProject(name, description);
      const newProject = transformProject(response.project);
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false,
      }));
      return newProject;
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to create project', isLoading: false });
      return null;
    }
  },

  deleteProject: async (id: string) => {
    try {
      await api.deleteProject(Number(id));
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to delete project' });
      throw error;
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  // Wizard
  wizardStep: 0,
  wizardIdea: '',
  wizardAnswers: {},
  setWizardStep: (step) => set({ wizardStep: step }),
  setWizardIdea: (idea) => set({ wizardIdea: idea }),
  setWizardAnswer: (key, value) => set((s) => ({ wizardAnswers: { ...s.wizardAnswers, [key]: value } })),
  resetWizard: () => set({ wizardStep: 0, wizardIdea: '', wizardAnswers: {} }),

  // Document Editor
  activeSection: 'overview',
  setActiveSection: (section) => set({ activeSection: section }),

  // API Keys
  apiKeys: [],
  
  fetchApiKeys: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getApiKeys();
      const apiKeys = response.api_keys.map(transformApiKey);
      set({ apiKeys, isLoading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to fetch API keys', isLoading: false });
    }
  },

  addApiKey: async (provider: string, key: string, name: string, priority: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.addApiKey(provider, key, name, priority);
      const newKey = transformApiKey(response.api_key);
      set((state) => ({
        apiKeys: [...state.apiKeys, newKey],
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to add API key', isLoading: false });
      throw error;
    }
  },

  toggleApiKey: async (id: string) => {
    const key = get().apiKeys.find((k) => k.id === id);
    if (!key) return;

    try {
      await api.updateApiKey(Number(id), { is_active: !key.active });
      set((state) => ({
        apiKeys: state.apiKeys.map((k) => (k.id === id ? { ...k, active: !k.active } : k)),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to update API key' });
    }
  },

  removeApiKey: async (id: string) => {
    try {
      await api.deleteApiKey(Number(id));
      set((state) => ({
        apiKeys: state.apiKeys.filter((k) => k.id !== id),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to delete API key' });
    }
  },
}));
