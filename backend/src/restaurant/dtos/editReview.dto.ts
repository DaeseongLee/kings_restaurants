import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Review } from "../entities/review.entity";



@InputType()
export class EditReviewInput extends PickType(Review, ['star', 'comment']) {
    @Field(type => Int)
    reviewId: number;
}

@ObjectType()
export class EditReviewOutput extends CoreOutput { }