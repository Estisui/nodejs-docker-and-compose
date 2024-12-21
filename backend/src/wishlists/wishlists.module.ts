import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from './entities/whishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User, Wish])],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsModule],
})
export class WishlistsModule {}
