import api from './api';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: {
    id: string;
    name: string;
    email: string;
  };
  date: string;
  splitAmong: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export interface ExpenseDetail {
  id: string;
  description: string;
  amount: number;
  paidBy: {
    id: string;
    name: string;
    email: string;
  };
  group: {
    id: string;
    name: string;
  };
  splitAmong: Array<{
    id: string;
    name: string;
    email: string;
    share: number;
  }>;
  date: string;
  createdAt: string;
}

export interface MonthGroup {
  month: string;
  total: number;
  expenses: Array<{
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    date: string;
    group: string;
    isCurrentUser: boolean;
  }>;
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  groupId: string;
  splitAmongIds: string[];
}

export const expensesService = {
  async getAll(): Promise<MonthGroup[]> {
    const response = await api.get('/expenses');
    return response.data;
  },

  async getOne(id: string): Promise<ExpenseDetail> {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  async getByGroup(groupId: string): Promise<Expense[]> {
    const response = await api.get(`/expenses/group/${groupId}`);
    return response.data;
  },

  async create(data: CreateExpenseData): Promise<Expense> {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },
};
