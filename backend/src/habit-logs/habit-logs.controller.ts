// habit-logs.controller.ts
import { Controller, Get, Post, Patch, Body, Param, NotFoundException, Headers } from '@nestjs/common';
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
  async createLog(
    @Body() body: CreateHabitLogDto,
    @Headers('timezone') timezone?: string, // 클라이언트에서 TZ 정보 전달
  ) {
    // body.date는 optional, body.completed는 optional
    return this.habitLogsService.createLog(
      body.habitId,
      body.date,        // 전달되면 그대로, 없으면 서비스에서 오늘 기준으로 계산
      body.completed ?? false,
      timezone,         // user timezone
    );
  }

  @Patch(':id')
  updateLog(@Param('id') id: string, @Body() body: UpdateHabitLogDto) {
    return this.habitLogsService.updateLog(Number(id), body.completed);
  }
}
