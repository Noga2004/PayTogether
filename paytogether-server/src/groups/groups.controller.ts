import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
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
  findOne(@Param('id') id: string, @Request() req) {
    return this.groupsService.findOne(id, req.user.userId);
  }

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body('email') email: string, @Request() req) {
    return this.groupsService.addMember(id, email, req.user.userId);
  }
}
