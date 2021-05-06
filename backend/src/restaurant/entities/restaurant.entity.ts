import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";

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

    @Field(type => String)
    @Column()
    @IsString()
    coverImg: string;

    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.restaurants, { onDelete: 'CASCADE' }
    )
    owner: User;

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;
}