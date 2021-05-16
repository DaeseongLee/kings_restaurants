/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditReviewInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editReview
// ====================================================

export interface editReview_editReview {
  __typename: "EditReviewOutput";
  ok: boolean;
  error: string | null;
}

export interface editReview {
  editReview: editReview_editReview;
}

export interface editReviewVariables {
  input: EditReviewInput;
}
