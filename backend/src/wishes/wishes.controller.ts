import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/copy')
  async copyWish(@Request() req, @Param('id') id: string) {
    return this.wishesService.copyWish(+id, req.user.id);
  }

  @Get('last')
  async getLastWishes() {
    return this.wishesService.findLast();
  }

  @Get('top')
  async getTopWishes() {
    return this.wishesService.findTop();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.wishesService.findOneById(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(+id, updateWishDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.wishesService.removeOne(+id, req.user.id);
  }
}
