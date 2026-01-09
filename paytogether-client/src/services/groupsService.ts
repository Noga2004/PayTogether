import api from './api';

export interface Group {
  id: string;
  name: string;
  membersCount: number;
  totalSpent: number;
  lastActivity: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    balance: number;
  }>;
  settlements?: Array<{
    from: {
      id: string;
      name: string;
    };
    to: {
      id: string;
      name: string;
    };
    amount: number;
  }>;
  membersCount: number;
  totalSpent: number;
  lastActivity: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface AddMemberData {
  email: string;
}

export const groupsService = {
  async getAll(): Promise<Group[]> {
    const response = await api.get('/groups');
    return response.data;
  },

  async getOne(id: string): Promise<GroupDetail> {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  async create(data: CreateGroupData): Promise<Group> {
    const response = await api.post('/groups', data);
    return response.data;
  },

  async addMember(groupId: string, data: AddMemberData): Promise<GroupDetail> {
    const response = await api.post(`/groups/${groupId}/members`, data);
    return response.data;
  },
};
