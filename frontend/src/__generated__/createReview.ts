/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateReviewInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createReview
// ====================================================

export interface createReview_createReview {
  __typename: "CreateReviewOutput";
  ok: boolean;
  error: string | null;
}

export interface createReview {
  createReview: createReview_createReview;
}

export interface createReviewVariables {
  input: CreateReviewInput;
}
