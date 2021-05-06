import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/createRestaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { User } from 'src/user/entities/user.entity';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';

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
            return {
                ok: false,
                error: "Couldn't createRestaurant"
            }
        }
    }
}