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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOne(+id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.wishlistsService.removeOne(+id, req.user.id);
  }
}
