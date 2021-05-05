import { CoreEntity } from './../../common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
@InputType('VerificationInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
    @Field(type => String)
    @Column()
    code: string;

    @OneToOne(type => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @BeforeInsert()
    createCode(): void {
        this.code = uuidv4();
    }
}