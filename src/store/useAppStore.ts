/* eslint-disable @typescript-eslint/no-explicit-any */
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
    prdContent?: string;
    design: boolean;
    designContent?: string;
    techStack: boolean;
    techStackContent?: string;
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
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name: string; email: string; company?: string | null; role?: string | null; phone?: string | null }) => Promise<void>;
  updatePreferences: (data: { email_notifications?: boolean; two_factor_enabled?: boolean }) => Promise<void>;
  changePassword: (data: Record<string, string>) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;

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
  generateDocuments: (projectId: string, description: string, useDeepResearch?: boolean) => Promise<boolean>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;

  // New Project Wizard
  wizardStep: number;
  wizardIdea: string;
  wizardQuestions: string[];
  isGeneratingQuestions: boolean;
  wizardAnswers: Record<string, string>;
  setWizardStep: (step: number) => void;
  setWizardIdea: (idea: string) => void;
  setWizardAnswer: (key: string, value: string) => void;
  fetchDynamicQuestions: (idea: string) => Promise<boolean>;
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
      prdContent: (apiProject.prd_document as any)?.content,
      design: !!apiProject.design_document,
      designContent: (apiProject.design_document as any)?.content,
      techStack: !!apiProject.tech_stack_document,
      techStackContent: (apiProject.tech_stack_document as any)?.content,
    },
  };
}

// Helper function to transform API key to UI key
function transformApiKey(apiKey: Record<string, unknown>): ApiKey {
  if (!apiKey || typeof apiKey !== 'object') {
    throw new Error(`transformApiKey received invalid data: ${JSON.stringify(apiKey)}`);
  }
  return {
    id: String(apiKey.id || 'missing-id'),
    name: (apiKey.name as string) || '',
    provider: (apiKey.provider as string) || 'unknown',
    key: (apiKey.masked_key as string) || '********',
    active: !!apiKey.is_active,
    latency: (apiKey.avg_latency_ms as number) || (apiKey.average_latency as number) || 0,
    priority: (apiKey.priority as number) || 0,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  user: AuthManager.getUser(),
  isAuthenticated: AuthManager.isAuthenticated(),
  setUser: (user) => {
    if (user) AuthManager.setUser(user);
    set({ user, isAuthenticated: !!user });
  },
  fetchUser: async () => {
    if (!AuthManager.isAuthenticated()) return;
    try {
      const response = await api.getUser();
      get().setUser(response.user);
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  },
  logout: async () => {
    try {
      await api.logout();
      set({ user: null, isAuthenticated: false, projects: [], apiKeys: [] });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  updateProfile: async (data) => {
    const response = await api.updateProfile(data);
    get().setUser(response.user);
  },
  updatePreferences: async (data) => {
    const response = await api.updatePreferences(data);
    get().setUser(response.user);
  },
  changePassword: async (data) => {
    await api.changePassword(data);
  },
  deleteAccount: async (password: string) => {
    await api.deleteAccount(password);
    get().logout();
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

  generateDocuments: async (projectId: string, description: string, useDeepResearch: boolean = false) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Generate PRD
      const prdResponse = await api.generatePrd(Number(projectId), description, useDeepResearch);
      const prdContent = prdResponse.document.content;

      // 2. Generate Design
      const designResponse = await api.generateDesign(Number(projectId), prdContent, useDeepResearch);
      const designContent = designResponse.document.content;

      // 3. Generate Tech Stack
      await api.generateTechStack(Number(projectId), prdContent, designContent, useDeepResearch);

      // Refresh project to get updated document status
      const projectResponse = await api.getProject(Number(projectId));
      const updatedProject = transformProject(projectResponse.project);

      set((state) => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
        isLoading: false
      }));

      return true;
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to generate documents', isLoading: false });
      return false;
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
  wizardQuestions: [],
  isGeneratingQuestions: false,
  wizardAnswers: {},
  setWizardStep: (step) => set({ wizardStep: step }),
  setWizardIdea: (idea) => set({ wizardIdea: idea }),
  setWizardAnswer: (key, value) => set((s) => ({ wizardAnswers: { ...s.wizardAnswers, [key]: value } })),

  fetchDynamicQuestions: async (idea: string) => {
    set({ isGeneratingQuestions: true, error: null });
    try {
      const response = await api.generateScopeQuestions(idea);
      set({ wizardQuestions: response.questions, isGeneratingQuestions: false });
      return true;
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to generate questions', isGeneratingQuestions: false });
      return false;
    }
  },

  resetWizard: () => set({ wizardStep: 0, wizardIdea: '', wizardAnswers: {}, wizardQuestions: [] }),

  // Document Editor
  activeSection: 'overview',
  setActiveSection: (section) => set({ activeSection: section }),

  // API Keys
  apiKeys: [],

  fetchApiKeys: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getApiKeys();
      // Handle array vs nested object format
      const isArrayResponse = Array.isArray(response.api_keys);
      const rawResponse = response as Record<string, unknown>;
      const rawKeys = (isArrayResponse ? response.api_keys : rawResponse.data) as Record<string, unknown>[];
      const apiKeys = (rawKeys || []).map(transformApiKey);
      set({ apiKeys, isLoading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to fetch API keys', isLoading: false });
    }
  },

  addApiKey: async (provider: string, key: string, name: string, priority: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.addApiKey(provider, key, name, priority);
      const rawResponse = response as Record<string, unknown>;
      const rawKey = (rawResponse.api_key || rawResponse.data || rawResponse) as Record<string, unknown>;
      const newKey = transformApiKey(rawKey);
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
      // Backend now simply toggles is_active for this key
      await api.activateApiKey(Number(id));
      // Refetch to get the true synchronized list from DB
      await get().fetchApiKeys();
    } catch (error: unknown) {
      set({ error: (error as Error).message || 'Failed to toggle API key' });
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
