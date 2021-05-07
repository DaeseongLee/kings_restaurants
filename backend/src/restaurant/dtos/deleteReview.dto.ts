import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";



@InputType()
export class DeleteReviewInput {
    @Field(type => Int)
    reviewId: number;
}

@ObjectType()
export class DeleteReviewOutput extends CoreOutput { }