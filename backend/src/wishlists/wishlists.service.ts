import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/whishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const wishes = await this.wishRepository.find({
      where: {
        id: In(createWishlistDto.itemsId),
      },
    });

    if (wishes.length !== createWishlistDto.itemsId.length) {
      throw new NotFoundException('Некоторые подарки не найдены');
    }

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });

    return await this.wishlistRepository.save(wishlist);
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({ relations: ['owner', 'items'] });
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Можно обновить только свой вишлист');
    }

    if (updateWishlistDto.itemsId) {
      const wishes = await this.wishRepository.find({
        where: {
          id: In(updateWishlistDto.itemsId),
        },
      });

      if (wishes.length !== updateWishlistDto.itemsId.length) {
        throw new NotFoundException('Некоторые подарки не найдены');
      }

      wishlist.items = wishes;
    }

    Object.assign(wishlist, updateWishlistDto);
    return this.wishRepository.save(wishlist);
  }

  async removeOne(id: number, userId: number): Promise<void> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Можно удалить только свой вишлист');
    }

    await this.wishlistRepository.remove(wishlist);
  }
}
