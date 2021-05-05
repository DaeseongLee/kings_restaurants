
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService,
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        console.log('middleware', '여기로 들어오나요???');
        if ('x-jwt' in req.headers) {
            const token = req.headers['x-jwt'];
            const decoded = this.jwtService.verify(token.toString());
            console.log('decoded!!!', decoded);
        }
        next();
    }
}
