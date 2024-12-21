import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(
    createUserDto: CreateUserDto & { password: string },
  ): Promise<User> {
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUserByEmail) {
      throw new ConflictException(
        'Пользователь с таким email уже зарегистрирован',
      );
    }

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUserByUsername) {
      throw new ConflictException(
        'Пользователь с таким username уже зарегистрирован',
      );
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findMany(searchString: string): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { username: Like(`%${searchString}%`) },
        { email: Like(`%${searchString}%`) },
      ],
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserWishes(userId: number): Promise<Wish[]> {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['wishes'],
    });
    return user.wishes;
  }

  async findUserWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes'], // Load wishes only here
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.wishes; // Now wishes are loaded
  }

  async updateOne(
    options: FindOneOptions<User>,
    updateUserDto: UpdateUserDto,
    userId: number,
  ): Promise<User> {
    const user = await this.findOne(options);

    if (user.id !== userId) {
      throw new ForbiddenException('Можно редактировать только свой профиль');
    }

    if (updateUserDto.email) {
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUserByEmail && existingUserByEmail.id !== userId) {
        throw new ConflictException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
    }

    if (updateUserDto.username) {
      const existingUserByUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUserByUsername && existingUserByUsername.id !== userId) {
        throw new ConflictException(
          'Пользователь с таким username уже зарегистрирован',
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.getHash(
        updateUserDto.password,
      );
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async removeOne(options: FindOneOptions<User>): Promise<User> {
    const user = await this.findOne(options);
    return this.userRepository.remove(user);
  }
}
