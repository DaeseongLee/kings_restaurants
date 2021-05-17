/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MyRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: myRestaurant
// ====================================================

export interface myRestaurant_myRestaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurant_myRestaurant_restaurant_menu_options_choiced {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface myRestaurant_myRestaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choiced: myRestaurant_myRestaurant_restaurant_menu_options_choiced[] | null;
}

export interface myRestaurant_myRestaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: myRestaurant_myRestaurant_restaurant_menu_options[];
}

export interface myRestaurant_myRestaurant_restaurant_orders {
  __typename: "Order";
  id: number;
  createdAt: any;
  totalPrice: number | null;
}

export interface myRestaurant_myRestaurant_restaurant_reviews_reviewer {
  __typename: "User";
  email: string;
}

export interface myRestaurant_myRestaurant_restaurant_reviews {
  __typename: "Review";
  id: number;
  updatedAt: any;
  comment: string;
  star: number;
  reviewer: myRestaurant_myRestaurant_restaurant_reviews_reviewer | null;
}

export interface myRestaurant_myRestaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string | null;
  category: myRestaurant_myRestaurant_restaurant_category | null;
  address: string;
  menu: myRestaurant_myRestaurant_restaurant_menu[];
  orders: myRestaurant_myRestaurant_restaurant_orders[];
  reviews: myRestaurant_myRestaurant_restaurant_reviews[];
  reviewTotal: number | null;
}

export interface myRestaurant_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: myRestaurant_myRestaurant_restaurant | null;
}

export interface myRestaurant {
  myRestaurant: myRestaurant_myRestaurant;
}

export interface myRestaurantVariables {
  input: MyRestaurantInput;
}
