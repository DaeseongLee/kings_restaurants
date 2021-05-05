import { CreateAccountInput, CreateAccountOutput } from './dtos/createAccout.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/editProfile.dto';
import { UserProfileOutput } from './dtos/userProfile.dto';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,) { }

    async createAccount(input: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const exitUser = await this.usersRepository.findOne({ email: input?.email });
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
            const user = await this.usersRepository.findOne({ email }, { select: ['id', 'password'] });

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
            const token = this.jwtService.sign(user.id);
            return {
                ok: true,
                token
            }
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: "Couldn't login"
            }
        }
    };

    async findById(userId: number): Promise<UserProfileOutput> {
        try {
            const user = await this.usersRepository.findOne(userId);
            if (!user) {
                return {
                    ok: false,
                    error: "Not found user",
                }
            }
            return {
                ok: true,
                user
            }
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't findById"
            }
        }
    }

    async editProfile({ id: userId }: User, { password, address, phone }: EditProfileInput): Promise<EditProfileOutput> {
        try {
            const user = await this.usersRepository.findOne(userId);
            if (password) {
                user.password = password;
            }
            if (address) {
                user.address = address;
            }
            if (phone) {
                user.phone = phone;
            }
            await this.usersRepository.save(user);
            return {
                ok: true,
            }
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: "Couldn't editProfile",
            }
        }
    }
}