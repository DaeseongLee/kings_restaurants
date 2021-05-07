import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany, ManyToOne, RelationId } from "typeorm";
import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@InputType('ReviewInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Review extends CoreEntity {
    @Field(type => Int)
    @Column()
    @IsNumber()
    star: number;

    @Field(type => String)
    @Column()
    @IsString()
    comment: string;

    @Field(type => Restaurant)
    @ManyToOne(
        type => Restaurant,
        restaurant => restaurant.reviews, { onDelete: 'CASCADE' }
    )
    restaurant: Restaurant;

    @RelationId((review: Review) => review.restaurant)
    restaurantId: number;

    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.reviews
    )
    reviewer: User;

    @RelationId((review: Review) => review.reviewer)
    reviewerId: number;

}