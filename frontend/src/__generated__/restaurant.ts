/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurant
// ====================================================

export interface restaurant_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface restaurant_restaurant_restaurant_menu_options_choiced {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface restaurant_restaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choiced: restaurant_restaurant_restaurant_menu_options_choiced[] | null;
}

export interface restaurant_restaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: restaurant_restaurant_restaurant_menu_options[];
}

export interface restaurant_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string | null;
  category: restaurant_restaurant_restaurant_category | null;
  address: string;
  menu: restaurant_restaurant_restaurant_menu[];
}

export interface restaurant_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: restaurant_restaurant_restaurant | null;
}

export interface restaurant {
  restaurant: restaurant_restaurant;
}

export interface restaurantVariables {
  input: RestaurantInput;
}
