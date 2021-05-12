import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../../../../../uber-eats/src/restraurants/entities/restaurant.entity';

@InputType()
export class MyRestaurantInput extends PickType(Restaurant, ['id']) { }

@ObjectType()
export class MyRestaurantOutput extends CoreOutput {
    @Field(type => Restaurant, { nullable: true })
    restaurant?: Restaurant;
}