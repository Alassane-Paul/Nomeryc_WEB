import apiClient from './apiClient';

export type ProjectStatus = 'devis' | 'en_cours' | 'revision' | 'termine' | 'annule';
export type ServiceType = 'web' | 'apps' | 'audit' | 'design' | 'bot';

export interface DeliverableItem {
  id: string;
  title: string;
  status: 'pending' | 'done';
  url?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  service: ServiceType;
  status: ProjectStatus;
  budget?: number;
  progress?: number;
  startDate?: string;
  deadline?: string;
  deliverables?: DeliverableItem[];
  assignedTeam?: TeamMember[];
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  clientId?: string;
  title: string;
  description: string;
  service: ServiceType;
  status?: ProjectStatus;
  budget?: number;
  startDate?: string;
  deadline?: string;
}

export const projectsService = {
  async getAll(): Promise<Project[]> {
    const res = await apiClient.get('/projects');
    return res.data.data;
  },

  async getById(id: string): Promise<Project> {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data.data;
  },

  async create(data: ProjectInput): Promise<Project> {
    const res = await apiClient.post('/projects', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<ProjectInput> & { progress?: number }): Promise<Project> {
    const res = await apiClient.patch(`/projects/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};
