import api from './api';

export interface Group {
  id: string;
  name: string;
  membersCount: number;
  totalSpent: number;
  lastActivity: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  memberIds?: string[];
}

export const groupsService = {
  async getAll(): Promise<Group[]> {
    const response = await api.get('/groups');
    return response.data;
  },

  async getOne(id: string): Promise<Group> {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  async create(data: CreateGroupData): Promise<Group> {
    const response = await api.post('/groups', data);
    return response.data;
  },
};
