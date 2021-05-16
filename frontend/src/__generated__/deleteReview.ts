/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteReviewInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteReview
// ====================================================

export interface deleteReview_deleteReview {
  __typename: "DeleteReviewOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteReview {
  deleteReview: deleteReview_deleteReview;
}

export interface deleteReviewVariables {
  input: DeleteReviewInput;
}
