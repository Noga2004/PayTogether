import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    return this.groupsService.create(createGroupDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.groupsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req) {
    return this.groupsService.findOne(req.params.id, req.user.userId);
  }
}
