/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: pendingOrders
// ====================================================

export interface pendingOrders_pendingOrders_driver {
  __typename: "User";
  email: string;
}

export interface pendingOrders_pendingOrders_customer {
  __typename: "User";
  email: string;
}

export interface pendingOrders_pendingOrders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface pendingOrders_pendingOrders {
  __typename: "Order";
  id: number;
  orderStatus: OrderStatus;
  totalPrice: number | null;
  driver: pendingOrders_pendingOrders_driver | null;
  customer: pendingOrders_pendingOrders_customer | null;
  restaurant: pendingOrders_pendingOrders_restaurant;
}

export interface pendingOrders {
  pendingOrders: pendingOrders_pendingOrders;
}
