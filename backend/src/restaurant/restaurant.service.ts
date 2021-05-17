import { ReviewsInput, ReviewsOutput } from './dtos/reviews.dto';
import { EditDishInput, EditDishOutput } from './dtos/editDish.dto';
import { Review } from './entities/review.entity';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { AllCategoriesOutput } from 'src/restaurant/dtos/AllCategories.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/deleteRestaurant.dto';
import { Raw, Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/createRestaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { User, UserRole } from 'src/user/entities/user.entity';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/editRestaurant.dto';
import { CreateReviewInput, CreateReviewOutput } from './dtos/createReview.dto';
import { EditReviewInput, EditReviewOutput } from './dtos/editReview.dto';
import { DeleteReviewInput, DeleteReviewOutput } from './dtos/deleteReview.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/createDish.dto';
import { Dish } from './entities/dish.entity';
import { DeleteDishInput, DeleteDishOutput } from './dtos/deleteDish.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/searchRestaurant.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dtos/myRestaurant.dto';
import { MyRestaurantsOutput } from './dtos/myRestaurants.dto';


@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
        @InjectRepository(Category) private readonly categoryRepository: CategoryRepository,
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Dish) private readonly dishRepository: Repository<Dish>,
    ) { }

    async createRestaurant(owner: User, input: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = await this.restaurantRepository.create(input);
            newRestaurant.owner = owner;
            const category = await this.categoryRepository.getOrCreate(input.categoryName);
            newRestaurant.category = category;

            await this.restaurantRepository.save(newRestaurant);
            return {
                ok: true,
                restaurantId: newRestaurant.id,
            }
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: "Couldn't createRestaurant"
            }
        }
    };

    async findRestaurant(owner: User, restaurantId: number) {
        const restaurant = await this.restaurantRepository.findOne(restaurantId);
        if (!restaurant) {
            return {
                ok: false,
                error: 'Restaurant not found',
            }
        };
        if (owner.id !== restaurant.ownerId) {
            return {
                ok: false,
                error: "You have no authority",
            };
        };
        return {
            ok: true,
            restaurant,
        }
    };

    async editRestaurant(owner: User, input: EditRestaurantInput): Promise<EditRestaurantOutput> {
        try {
            const result = await this.findRestaurant(owner, input.restaurantId);
            if (!result.ok) {
                return result;
            }
            let category: Category = null;
            if (input.categoryName) {
                category = await this.categoryRepository.getOrCreate(input.categoryName);
            };
            this.restaurantRepository.save({
                id: input.restaurantId,
                ...input,
                ...(category && { category })
            });
            return {
                ok: true,
            }
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: "Couldn't editRestaurant",
            }
        }
    };

    async deleteRestaurant(owner: User, input: DeleteRestaurantInput): Promise<DeleteRestaurantOutput> {
        try {
            const result = await this.findRestaurant(owner, input.restaurantId);
            if (!result.ok) {
                return result;
            }

            this.restaurantRepository.delete(input.restaurantId);
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't deleteRestaurant",
            }
        }
    };

    async countRestaurants(category: Category) {
        try {
            return await this.restaurantRepository.count({ category });
        } catch (error) {
            console.error(error);
        }
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categoryRepository.find();

            return {
                ok: true,
                categories
            }

        } catch (error) {
            return {
                ok: false,
                error: "Couldn't allCategories"
            }
        }
    };

    async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categoryRepository.findOne({ slug });
            if (!category) {
                return {
                    ok: false,
                    error: 'Category Not Found',
                }
            };
            const restaurants = await this.restaurantRepository.find({
                where: { category },
                take: 3,
                skip: (page - 1) * 3,
                order: {
                    createdAt: 'DESC',
                },
            });
            const totalResults = await this.countRestaurants(category);
            return {
                ok: true,
                category,
                restaurants,
                totalPages: Math.ceil(totalResults / 3),
                totalResults
            };
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't findCategoryBySlug",
            }
        }
    };

    async createReview(reviewer: User, { restaurantId, star, comment }: CreateReviewInput): Promise<CreateReviewOutput> {
        try {
            const restaurant = await this.restaurantRepository.findOne(restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: "Not found restaurant",
                }
            }

            const review = await this.reviewRepository.create({ star, comment });
            review.restaurant = restaurant;
            review.reviewer = reviewer;
            await this.reviewRepository.save(review);
            return {
                ok: true,
                reviewer,
            }
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: "Couldn't createReview",
            }
        }
    };

    async findReview(reviewer: User, reviewerId: number) {
        const review = await this.reviewRepository.findOne(reviewerId);
        if (!review) {
            return {
                ok: false,
                error: "Not found review",
            }
        };
        if (reviewer.role === UserRole.Client && reviewer.id !== review.reviewerId) {
            return {
                ok: false,
                error: "You have no authority"
            }
        };
        return {
            ok: true,
        }
    };

    async editReview(reviewer: User, input: EditReviewInput): Promise<EditReviewOutput> {
        try {

            const result = await this.findReview(reviewer, input.reviewId);

            if (!result.ok) return result;

            const newReview = await this.reviewRepository.save({
                id: input.reviewId,
                ...input
            });
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't editReview",
            }
        }
    };
    async deleteReview(reviewer: User, input: DeleteReviewInput): Promise<DeleteReviewOutput> {
        try {

            const result = await this.findReview(reviewer, input.reviewId);
            if (!result.ok) return result;

            await this.reviewRepository.delete(input.reviewId);
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't deleteReview",
            }
        }
    }

    async createDish(owner: User, input: CreateDishInput): Promise<CreateDishOutput> {
        try {
            const auth = await this.findRestaurant(owner, input.restaurantId);
            if (!auth.ok) return auth;

            const dish = await this.dishRepository.create({
                ...input,
            });
            dish.restaurant = auth.restaurant;
            await this.dishRepository.save(dish);
            return {
                ok: true,
            }


        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: "Couldn't createDish"
            }
        }
    }

    async editDish(owner: User, input: EditDishInput): Promise<EditDishOutput> {
        try {
            const auth = await this.findRestaurant(owner, input.restaurantId);
            if (!auth.ok) return auth;

            const dish = await this.dishRepository.findOne(input.dishId);
            if (!dish) {
                return {
                    ok: false,
                    error: "Not found dish",
                }
            };
            await this.dishRepository.save({
                id: input.dishId,
                ...input,
            });
            return {
                ok: true,
            }

        } catch (error) {
            return {
                ok: false,
                error: "Couldn't editDish",
            }
        }
    };

    async deleteDish(owner: User, input: DeleteDishInput): Promise<DeleteDishOutput> {
        try {
            const auth = await this.findRestaurant(owner, input.restaurantId);
            if (!auth.ok) return auth;

            const dish = await this.dishRepository.findOne(input.dishId);

            if (!dish) {
                return {
                    ok: false,
                    error: "Not found dish",
                }
            };
            this.dishRepository.delete(input.dishId);
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: "Couldn't deleteDish",
            }
        }
    }


    async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
        try {

            const [restaurants, totalResults] = await this.restaurantRepository.findAndCount({
                skip: (page - 1) * 3,
                take: 3,
            });


            return {
                ok: true,
                results: restaurants,
                totalPages: Math.ceil(totalResults / 3),
                totalResults
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not load restaurants',
            }
        }
    }

    async findRestaurantById({ restaurantId }: RestaurantInput): Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurantRepository.findOne(restaurantId, {
                relations: ['menu'],
            });

            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                }
            }
            return {
                ok: true,
                restaurant,
            }
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: 'Could not findRestaurant',
            }
        }
    }

    async searchRestaurantByName({ query, page }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurantRepository.findAndCount({
                where: {
                    // name: Like(`%${query}%`),
                    name: Raw(name => `${name} ILIKE '%${query}%'`),

                },
                skip: (page - 1) * 3,
                take: 3,
            });

            return {
                ok: true,
                restaurants,
                totalResults,
                totalPages: Math.ceil(totalResults / 3),
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not search for restaurants',
            }
        }
    }
    async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
        try {
            const restaurants = await this.restaurantRepository.find({ owner });
            return {
                restaurants,
                ok: true,
            };
        } catch {
            return {
                ok: false,
                error: 'Could not find restaurants.',
            };
        }
    };

    async myRestaurant(
        owner: User,
        { id }: MyRestaurantInput,
    ): Promise<MyRestaurantOutput> {
        try {
            const restaurant = await this.restaurantRepository.findOne(
                { owner, id },
                { relations: ['menu', 'orders', 'reviews'] },
            );


            if (restaurant.reviews.length !== 0) {
                let reviewTotal = 0;
                let score = 0;
                restaurant.reviews.forEach((review) => (
                    score = score + review.star
                ));
                reviewTotal = +(score / restaurant.reviews.length).toFixed(1);
                restaurant.reviewTotal = +reviewTotal;
            };
            return {
                restaurant,
                ok: true,
            };
        } catch {
            return {
                ok: false,
                error: 'Could not find restaurant',
            };
        }
    };

    async reviews(input: ReviewsInput): Promise<ReviewsOutput> {
        try {
            const restaurant = await this.restaurantRepository.findOne(input.restaurantId);

            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Could not find restaurant',
                };
            }
            const reviews = await this.reviewRepository.find({
                where: {
                    restaurant
                },
                order: { updatedAt: 'DESC' }
            });

            let reviewTotal = 0;
            if (reviews.length !== 0) {
                let score = 0;
                reviews.forEach((review) => (
                    score = score + review.star
                ));

                reviewTotal = +(score / reviews.length).toFixed(1);
            };
            return {
                reviews,
                reviewTotal,
                ok: true,
            };
        } catch {
            return {
                ok: false,
                error: 'Could not reviews.',
            };
        }
    };

}