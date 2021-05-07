import { Review } from './entities/review.entity';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { AllCategoriesOutput } from 'src/restaurant/dtos/AllCategories.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/deleteRestaurant.dto';
import { Repository } from 'typeorm';
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

@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
        @InjectRepository(Category) private readonly categoryRepository: CategoryRepository,
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
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
                error: "You can't edit a restaurant that you don't own",
            };
        };
        return {
            ok: true,
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
                error: "Coudn't findCategoryBySlug",
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
                error: "Coudn't createReview",
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
            console.log("newReview!!!!", newReview);
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: "Coudn't editReview",
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
                error: "Coudn't deleteReview",
            }
        }
    }
}