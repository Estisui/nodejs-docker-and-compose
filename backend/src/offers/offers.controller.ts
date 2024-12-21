import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Request() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}
