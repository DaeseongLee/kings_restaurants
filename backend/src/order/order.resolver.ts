import { GetOrderInput, GetOrderOutput } from './dtos/getOrder.dto';
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { CreateOrderInput, CreateOrderOutput } from './dtos/createOrder.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/authUser.decorator';
import { OrderService } from './order.service';
import { User } from 'src/user/entities/user.entity';
import { EditOrderInput, EditOrderOutput } from "./dtos/editOrder.dto";
import { GetOrdersInput, GetOrdersOutput } from './dtos/getOrders.dto';


@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) { }

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
}