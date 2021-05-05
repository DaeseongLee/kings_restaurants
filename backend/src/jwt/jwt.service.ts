import { JwtModuleOptions } from './jwt.interface';
import { CONFIG_OPTIONS } from './../common/common.constant';
import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) { }
    hello() {
        console.log('hello');
    }

    sign(userId: number) {
        console.log('token', "comminasdasd")
        console.log('optionPrivateKey', this.options.privateKey)
        const token = jwt.sign({ id: userId }, this.options.privateKey);

        return token
    }

    verify(token: string) {
        return jwt.verify(token, this.options.privateKey);
    }
}
