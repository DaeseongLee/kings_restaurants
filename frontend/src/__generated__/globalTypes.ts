/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum OrderStatus {
  Cooked = "Cooked",
  Cooking = "Cooking",
  Delivered = "Delivered",
  Pending = "Pending",
  PickedUp = "PickedUp",
}

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

export interface CreateDishInput {
  name: string;
  price: number;
  description: string;
  options?: DishOptionInputType[] | null;
  restaurantId: number;
}

export interface CreateOrderInput {
  restaurantId: number;
  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  dishId: number;
  options?: OrderItemOptionInputType[] | null;
}

export interface CreateRestaurantInput {
  name: string;
  address: string;
  coverImg?: string | null;
  categoryName: string;
}

export interface CreateReviewInput {
  restaurantId: number;
  star: number;
  comment: string;
}

export interface DeleteReviewInput {
  reviewId: number;
}

export interface DishChoiceInputType {
  name: string;
  extra?: number | null;
}

export interface DishOptionInputType {
  name: string;
  choiced?: DishChoiceInputType[] | null;
  extra?: number | null;
}

export interface EditOrderInput {
  id: number;
  orderStatus?: OrderStatus | null;
}

export interface EditProfileInput {
  password?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface EditReviewInput {
  star: number;
  comment: string;
  reviewId: number;
}

export interface GetOrderInput {
  id: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MyRestaurantInput {
  id: number;
}

export interface OrderItemOptionInputType {
  name: string;
  choice?: string | null;
}

export interface OrderUpdateInput {
  id: number;
}

export interface RestaurantInput {
  restaurantId: number;
}

export interface RestaurantsInput {
  page?: number | null;
}

export interface ReviewsInput {
  restaurantId: number;
}

export interface SearchRestaurantInput {
  page?: number | null;
  query: string;
}

export interface TakeOrderInput {
  id: number;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
