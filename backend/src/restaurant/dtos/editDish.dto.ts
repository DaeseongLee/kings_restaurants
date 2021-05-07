import { CoreOutput } from './../../common/dtos/output.dto';
import { Dish } from './../entities/dish.entity';
import { Field, InputType, Int, ObjectType, PartialType, PickType } from "@nestjs/graphql";


@InputType()
export class EditDishInput extends PartialType(PickType(Dish, ['name', 'price', 'description', 'options'])) {
    @Field(type => Int)
    restaurantId: number;

    @Field(type => Int)
    dishId: number;
};

@ObjectType()
export class EditDishOutput extends CoreOutput { }