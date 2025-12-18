import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common'
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getAll() {
    return this.habitsService.getAll()
  }

  @Post()
  create(@Body('name') name: string) {
    return this.habitsService.create(name)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.habitsService.update(+id, name)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.habitsService.delete(+id)
  }
}