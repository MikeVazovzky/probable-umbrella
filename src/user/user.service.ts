import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { PostgresDriverError } from 'src/common/interfaces/postgres-error.interface.js';
import { PostgresErrorCode } from './enums/Postgres-error-code.js';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly configService: ConfigService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);

        const saltRounds = Number(this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'));

        user.password = await bcrypt.hash(user.password, saltRounds );

        try{
            return await this.userRepository.save(user);
        } catch(error) {
            if (error instanceof QueryFailedError){
                const driverError = error.driverError as PostgresDriverError;
                if (driverError.code === PostgresErrorCode.UniqueViolation) {
                    throw new ConflictException(
                        'Пользователь с таким именем уже существует',
                    );
                }
            }

            throw error;
        }
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