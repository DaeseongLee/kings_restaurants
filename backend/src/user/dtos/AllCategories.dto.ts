import { Category } from './../../restaurant/entities/category.entity';
import { ObjectType, Field } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";


@ObjectType()
export class AllCategoriesOutput extends CoreOutput {

    @Field(type => [Category], { nullable: true })
    categories?: Category[]
}