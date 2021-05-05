import { UserProfileInput, UserProfileOutput } from './dtos/userProfile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { CreateAccountOutput, CreateAccountInput } from './dtos/createAccout.dto';
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from './user.service';
import { EditProfileInput, EditProfileOutput } from './dtos/editProfile.dto';
import { AuthUser } from 'src/auth/authUser.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(returns => User)
    @Role(['Any'])
    me(@AuthUser() authUser: User) {
        return authUser;
    }

    @Query(returns => User)
    userProfile(@Args() { userId }: UserProfileInput): Promise<UserProfileOutput> {
        return this.userService.findById(userId);
    }

    @Mutation(returns => CreateAccountOutput)
    createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        return this.userService.createAccount(createAccountInput);
    }

    @Mutation(returns => LoginOutput)
    login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        return this.userService.login(loginInput);
    }

    @Mutation(returns => EditProfileOutput)
    @Role(['Any'])
    editProfile(@AuthUser() authUser: User, @Args('input') editProfileInput: EditProfileInput): Promise<EditProfileOutput> {
        return this.userService.editProfile(authUser, editProfileInput);
    }
}