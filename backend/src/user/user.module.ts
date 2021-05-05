import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigService],
    providers: [UserResolver, UserService],
    exports: [],
})
export class UserModule { }
