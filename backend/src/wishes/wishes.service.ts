import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: { id: userId },
      raised: 0,
      copied: 0,
    });
    return this.wishRepository.save(wish);
  }

  async copyWish(id: number, userId: number): Promise<Wish> {
    const wish = await this.findOneById(id);

    if (wish.owner.id === userId) {
      throw new ForbiddenException('Нельзя скопировать собственный подарок');
    }

    if (wish.copiedBy.includes(userId)) {
      throw new ForbiddenException('Вы уже скопировали этот подарок');
    }

    const copiedWish = this.wishRepository.create({
      ...wish,
      owner: { id: userId },
      raised: 0,
      copied: 0,
    });

    delete copiedWish.id;

    await this.wishRepository.increment({ id: wish.id }, 'copied', 1);

    wish.copiedBy.push(userId);

    await this.wishRepository.save(wish);

    return this.wishRepository.save(copiedWish);
  }

  async findOneById(id: number): Promise<Wish> {
    console.log('Finding wish with id:', id);
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wish) {
      throw new NotFoundException('Подарков не найдено');
    }
    return wish;
  }

  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async updateOne(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.findOneById(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Можно изменять только свои подарки');
    }
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Нельзя изменить цену на подарок, на который уже собираются деньги',
      );
    }
    return this.wishRepository.save({ ...wish, ...updateWishDto });
  }

  async updateRaisedAmount(id: number, amount: number): Promise<Wish> {
    const wish = await this.findOneById(id);
    wish.raised = +wish.raised + amount;
    return this.wishRepository.save(wish);
  }

  async removeOne(id: number, userId: number): Promise<void> {
    const wish = await this.findOneById(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Можно удалять только свои подарки');
    }
    await this.wishRepository.remove(wish);
  }
}
