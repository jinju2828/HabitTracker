import { Controller, Get, Post, Body } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getAll() {
    return this.habitsService.getAll();
  }

  @Post()
  create(@Body() body: CreateHabitDto) {
    return this.habitsService.create(body.name);
  }
}
