import { TakeOrderInput, TakeOrderOutput } from './dtos/takeOrder.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/getOrder.dto';
import { OrderItem } from './entities/orderItem.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { Inject, Injectable } from "@nestjs/common";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/createOrder.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { EditOrderInput, EditOrderOutput } from './dtos/editOrder.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/getOrders.dto';
import { NEW_PENDING_ORDER, PUB_SUB } from 'src/common/common.constant';
import { PubSub } from 'graphql-subscriptions';



@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
        @InjectRepository(Dish) private readonly dishRepository: Repository<Dish>,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
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
                if (item.options) {
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
                }
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
            this.pubSub.publish(NEW_PENDING_ORDER, { pendingOrders: { order, ownerId: restaurant.ownerId } })
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
    };

    async getOrder(user: User, { id: orderId }: GetOrderInput): Promise<GetOrderOutput> {
        try {
            const order = await this.orderRepository.findOne(orderId);
            if (!order) {
                return {
                    ok: false,
                    error: "Order not found.",
                };
            };
            if (!this.canSeeOrder(user, order)) {
                return {
                    ok: false,
                    error: "You cant't see that.",
                };
            };
            return {
                ok: true,
                order,
            }
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error,
            }
        }
    };

    async getOrders(user: User, { status: orderStatus }: GetOrdersInput): Promise<GetOrdersOutput> {
        try {
            let orders: Order[];
            if (user.role === UserRole.Client) {
                orders = await this.orderRepository.find({
                    where: {
                        customer: user,
                        ...(orderStatus && { orderStatus }),
                    },
                });
            } else if (user.role === UserRole.Delievery) {
                orders = await this.orderRepository.find({
                    where: {
                        driver: user,
                        ...(orderStatus && { orderStatus }),
                    },
                });
            } else if (user.role === UserRole.Owner) {
                const restaurant = await this.restaurantRepository.find({
                    where: {
                        owner: user
                    },
                    relations: ['orders']
                });
                orders = restaurant.map(restaurant => restaurant.orders).flat(1);
                if (orderStatus) {
                    orders = orders.filter(order => order.orderStatus === orderStatus);
                }
            };
            return {
                ok: true,
                orders,
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    };

    async takeOrder(driver: User, { id: orderId }: TakeOrderInput): Promise<TakeOrderOutput> {
        try {
            const order = await this.orderRepository.findOne(orderId);
            if (!order) {
                return {
                    ok: false,
                    error: 'Order not found',
                };
            };
            if (order.driver) {
                return {
                    ok: false,
                    error: "This order already has a driver",
                }
            };
            const ord = await this.orderRepository.save({
                id: orderId,
                driver,
            });
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