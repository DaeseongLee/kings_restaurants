import { AllCategoriesOutput } from 'src/user/dtos/AllCategories.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/deleteRestaurant.dto';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/createRestaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { User } from 'src/user/entities/user.entity';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/editRestaurant.dto';

@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
        @InjectRepository(Category) private readonly categoryRepository: CategoryRepository,
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
    }
}