import { Dish } from './../restaurant/entities/dish.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { OrderItem } from './entities/orderItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem, Restaurant, Dish])],
    providers: [OrderResolver, OrderService],
})
export class OrderModule { }
