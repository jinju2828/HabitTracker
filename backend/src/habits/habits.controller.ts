import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { AuthGuard } from '../auth/auth.guard'; // 기존 AuthGuard
import { Request } from 'express';

@UseGuards(AuthGuard) // 로그인된 유저만 접근
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getAll(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.habitsService.getAll(Number(userId));
  }

  @Post()
  create(@Body('name') name: string, @Req() req: Request) {
    const userId = req.user['userId'];
    return this.habitsService.create(name, Number(userId));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.habitsService.update(+id, name);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.habitsService.delete(+id);
  }
}