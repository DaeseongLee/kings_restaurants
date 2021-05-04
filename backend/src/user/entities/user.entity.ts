import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum UserRole {
    Owner = "Owner",
    Client = "Client",
    Delievery = "Delievery",
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User {
    @Field(type => String)
    email: string;

    @Field(type => String)
    password: string;

    @Field(type => String)
    address: string;

    @Field(type => String)
    phone: string;

    @Field(type => UserRole)
    role: UserRole;

}