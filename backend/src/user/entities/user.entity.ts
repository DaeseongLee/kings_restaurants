import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";

export enum UserRole {
    Owner = "Owner",
    Client = "Client",
    Delievery = "Delievery",
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsEmail()
    email: string;

    @Field(type => String)
    @Column()
    @IsString()
    password: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    phone: string;

    @Field(type => UserRole)
    @Column()
    @IsEnum(UserRole)
    role: UserRole;

    @Field(type => Boolean)
    @Column()
    @IsBoolean()
    verified: boolean;

}