import { Category } from './entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/createRestaurant.dto';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Resolver, Query, Mutation, Args, Context, ResolveField, Parent, Int } from "@nestjs/graphql";
import { AuthUser } from 'src/auth/authUser.decorator';
import { Role } from 'src/auth/role.decorator';
import { RestaurantService } from './restaurant.service';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/editRestaurant.dto';
import { DeleteRestaurantOutput, DeleteRestaurantInput } from './dtos/deleteRestaurant.dto';
import { AllCategoriesOutput } from 'src/user/dtos/AllCategories.dto';

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

    @Mutation(returns => DeleteRestaurantOutput)
    @Role(['Owner'])
    deleteRestaurant(@AuthUser() owner: User, @Args('input') input: DeleteRestaurantInput): Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(owner, input);
    }
}

@Resolver(of => Category)
export class CategoryResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @ResolveField(type => Int)
    restaurantCount(@Parent() category: Category): Promise<Number> {
        return this.restaurantService.countRestaurants(category);
    }

    @Query(type => AllCategoriesOutput)
    allCategories(): Promise<AllCategoriesOutput> {
        return this.restaurantService.allCategories();
    }
}