import { UserRole } from "src/user/enums/user-role.enum.js";

export interface JwtPayload {
    sub: number,
    username: string,
    role: UserRole,
}

