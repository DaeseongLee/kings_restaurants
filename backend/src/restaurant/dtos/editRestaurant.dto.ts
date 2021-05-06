import { CoreOutput } from './../../common/dtos/output.dto';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';


@InputType()
export class EditRestaurantInput extends PickType(Restaurant, ['name', 'address', 'coverImg']) {
    @Field(type => Int)
    restaurantId: number;

    @Field(type => String, { nullable: true })
    categoryName?: string;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput { }