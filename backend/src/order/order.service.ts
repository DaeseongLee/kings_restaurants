import { OrderItem } from './entities/orderItem.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/createOrder.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { EditOrderInput, EditOrderOutput } from './dtos/editOrder.dto';



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
    };

    canSeeOrder(user: User, order: Order): boolean {
        let canSee = true;
        if (user.role === UserRole.Client && order.clientId! == user.id) {
            canSee = false;
        }
        if (user.role === UserRole.Delievery && order.driverId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.Owner && order.restaurant.ownerId !== user.id) {
            canSee = false;
        }
        return canSee;
    }

    async editOrder(user: User, { id: orderId, orderStatus }: EditOrderInput): Promise<EditOrderOutput> {
        try {
            const order = await this.orderRepository.findOne(orderId);
            console.log(order);
            console.log(user);
            if (!order) {
                return {
                    ok: false,
                    error: "Order not found.",
                }
            };
            if (!this.canSeeOrder(user, order)) {
                return {
                    ok: false,
                    error: "Can't see this.",
                }
            };

            let canEdit = true;
            if (user.role === UserRole.Owner) {
                if (orderStatus != OrderStatus.Cooking && orderStatus !== OrderStatus.Cooked) {
                    canEdit = false;
                }
            }
            if (user.role === UserRole.Delievery) {
                if (orderStatus !== OrderStatus.PickedUp && orderStatus !== OrderStatus.Delivered) {
                    canEdit = false;
                };
            };

            if (!canEdit) {
                return {
                    ok: false,
                    error: "You can't do that",
                }
            };

            await this.orderRepository.save([
                {
                    id: orderId,
                    orderStatus,
                }
            ]);

            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }
}