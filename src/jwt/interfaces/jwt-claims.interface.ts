import { JwtPayload } from "./jwt-payload.interface.js";


export interface JwtClaims extends JwtPayload {
    iss: string;
    iat: number;
    exp: number;
}