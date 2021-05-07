import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryResolver, RestaurantResolver, ReviewResolver } from './retaurant.resolver';
import { RestaurantService } from './restaurant.service';
import { CategoryRepository } from './repositories/category.repository';
import { Dish } from './entities/dish.entity';
import { Review } from './entities/review.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository, Review])],
    providers: [RestaurantResolver, CategoryResolver, ReviewResolver, RestaurantService,],
})
export class RestaurantModule { }
