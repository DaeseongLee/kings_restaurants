import { Dish } from './dish.entity';
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Category } from "./category.entity";
import { Review } from "./review.entity";
import { Order } from 'src/order/entities/order.entity';

@InputType('RestaurntInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {

    @Field(type => String)
    @Column()
    @IsString()
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    coverImg?: string;

    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.restaurants, { onDelete: 'CASCADE' }
    )
    owner: User;

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

    @Field(type => Category, { nullable: true })
    @ManyToOne(
        type => Category,
        category => category.restaurants, { nullable: true, onDelete: 'SET NULL' }
    )
    category: Category;

    @RelationId((restaurant: Restaurant) => restaurant.category)
    categoryId: number;

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.restaurant,
    )
    orders: Order[];

    @Field(type => [Dish])
    @OneToMany(
        type => Dish,
        dish => dish.restaurant
    )
    menu: Dish[];

    @Field(type => [Review])
    @OneToMany(
        type => Review,
        review => review.restaurant,
    )
    reviews: Review[];
}