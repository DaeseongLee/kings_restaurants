import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { CreateOrderInput, CreateOrderOutput } from './dtos/createOrder.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/authUser.decorator';
import { OrderService } from './order.service';
import { User } from 'src/user/entities/user.entity';


@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) { }

    @Mutation(returns => CreateOrderOutput)
    @Role(['Client'])
    createOrder(@AuthUser() client: User, @Args('input') input: CreateOrderInput): Promise<CreateOrderOutput> {
        return this.orderService.createOrder(client, input);
    }
}