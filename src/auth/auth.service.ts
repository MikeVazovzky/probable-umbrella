import { UserRepository } from "src/user/user.repository.js";
import { LoginDto } from "./dto/login.dto.js";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "src/jwt/jwt.service.js";
import { JwtPayload } from "src/jwt/interfaces/jwt-payload.interface.js";

@Injectable()
export class AuthService{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto): Promise<{ accessToken: string }>
    {

        const user = await this.userRepository.findByUsername(loginDto.username);

        if(user === null) {
            throw new UnauthorizedException(
                'Неверное имя пользователя или пароль'
            )
        }

        const check = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if(!check) {
            throw new UnauthorizedException(
                'Неверное имя пользователя или пароль'
            )
        }
        
        const payload: JwtPayload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        }
        
        const token = this.jwtService.generateToken(payload);

        return {
            accessToken: token,
        };
    }
}