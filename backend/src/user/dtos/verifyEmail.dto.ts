import { CoreOutput } from './../../common/dtos/output.dto';
import { Verification } from './../entities/verification.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';


@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) { }

@ObjectType()
export class VerifyEmailOutput extends CoreOutput { }