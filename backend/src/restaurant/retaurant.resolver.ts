import { User } from 'src/user/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/createRestaurant.dto';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { AuthUser } from 'src/auth/authUser.decorator';
import { Role } from 'src/auth/role.decorator';
import { RestaurantService } from './restaurant.service';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/editRestaurant.dto';

@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Mutation(returns => CreateRestaurantOutput)
    @Role(['Owner'])
    createRestaurant(@AuthUser() owner: User,
        @Args('input') input: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(owner, input);
    };

    @Mutation(returns => EditRestaurantOutput)
    @Role(['Owner'])
    editRestaurant(@AuthUser() owner: User, @Args('input') input: EditRestaurantInput): Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(owner, input);
    }

}