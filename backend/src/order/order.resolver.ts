import { TakeOrderInput, TakeOrderOutput } from './dtos/takeOrder.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/getOrder.dto';
import { Args, Mutation, Resolver, Query, Subscription } from "@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { CreateOrderInput, CreateOrderOutput } from './dtos/createOrder.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/authUser.decorator';
import { OrderService } from './order.service';
import { User } from 'src/user/entities/user.entity';
import { EditOrderInput, EditOrderOutput } from "./dtos/editOrder.dto";
import { GetOrdersInput, GetOrdersOutput } from './dtos/getOrders.dto';
import { Inject } from '@nestjs/common';
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from 'src/common/common.constant';
import { PubSub } from 'graphql-subscriptions';
import { OrderUpdateInput } from './dtos/orderUpdate.dto';



@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub) { }

    @Query(returns => GetOrderOutput)
    @Role(['Any'])
    async getOrder(@AuthUser() user: User, @Args('input') input: GetOrderInput): Promise<GetOrderOutput> {
        return this.orderService.getOrder(user, input);
    }

    @Query(returns => GetOrdersOutput)
    @Role(['Any'])
    async getOrders(@AuthUser() user: User, @Args('input') input: GetOrdersInput): Promise<GetOrdersOutput> {
        return this.orderService.getOrders(user, input);
    }

    @Mutation(returns => CreateOrderOutput)
    @Role(['Client'])
    createOrder(@AuthUser() client: User, @Args('input') input: CreateOrderInput): Promise<CreateOrderOutput> {
        return this.orderService.createOrder(client, input);
    }

    @Mutation(returns => EditOrderOutput)
    @Role(['Owner', 'Delievery'])
    async editOrder(@AuthUser() user: User, @Args('input') input: EditOrderInput): Promise<EditOrderOutput> {
        return this.orderService.editOrder(user, input);
    }

    @Mutation(returns => TakeOrderOutput)
    @Role(['Delievery'])
    takeOrder(@AuthUser() driver: User, @Args('input') takeOrderInput: TakeOrderInput): Promise<TakeOrderOutput> {
        return this.orderService.takeOrder(driver, takeOrderInput);
    }

    @Subscription(returns => Order, {
        filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
            return ownerId === user.id;
        },
        resolve: ({ pendingOrders: { order } }) => order,
    })
    @Role(['Owner'])
    pendingOrders() {
        return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
    }

    @Subscription(returns => Order)
    @Role(['Delievery'])
    cookedOrders() {
        return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
    }

    @Subscription(returns => Order, {
        filter: (
            { orderUpdates: order }: { orderUpdates: Order },
            { input }: { input: OrderUpdateInput },
            { user }: { user: User }
        ) => {
            console.log("ownerId:", order.restaurant.ownerId, "user", user.id);
            if (order.driverId !== user.id &&
                order.clientId !== user.id &&
                order.restaurant.ownerId !== user.id
            ) return false;
            return order.id === input.id
        },
        resolve: ({ orderUpdates: order }) => order
    })
    @Role(['Any'])
    orderUpdates(@Args('input') input: OrderUpdateInput) {
        return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
    }
}