import { CreateAccountOutput, CreateAccountInput } from './dtos/createAccout.dto';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from './user.service';

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }
    @Query(returns => Boolean)
    me(): Boolean {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        return this.userService.createAccount(createAccountInput);
    }
}