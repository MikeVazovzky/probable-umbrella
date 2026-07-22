import { JwtHeader } from "../interfaces/jwt-header.interface.js";

export const JWT_ALGORITHM = 'HS256';

export const JWT_TYPE = 'JWT';

export const JWT_HEADER: JwtHeader = {
    alg: JWT_ALGORITHM,
    typ: JWT_TYPE,
}