import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Dish } from "src/restaurant/entities/dish.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";

@InputType("OrderItemOptionInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItemOption {
    @Field(type => String)
    name: string;
    @Field(type => String, { nullable: true })
    choice: string;
}

@InputType("OrderItemInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
    @Field(type => Dish, { nullable: true })
    @ManyToOne(type => Dish, { nullable: true, onDelete: "CASCADE", eager: true })
    dish: Dish;

    @Field(type => [OrderItemOption], { nullable: true })
    @Column({ type: 'json', nullable: true })
    options?: OrderItemOption[]
}