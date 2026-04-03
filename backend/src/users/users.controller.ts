import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    const userId = (req.user as { userId: number }).userId;
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  patchMe(@Req() req: Request, @Body() body: UpdateProfileDto) {
    const userId = (req.user as { userId: number }).userId;
    return this.usersService.updateProfile(userId, body);
  }
}
