import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { Group } from '../groups/entities/group.entity';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string): Promise<any> {
    // Find group and verify user is a member
    const group = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .where('group.id = :groupId', { groupId: createExpenseDto.groupId })
      .getOne();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isMember = group.members.some(member => member.id === userId);
    if (!isMember) {
      throw new BadRequestException('You are not a member of this group');
    }

    // Find the paying user
    const paidByUser = await this.usersRepository.findOne({ where: { id: userId } });
    if (!paidByUser) {
      throw new NotFoundException('User not found');
    }

    // Find users to split among
    const splitUsers = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: createExpenseDto.splitAmongIds })
      .getMany();

    if (splitUsers.length !== createExpenseDto.splitAmongIds.length) {
      throw new BadRequestException('One or more users in split list not found');
    }

    // Verify all split users are group members
    const allAremembers = splitUsers.every(user => 
      group.members.some(member => member.id === user.id)
    );
    if (!allAremembers) {
      throw new BadRequestException('All split users must be group members');
    }

    // Create expense
    const expense = this.expensesRepository.create({
      description: createExpenseDto.description,
      amount: createExpenseDto.amount,
      paidBy: paidByUser,
      group: group,
      splitAmong: splitUsers,
    });

    const savedExpense = await this.expensesRepository.save(expense);

    return this.formatExpense(savedExpense);
  }

  async findByGroup(groupId: string, userId: string): Promise<any[]> {
    // Verify user is member of group
    const group = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoin('group.members', 'member')
      .where('group.id = :groupId', { groupId })
      .andWhere('member.id = :userId', { userId })
      .getOne();

    if (!group) {
      throw new NotFoundException('Group not found or you are not a member');
    }

    const expenses = await this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.paidBy', 'paidBy')
      .leftJoinAndSelect('expense.splitAmong', 'splitAmong')
      .where('expense.groupId = :groupId', { groupId })
      .orderBy('expense.createdAt', 'DESC')
      .getMany();

    return expenses.map(expense => this.formatExpense(expense));
  }

  async findOne(expenseId: string, userId: string): Promise<any> {
    const expense = await this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.paidBy', 'paidBy')
      .leftJoinAndSelect('expense.splitAmong', 'splitAmong')
      .leftJoinAndSelect('expense.group', 'group')
      .leftJoin('group.members', 'member')
      .where('expense.id = :expenseId', { expenseId })
      .andWhere('member.id = :userId', { userId })
      .getOne();

    if (!expense) {
      throw new NotFoundException('Expense not found or you do not have permission');
    }

    return {
      id: expense.id,
      description: expense.description,
      amount: parseFloat(expense.amount.toString()),
      paidBy: {
        id: expense.paidBy.id,
        name: expense.paidBy.fullName,
        email: expense.paidBy.email,
      },
      group: {
        id: expense.group.id,
        name: expense.group.name,
      },
      splitAmong: expense.splitAmong.map(user => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        share: Math.round((parseFloat(expense.amount.toString()) / expense.splitAmong.length) * 100) / 100,
      })),
      date: this.formatDate(expense.createdAt),
      createdAt: expense.createdAt,
    };
  }

  async delete(expenseId: string, userId: string): Promise<void> {
    const expense = await this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.paidBy', 'paidBy')
      .leftJoinAndSelect('expense.group', 'group')
      .where('expense.id = :expenseId', { expenseId })
      .getOne();

    console.log('Delete attempt - expenseId:', expenseId);
    console.log('Delete attempt - userId:', userId);
    console.log('Expense found:', expense ? 'yes' : 'no');
    if (expense) {
      console.log('Expense paidBy.id:', expense.paidBy.id);
      console.log('IDs match:', expense.paidBy.id === userId);
    }

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Only the person who paid for the expense can delete it
    if (expense.paidBy.id !== userId) {
      console.log('Permission denied - throwing ForbiddenException');
      throw new ForbiddenException('You do not have permission to delete this expense');
    }

    console.log('Permission granted - deleting expense');
    await this.expensesRepository.remove(expense);
  }

  async findAllByUser(userId: string): Promise<any> {
    const expenses = await this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.paidBy', 'paidBy')
      .leftJoinAndSelect('expense.splitAmong', 'splitAmong')
      .leftJoinAndSelect('expense.group', 'group')
      .leftJoin('group.members', 'member')
      .where('member.id = :userId', { userId })
      .orderBy('expense.createdAt', 'DESC')
      .getMany();

    const grouped = this.groupByMonth(expenses, userId);
    return grouped;
  }

  private groupByMonth(expenses: Expense[], currentUserId: string): any[] {
    const monthGroups: { [key: string]: any } = {};

    expenses.forEach(expense => {
      const date = new Date(expense.createdAt);
      const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = {
          month: monthKey,
          total: 0,
          expenses: []
        };
      }

      const isCurrentUser = expense.paidBy.id === currentUserId;
      
      monthGroups[monthKey].expenses.push({
        id: expense.id,
        description: expense.description,
        amount: parseFloat(expense.amount.toString()),
        paidBy: isCurrentUser ? 'You' : expense.paidBy.fullName,
        date: this.formatDate(expense.createdAt),
        group: expense.group.name,
        isCurrentUser: isCurrentUser,
      });

      monthGroups[monthKey].total += parseFloat(expense.amount.toString());
    });

    // Convert to array and sort by date (newest first)
    return Object.values(monthGroups);
  }

  private formatExpense(expense: Expense): any {
    return {
      id: expense.id,
      description: expense.description,
      amount: parseFloat(expense.amount.toString()),
      paidBy: expense.paidBy.fullName,
      paidById: expense.paidBy.id,
      date: this.formatDate(expense.createdAt),
      splitAmong: expense.splitAmong.map(user => user.fullName),
      splitAmongIds: expense.splitAmong.map(user => user.id),
    };
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
}
