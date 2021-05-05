import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from './../entities/user.entity';
import { Field, InputType, Int, ObjectType, PartialType, PickType } from "@nestjs/graphql";


@InputType()
export class EditProfileInput extends PartialType(PickType(User, ['password', 'address', 'phone'])) {
    @Field(type => Int)
    userId: number;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput { }