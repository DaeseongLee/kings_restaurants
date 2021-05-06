import { InternalServerErrorException } from "@nestjs/common";
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
export enum UserRole {
    Owner = "Owner",
    Client = "Client",
    Delievery = "Delievery",
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsEmail()
    email: string;

    @Field(type => String)
    @Column({ select: false })
    @IsString()
    password: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    phone: String;

    @Field(type => UserRole)
    @Column()
    @IsEnum(UserRole)
    role: UserRole;

    @Field(type => Boolean, { defaultValue: false })
    @Column({ default: false })
    @IsBoolean()
    verified: boolean;

    @Field(type => [Restaurant])
    @OneToMany(
        type => Restaurant,
        restaurant => restaurant.owner,
    )
    restaurants: Restaurant[];

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (error) {
                console.error(error);
                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException();
        }
    }

}