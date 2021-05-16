import { CoreOutput } from '../../common/dtos/output.dto';
import { Field, Float, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Review } from '../entities/review.entity';


@InputType()
export class ReviewsInput {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class ReviewsOutput extends CoreOutput {
    @Field(type => [Review], { nullable: true })
    reviews?: Review[];

    @Field(type => Float, { nullable: true })
    reviewTotal?: number;
}