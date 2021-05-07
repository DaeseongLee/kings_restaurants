import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryResolver, RestaurantResolver } from './retaurant.resolver';
import { RestaurantService } from './restaurant.service';
import { CategoryRepository } from './repositories/category.repository';
import { Dish } from './entities/dish.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])],
    providers: [RestaurantResolver, CategoryResolver, RestaurantService],
})
export class RestaurantModule { }
