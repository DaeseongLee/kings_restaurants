/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserRole {
  Client = "Client",
  Delievery = "Delievery",
  Owner = "Owner",
}

export interface CategoryInput {
  page?: number | null;
  slug: string;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  address: string;
  phone: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RestaurantsInput {
  page?: number | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
