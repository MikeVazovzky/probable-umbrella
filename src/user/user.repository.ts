import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User} from "./entities/user.entity.js";
import { QueryFailedError, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { PostgresDriverError } from "src/common/interfaces/postgres-error.interface.js";
import { PostgresErrorCode } from "./enums/Postgres-error-code.js";
import { DeleteResult } from "typeorm/browser";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });

        if (!user){
            throw new NotFoundException('Пользователь не найден')
        }
        return(user);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async create(
        createUserDto: CreateUserDto,
        hashedPassword: string,
    ): Promise<User> {
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        try {
            return await this.userRepository.save(user);
        } catch(error) {
            if (error instanceof QueryFailedError) {
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

    async remove(id: number): Promise<void> {
        const deleteResult = await this.userRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException('Пользователь не найден');
        }
    }

    async update(
        id: number,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const user = await this.findById(id);

        Object.assign(user, updateUserDto);
        
        try {
            return await this.userRepository.save(user);
        } catch(error) {
            if (error instanceof QueryFailedError) {
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
}