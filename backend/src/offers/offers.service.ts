import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const wish = await this.wishesService.findOneById(+createOfferDto.itemId);

    if (wish.owner.id === userId) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }

    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    const newOffer = this.offerRepository.create({
      ...createOfferDto,
      user: { id: userId },
      item: wish,
    });

    const savedOffer = await this.offerRepository.save(newOffer);

    await this.wishesService.updateRaisedAmount(wish.id, createOfferDto.amount);

    return savedOffer;
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });
    if (!offer) {
      throw new NotFoundException('Заявка не найдена');
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: ['user', 'item'],
    });
  }

  async updateOne(id: number, offer: Offer): Promise<void> {
    await this.offerRepository.update(id, offer);
    return;
  }

  async removeOne(id: number): Promise<void> {
    await this.offerRepository.delete({ id });
    return;
  }
}
