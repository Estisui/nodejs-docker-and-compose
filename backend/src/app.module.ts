import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { HashModule } from './hash/hash.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wishlist } from './wishlists/entities/whishlist.entity';
import { CONFIG } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: CONFIG.DATABASE.TYPE as 'postgres',
      host: CONFIG.DATABASE.HOST,
      port: CONFIG.DATABASE.PORT,
      username: CONFIG.DATABASE.USERNAME,
      password: CONFIG.DATABASE.PASSWORD,
      database: CONFIG.DATABASE.DATABASE,
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
      logging: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        // other transports...
      ],
      // other options
    }),
    UsersModule,
    WishlistsModule,
    WishesModule,
    OffersModule,
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
