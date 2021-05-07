import { DeleteReviewInput, DeleteReviewOutput } from './dtos/deleteReview.dto';
import { CategoryOutput, CategoryInput } from './dtos/category.dto';
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
import { AllCategoriesOutput } from 'src/restaurant/dtos/AllCategories.dto';
import { Review } from './entities/review.entity';
import { CreateReviewInput, CreateReviewOutput } from './dtos/createReview.dto';
import { EditReviewOutput, EditReviewInput } from './dtos/editReview.dto';

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

    @Query(type => CategoryOutput)
    category(@Args('input') categoryInput: CategoryInput): Promise<CategoryOutput> {
        return this.restaurantService.findCategoryBySlug(categoryInput);
    }
};

@Resolver(of => Review)
export class ReviewResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Mutation(returns => CreateReviewOutput)
    @Role(['Client'])
    createReview(@AuthUser() reviewer: User, @Args('input') input: CreateReviewInput): Promise<CreateReviewOutput> {
        return this.restaurantService.createReview(reviewer, input);
    }

    @Mutation(returns => EditReviewOutput)
    @Role(['Client'])
    editReview(@AuthUser() reviewer: User, @Args('input') input: EditReviewInput): Promise<EditReviewOutput> {
        return this.restaurantService.editReview(reviewer, input);
    }

    @Mutation(returns => DeleteReviewOutput)
    @Role(['Client', 'Owner'])
    deleteReview(@AuthUser() reviewer: User, @Args('input') input: DeleteReviewInput): Promise<DeleteReviewOutput> {
        return this.restaurantService.deleteReview(reviewer, input);
    }
}
