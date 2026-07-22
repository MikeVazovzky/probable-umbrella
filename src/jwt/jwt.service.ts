import { ConfigService } from "@nestjs/config";
import { JWT_ALGORITHM, JWT_HEADER } from "./constants/jwt-header.js";
import { createHmac } from "node:crypto";
import { JwtClaims } from "./interfaces/jwt-claims.interface.js";
import { JWT_ISSUER } from "./constants/jwt-issuer.js";
import { JWT_EXPIRATION } from "./constants/jwt-expiration.js";
import { JwtPayload } from "./interfaces/jwt-payload.interface.js";
import { UnauthorizedException } from "@nestjs/common";

export class JwtService {
    private readonly secret: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.secret = this.configService.getOrThrow<string>('JWT_SECRET');
    }

      generateToken(payload: JwtPayload): string {

        const issuedAt = this.getCurrentUnixTime();

        const claims: JwtClaims = {
            ...payload,
            iss: JWT_ISSUER,
            iat: issuedAt,
            exp: issuedAt + JWT_EXPIRATION,
        };
        
        const encodedHeader = this.base64ToBase64Url(
            this.base64Encode(JSON.stringify(JWT_HEADER))
        );

        const encodedPayload = this.base64ToBase64Url(
            this.base64Encode(JSON.stringify(claims))
        );

        const dataToSign = `${encodedHeader}.${encodedPayload}`;

        const signature = this.createSignature(dataToSign);

        return `${dataToSign}.${signature}`;
      }

      verifyToken(token: string): JwtClaims{
        const tokenParts = token.split('.');

        if(tokenParts.length !== 3){
            throw new UnauthorizedException('Недействительный токен');
        }

        const [encodedHeader, encodedPayload, signature] = tokenParts;

        const dataToSign = `${encodedHeader}.${encodedPayload}`;

        const expectedSignature = this.createSignature(dataToSign)

        if(expectedSignature !== signature){
            throw new UnauthorizedException('Недействительный токен');
        }

        let jwtClaims: JwtClaims;

            try {
                const payload = this.base64UrlToBase64(encodedPayload);
                
                const json = this.base64ToString(payload);

                jwtClaims = JSON.parse(json) as JwtClaims;
        } catch {
            throw new UnauthorizedException(
                'Недействительный токен'
            );
        }

        if(this.getCurrentUnixTime() >= jwtClaims.exp){
            throw new UnauthorizedException('Недействительный токен');
        }

        return jwtClaims;
      }

    private base64Encode(value: string): string {
        return Buffer.from(value).toString('base64');
    }

    private base64ToBase64Url(value: string): string {
        return value
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }

    private createSignature(
        data: string
    ): string {
        const hmac = createHmac(
            JWT_ALGORITHM, this.secret
        );

        hmac.update(data);

        return this.base64ToBase64Url(
            hmac.digest('base64'),
        );
    }

    private base64UrlToBase64(value: string): string {
        value = value
        .replace(/\-/g, '+')
        .replace(/\_/g, '/');

        const remainder = value.length % 4;

        switch(remainder) {
            case 1:
                throw new UnauthorizedException('Недействительный токен');
            case 2:
                value += '=='
                break;
            case 3:
                value += '='
                break;
        }

        return value;
    }

    private base64ToString(value: string): string {
        return Buffer.from(value, 'base64').toString('utf-8');
    }

    private getCurrentUnixTime(): number {
        return Math.floor(Date.now() / 1000);
    }
}