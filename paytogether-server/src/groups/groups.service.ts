import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

    // Add additional members if provided
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

    // Transform to match frontend format
    return groups.map(group => ({
      id: group.id,
      name: group.name,
      membersCount: group.members.length,
      totalSpent: 0, // TODO: Calculate from expenses when expense module is added
      lastActivity: this.formatLastActivity(group.updatedAt),
    }));
  }

  async findOne(id: string, userId: string): Promise<Group> {
    const group = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .where('group.id = :id', { id })
      .andWhere('member.id = :userId', { userId })
      .getOne();

    if (!group) {
      throw new NotFoundException('Group not found or you are not a member');
    }

    return group;
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
}
