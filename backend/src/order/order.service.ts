import { OrderItem } from './entities/orderItem.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/createOrder.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from './entities/order.entity';
import { Dish } from 'src/restaurant/entities/dish.entity';



@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
        @InjectRepository(Dish) private readonly dishRepository: Repository<Dish>,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    ) { }

    async createOrder(client: User, { restaurantId, items }: CreateOrderInput): Promise<CreateOrderOutput> {
        try {
            const restaurant = await this.restaurantRepository.findOne(restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                }
            };

            let orderFinalPrice = 0;
            const orderItem: OrderItem[] = [];

            for (const item of items) {
                const dish = await this.dishRepository.findOne(item.dishId);
                if (!dish) {
                    return {
                        ok: false,
                        error: "Dish not found",
                    }
                };

                let dishFinalPrice = dish.price;
                for (const itemOption of item.options) {
                    const dishOption = dish.options.find(dishOption => dishOption.name === itemOption.name);
                    if (dishOption) {
                        dishFinalPrice += dishOption.extra;
                    } else {
                        const dishOptionChoice = dishOption.choiced?.find(optionChoice => optionChoice.name === itemOption.choice);
                        if (dishOptionChoice?.extra) {
                            dishFinalPrice += dishOptionChoice.extra
                        }
                    };
                };
                orderFinalPrice = orderFinalPrice + dishFinalPrice;
                const orderItems = await this.orderItemRepository.save(
                    this.orderItemRepository.create({
                        dish,
                        options: item.options,
                    })
                );
                orderItem.push(orderItems);
            }
            const order = await this.orderRepository.save(
                this.orderRepository.create({
                    customer: client,
                    restaurant,
                    totalPrice: orderFinalPrice,
                    items: orderItem,
                })
            );
            return {
                ok: true,
                orderId: order.id,
            }
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: "Couldn't createOrder",
            }
        }
    }
}