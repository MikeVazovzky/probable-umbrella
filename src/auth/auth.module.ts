import { Module } from "@nestjs/common";
import { JwtModule } from "src/jwt/jwt.module.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";

@Module({
    imports: [JwtModule],
    controllers: [AuthController],
    providers: [AuthService],
})

export class AuthModule{}