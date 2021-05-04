import { CreateAccountInput, CreateAccountOutput } from './dtos/createAccout.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { LoginInput, LoginOutput } from './dtos/login.dto';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    async createAccount(input: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const exitUser = await this.usersRepository.findOne({ email: input?.email });
            console.log(exitUser);
            if (exitUser) {
                return {
                    ok: false,
                    error: 'This email aleady exist',
                }
            }
            this.usersRepository.save(this.usersRepository.create(input));
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't create account"
            }
        }
    };

    async login({ email, password }: LoginInput): Promise<LoginOutput> {
        try {
            const user = await this.usersRepository.findOne({ email });
            if (!user) {
                return {
                    ok: false,
                    error: 'User not Found',
                }
            };
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect) {
                return {
                    ok: false,
                    error: 'Wrong password',
                }
            };
            return {
                ok: true,
                token: 'gogogo',
            }
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't login"
            }
        }
    }
}