import { Resolver, Query } from "@nestjs/graphql";
import { User } from "./entities/user.entity";

@Resolver(of => User)
export class UserResolver {

    @Query(returns => Boolean)
    me(): Boolean {
        return true;
    }
}