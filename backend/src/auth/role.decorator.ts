import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/user/entities/user.entity";


export type AllowedRoles = keyof typeof UserRole | 'Any';

export const Role = (role: AllowedRoles[]) => SetMetadata('roles', role);