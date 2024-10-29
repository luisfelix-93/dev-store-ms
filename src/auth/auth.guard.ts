import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request. headers['authorization'];

        if (!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];

        try {
            const decodedToken = this.jwtService.verify(token);
            const clientId = decodedToken.clientId;

            await this.cacheManager.set(`token:${clientId}`, token, 1800*1000);
            console.log(`token:${clientId}`, token);

            return true;
        } catch (error) {
            console.log('Error trying to authorize the requisition', error);
            return false;
        }
    }
}