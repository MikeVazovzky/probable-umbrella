import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/request/create-user.dto.js';
import { UpdateUserDto } from './dto/request/update-user.dto.js';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,

        private readonly configService: ConfigService,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {

        const saltRounds = Number(this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'));

        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds );

        return this.userRepository.create(
            createUserDto,
            hashedPassword,
        );

    }

    async update(id: number,updateUserDto: UpdateUserDto,): Promise<User> {

        let userData = updateUserDto;

        if (updateUserDto.password) {
            const saltRounds = Number(this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'),);

            const hashedPassword = await bcrypt.hash(updateUserDto.password, saltRounds);

        userData = {
            ...updateUserDto,
            password: hashedPassword,
        };

    }

    return this.userRepository.update(id, userData)
}
     
     async remove(id: number): Promise<{message: string}> {

        await this.userRepository.remove(id);

        return {
            message: 'Пользователь успешно удалён',
        };

    }
    
}