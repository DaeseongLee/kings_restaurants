/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReviewsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: reviews
// ====================================================

export interface reviews_reviews_reviews_reviewer {
  __typename: "User";
  email: string;
}

export interface reviews_reviews_reviews {
  __typename: "Review";
  id: number;
  updatedAt: any;
  comment: string;
  star: number;
  reviewer: reviews_reviews_reviews_reviewer | null;
}

export interface reviews_reviews {
  __typename: "ReviewsOutput";
  ok: boolean;
  error: string | null;
  reviews: reviews_reviews_reviews[] | null;
  reviewTotal: number | null;
}

export interface reviews {
  reviews: reviews_reviews;
}

export interface reviewsVariables {
  input: ReviewsInput;
}
