import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { IsNumber } from 'class-validator';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { IsString } from 'class-validator';


@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
    @Field(type => String)
    name: string;

    @Field(type => Int, { nullable: true })
    extra?: number;
}


@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
    @Field(type => String)
    name: string;

    @Field(type => [DishChoice], { nullable: true })
    choiced?: DishChoice[];

    @Field(type => Int, { nullable: true })
    extra?: number;

}

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

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    @IsString()
    photo: string;

    @Field(type => String)
    @Column()
    @IsString()
    description: string;

    @Field(type => Restaurant)
    @ManyToOne(
        type => Restaurant,
        restaurant => restaurant.menu,
        { onDelete: 'CASCADE' }
    )
    restaurant: Restaurant

    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;

    @Field(type => [DishOption], { defaultValue: null })
    @Column({ type: 'json', nullable: true })
    options?: DishOption[];
}