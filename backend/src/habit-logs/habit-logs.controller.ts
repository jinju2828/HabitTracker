import { Controller, Get, Post, Patch, Body, Param, NotFoundException, Headers, Req, UseGuards } from '@nestjs/common';
import { HabitLogsService } from './habit-logs.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitLogDto } from './dto/update-habit-log.dto';
import { AuthGuard } from '../auth/auth.guard'; // AuthGuard 적용
import { Request } from 'express';

@UseGuards(AuthGuard) // JWT 보호
@Controller('habit-logs')
export class HabitLogsController {
  constructor(private readonly habitLogsService: HabitLogsService) {}

  @Get(':habitId')
  async getLogs(@Param('habitId') habitId: string, @Req() req: Request) {
    const userId = req.user['userId']; // JWT에서 userId 가져오기
    const logs = await this.habitLogsService.getLogsByHabit(Number(habitId), Number(userId));
    // 프론트에서는 로그가 없을 때도 404보다 빈 배열([])을 기대하므로,
    // 로그가 없으면 200과 함께 빈 배열을 반환한다.
    if (!logs.length) {
      return [];
    }
    return logs;
  }

  @Post()
  async createLog(@Body() body: CreateHabitLogDto, @Req() req: Request, @Headers('timezone') timezone?: string) {
    const userId = req.user['userId'];
    return this.habitLogsService.createLog(
      body.habitId,
      Number(userId),              // userId 필수
      body.date,
      body.completed ?? false,
      timezone
    );
  }

  @Patch(':id')
  updateLog(@Param('id') id: string, @Body() body: UpdateHabitLogDto) {
    return this.habitLogsService.updateLog(Number(id), body.completed);
  }
}