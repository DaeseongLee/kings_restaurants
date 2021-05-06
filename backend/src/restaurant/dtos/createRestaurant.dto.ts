import { CoreOutput } from './../../common/dtos/output.dto';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";



@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, ['name', 'address', 'coverImg']) {
    @Field(type => String)
    categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {
    @Field(type => Int, { nullable: true })
    restaurantId?: number;
}