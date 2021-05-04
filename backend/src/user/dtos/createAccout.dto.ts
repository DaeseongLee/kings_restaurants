import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@InputType()
export class CreateAccountInput extends PickType(User, ['email', 'address', 'password', 'phone', 'role']) { }

@ObjectType()
export class CreateAccountOutput {

    @Field(type => Boolean)
    ok: boolean;

    @Field(type => String, { nullable: true })
    error?: string;
}
