import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req): Promise<User> {
    return this.usersService.findOne({ where: { id: req.user.userId } });
  }

  @Get('me/wishes')
  async getMyWishes(@Request() req) {
    return this.usersService.findUserWishes(req.user.id);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishesByUsername(username);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findOne({ where: { username } });
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }

  @Patch('me')
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateOne(
      { where: { id: req.user.id } },
      updateUserDto,
      req.user.id,
    );
  }
}
