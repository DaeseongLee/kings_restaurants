import { CoreEntity } from './../../common/entities/core.entity';
import { Field, Float, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationId } from "typeorm";
import { IsEnum, IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { OrderItem } from './orderItem.entity';


export enum OrderStatus {
    Pending = "Pending",
    Cooking = "Cooking",
    Cooked = "Cooked",
    PickedUp = "PickedUp",
    Delivered = "Delivered",
}

registerEnumType(OrderStatus, { name: "OrderStatus" });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.orders,
        { onDelete: 'SET NULL', nullable: true }
    )
    customer?: User;

    @RelationId((order: Order) => order.customer)
    clientId: number;


    @Field(type => User, { nullable: true })
    @ManyToOne(
        type => User,
        user => user.rides,
        { onDelete: 'SET NULL', nullable: true }
    )
    driver?: User;

    @RelationId((order: Order) => order.driver)
    driverId: number;

    @Field(type => Restaurant)
    @ManyToOne(
        type => Restaurant,
        { onDelete: 'SET NULL' }
    )
    retaurant: Restaurant;

    @RelationId((order: Order) => order.retaurant)
    restaurantId: number;

    @Field(type => OrderItem)
    @ManyToMany(type => OrderItem)
    @JoinTable()
    items: OrderItem[];


    @Field(type => Float, { nullable: true })
    @Column({ nullable: true })
    @IsNumber()
    totalPrice?: number;

    @Field(type => OrderStatus, { defaultValue: OrderStatus.Pending })
    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;
}