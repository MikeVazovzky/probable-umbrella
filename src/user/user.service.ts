import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserModule } from './user.module.js';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(CreateUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(CreateUserDto);

        return await this.userRepository.save(user);
    }
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({
            id,
        });

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        return user;
    }
    async update(id: number, UpdateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        Object.assign(user, UpdateUserDto);

        return this.userRepository.save(user);
    }
    async remove(id: number): Promise<{message: string}> {
        const result = await this.userRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException('Пользователь не найден');
        }
        return {message: 'Пользователь успешно удалён',
        };
    }
}