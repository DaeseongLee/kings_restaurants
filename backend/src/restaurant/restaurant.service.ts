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

    async editRestaurant(owner: User, input: EditRestaurantInput): Promise<EditRestaurantOutput> {
        try {
            const oldRestaurant = await this.restaurantRepository.findOne(input.restaurantId);
            console.log("oldRestaurant", oldRestaurant);
            if (!oldRestaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                }
            };
            if (owner.id !== oldRestaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't edit a restaurant that you don't own",
                };
            };
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
    }
}