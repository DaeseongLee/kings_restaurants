import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";


@InputType()
export class DeleteRestaurantInput {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput { }