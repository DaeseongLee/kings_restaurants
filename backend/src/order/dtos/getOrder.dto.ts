import { Order } from 'src/order/entities/order.entity';
import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from 'src/common/dtos/output.dto';


@InputType()
export class GetOrderInput extends PickType(Order, ['id']) { }

@ObjectType()
export class GetOrderOutput extends CoreOutput {
    @Field(type => Order, { nullable: true })
    order?: Order;
}