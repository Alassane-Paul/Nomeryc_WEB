import apiClient from './apiClient';

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'haute' | 'moyenne' | 'basse';

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  position?: number;
  completedAt?: string;
  project?: { id: string; title: string };
  assignee?: { id: string; firstName: string; lastName: string; avatar?: string };
  createdAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  projectId?: string | null;
  assigneeId?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export const tasksService = {
  async list(params?: { status?: TaskStatus; projectId?: string }): Promise<Task[]> {
    const res = await apiClient.get('/tasks', { params });
    return res.data.data;
  },
  async create(data: TaskInput): Promise<Task> {
    const res = await apiClient.post('/tasks', data);
    return res.data.data;
  },
  async update(id: string, data: Partial<TaskInput>): Promise<Task> {
    const res = await apiClient.patch(`/tasks/${id}`, data);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};
