import { create } from 'zustand';

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
}

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Projects
  projects: Project[];
  currentProject: Project | null;
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
  addApiKey: (key: ApiKey) => void;
  toggleApiKey: (id: string) => void;
  removeApiKey: (id: string) => void;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    description: 'A modern e-commerce platform with AI-powered recommendations',
    status: 'completed',
    createdAt: '2026-02-10',
    documents: { prd: true, design: true, techStack: true },
  },
  {
    id: '2',
    name: 'Health Tracker App',
    description: 'Mobile-first health tracking with wearable integration',
    status: 'generating',
    createdAt: '2026-02-14',
    documents: { prd: true, design: false, techStack: false },
  },
  {
    id: '3',
    name: 'SaaS Analytics Dashboard',
    description: 'Real-time analytics dashboard for SaaS metrics',
    status: 'draft',
    createdAt: '2026-02-15',
    documents: { prd: false, design: false, techStack: false },
  },
];

const mockApiKeys: ApiKey[] = [
  { id: '1', name: 'OpenAI GPT-4', provider: 'OpenAI', key: 'sk-...xxxx', active: true, latency: 1200 },
  { id: '2', name: 'Anthropic Claude', provider: 'Anthropic', key: 'sk-ant-...yyyy', active: false, latency: 980 },
];

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  projects: mockProjects,
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),

  wizardStep: 0,
  wizardIdea: '',
  wizardAnswers: {},
  setWizardStep: (step) => set({ wizardStep: step }),
  setWizardIdea: (idea) => set({ wizardIdea: idea }),
  setWizardAnswer: (key, value) => set((s) => ({ wizardAnswers: { ...s.wizardAnswers, [key]: value } })),
  resetWizard: () => set({ wizardStep: 0, wizardIdea: '', wizardAnswers: {} }),

  activeSection: 'overview',
  setActiveSection: (section) => set({ activeSection: section }),

  apiKeys: mockApiKeys,
  addApiKey: (key) => set((s) => ({ apiKeys: [...s.apiKeys, key] })),
  toggleApiKey: (id) => set((s) => ({
    apiKeys: s.apiKeys.map((k) => k.id === id ? { ...k, active: !k.active } : k),
  })),
  removeApiKey: (id) => set((s) => ({ apiKeys: s.apiKeys.filter((k) => k.id !== id) })),
}));
