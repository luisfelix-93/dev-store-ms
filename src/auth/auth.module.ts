import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: 'XXXX',
            signOptions: { expiresIn: '1h' },
        })
    ],
    providers: [
        JwtAuthGuard
    ]
})
export class AuthModule {}
