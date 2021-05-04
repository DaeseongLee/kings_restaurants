import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    providers: [UserResolver],
    exports: [],
})
export class UserModule { }
