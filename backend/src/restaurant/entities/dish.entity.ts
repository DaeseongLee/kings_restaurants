import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { IsNumber } from 'class-validator';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { IsString } from 'class-validator';

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    name: string;

    @Field(type => Int)
    @Column()
    @IsNumber()
    price: number;

    @Field(type => String)
    @Column()
    @IsString()
    description: string;

    @Field(type => Restaurant)
    @ManyToOne(
        type => Restaurant,
        restaurant => restaurant.dishes
    )
    restaurant: Restaurant

    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;
}