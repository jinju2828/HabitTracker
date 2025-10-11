import { Controller, Get, Post, Patch, Body, Param, NotFoundException } from '@nestjs/common';
import { HabitLogsService } from './habit-logs.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitLogDto } from './dto/update-habit-log.dto';

@Controller('habit-logs')
export class HabitLogsController {
  constructor(private readonly habitLogsService: HabitLogsService) {}

  @Get(':habitId')
  async getLogs(@Param('habitId') habitId: string) {
    const logs = await this.habitLogsService.getLogsByHabit(Number(habitId));
    if (!logs.length) throw new NotFoundException('No logs found for this habit');
    return logs;
  }

  @Post()
  createLog(@Body() body: CreateHabitLogDto) {
    return this.habitLogsService.createLog(body.habitId, body.date, body.completed);
  }

  @Patch(':id')
  updateLog(@Param('id') id: string, @Body() body: UpdateHabitLogDto) {
    return this.habitLogsService.updateLog(Number(id), body.completed);
  }
}
