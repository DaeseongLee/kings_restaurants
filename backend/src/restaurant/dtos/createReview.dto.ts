import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaginationInput, PaginationOutput } from './../../common/dtos/pagination.dto';
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { User } from 'src/user/entities/user.entity';




@InputType()
export class CreateReviewInput {
    @Field(type => Int)
    restaurantId: number;

    @Field(type => Int)
    star: number;

    @Field(type => String)
    comment: string;
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {
    @Field(type => User)
    reviewer?: User;
}