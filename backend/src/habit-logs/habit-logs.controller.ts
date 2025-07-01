import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { HabitLogsService } from './habit-logs.service';

@Controller('habit-logs')
export class HabitLogsController {
  constructor(private readonly habitLogsService: HabitLogsService) {}

  @Get(':habitId')
  getLogs(@Param('habitId') habitId: string) {
    return this.habitLogsService.getLogsByHabit(Number(habitId));
  }

  @Post()
  createLog(@Body() body: { habitId: number; date: string; completed?: boolean }) {
    return this.habitLogsService.createLog(body.habitId, body.date, body.completed);
  }

  @Patch(':id')
  updateLog(@Param('id') id: string, @Body() body: { completed: boolean }) {
    return this.habitLogsService.updateLog(Number(id), body.completed);
  }
}
