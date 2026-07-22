import { JWT_ALGORITHM, JWT_TYPE } from "../constants/jwt-header.js";

export interface JwtHeader {
    alg: typeof JWT_ALGORITHM;
    typ: typeof JWT_TYPE;
}