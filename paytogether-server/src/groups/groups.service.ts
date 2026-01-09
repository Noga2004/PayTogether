import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: string): Promise<Group> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const group = this.groupsRepository.create({
      name: createGroupDto.name,
      description: createGroupDto.description,
      members: [user],
    });

    if (createGroupDto.memberIds && createGroupDto.memberIds.length > 0) {
      const additionalMembers = await this.usersRepository.findByIds(createGroupDto.memberIds);
      group.members = [...group.members, ...additionalMembers];
    }

    return this.groupsRepository.save(group);
  }

  async findAllByUser(userId: string): Promise<any[]> {
    const groups = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoin('group.members', 'member')
      .where('member.id = :userId', { userId })
      .leftJoinAndSelect('group.members', 'allMembers')
      .orderBy('group.updatedAt', 'DESC')
      .getMany();

    const groupsWithTotals = await Promise.all(
      groups.map(async (group) => {
        const totalSpent = await this.calculateTotalSpent(group.id);
        return {
          id: group.id,
          name: group.name,
          membersCount: group.members.length,
          totalSpent,
          lastActivity: this.formatLastActivity(group.updatedAt),
        };
      })
    );

    return groupsWithTotals;
  }

  async findOne(id: string, userId: string): Promise<any> {
    const group = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .where('group.id = :id', { id })
      .getOne();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isMember = group.members.some(member => member.id === userId);
    if (!isMember) {
      throw new NotFoundException('You are not a member of this group');
    }

    const membersWithBalance = await Promise.all(
      group.members.map(async (member) => {
        const balance = await this.calculateMemberBalance(group.id, member.id);
        return {
          id: member.id,
          name: member.fullName,
          email: member.email,
          balance,
        };
      })
    );

    const totalSpent = await this.calculateTotalSpent(group.id);
    const settlements = await this.calculateSettlements(group.id, group.members);

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      membersCount: group.members.length,
      totalSpent,
      lastActivity: this.formatLastActivity(group.updatedAt),
      members: membersWithBalance,
      settlements,
    };
  }

  async addMember(groupId: string, email: string, requestingUserId: string): Promise<any> {
    const group = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .where('group.id = :groupId', { groupId })
      .getOne();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isMember = group.members.some(member => member.id === requestingUserId);
    if (!isMember) {
      throw new BadRequestException('You are not a member of this group');
    }

    const userToAdd = await this.usersRepository.findOne({ where: { email } });
    if (!userToAdd) {
      throw new NotFoundException('User with this email not found');
    }

    const isAlreadyMember = group.members.some(member => member.id === userToAdd.id);
    if (isAlreadyMember) {
      throw new BadRequestException('User is already a member of this group');
    }

    group.members.push(userToAdd);
    await this.groupsRepository.save(group);

    return this.findOne(groupId, requestingUserId);
  }

  private formatLastActivity(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${diffWeeks}w ago`;
  }

  private async calculateTotalSpent(groupId: string): Promise<number> {
    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.groupId = :groupId', { groupId })
      .getRawOne();

    return result?.total ? parseFloat(result.total) : 0;
  }

  private async calculateMemberBalance(groupId: string, memberId: string): Promise<number> {
    const expenses = await this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.paidBy', 'paidBy')
      .leftJoinAndSelect('expense.splitAmong', 'splitAmong')
      .where('expense.groupId = :groupId', { groupId })
      .getMany();

    let balance = 0;

    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount.toString());
      
      if (expense.paidBy.id === memberId) {
        balance += amount;
      }

      const isInSplit = expense.splitAmong.some(user => user.id === memberId);
      if (isInSplit) {
        const shareAmount = amount / expense.splitAmong.length;
        balance -= shareAmount;
      }
    });

    return Math.round(balance * 100) / 100; 
  }

  private async calculateSettlements(groupId: string, members: User[]): Promise<any[]> {
    const expenses = await this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.paidBy', 'paidBy')
      .leftJoinAndSelect('expense.splitAmong', 'splitAmong')
      .where('expense.groupId = :groupId', { groupId })
      .getMany();

    const balances: { [key: string]: number } = {};
    
    members.forEach(member => {
      balances[member.id] = 0;
    });

    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount.toString());
      const shareAmount = amount / expense.splitAmong.length;

      balances[expense.paidBy.id] += amount;

      expense.splitAmong.forEach(splitMember => {
        balances[splitMember.id] -= shareAmount;
      });
    });

    const creditors: Array<{ id: string; name: string; amount: number }> = [];
    const debtors: Array<{ id: string; name: string; amount: number }> = [];

    members.forEach(member => {
      const balance = Math.round(balances[member.id] * 100) / 100;
      if (balance > 0.01) {
        creditors.push({
          id: member.id,
          name: member.fullName,
          amount: balance,
        });
      } else if (balance < -0.01) {
        debtors.push({
          id: member.id,
          name: member.fullName,
          amount: Math.abs(balance),
        });
      }
    });

    const settlements: any[] = [];
    let i = 0; 
    let j = 0; 

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];

      const settleAmount = Math.min(creditor.amount, debtor.amount);

      if (settleAmount >= 0.01) {
        settlements.push({
          from: {
            id: debtor.id,
            name: debtor.name,
          },
          to: {
            id: creditor.id,
            name: creditor.name,
          },
          amount: Math.round(settleAmount * 100) / 100,
        });
      }

      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;

      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }

    return settlements;
  }
}
