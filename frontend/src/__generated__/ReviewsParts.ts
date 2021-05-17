/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ReviewsParts
// ====================================================

export interface ReviewsParts_reviewer {
  __typename: "User";
  email: string;
}

export interface ReviewsParts {
  __typename: "Review";
  id: number;
  updatedAt: any;
  comment: string;
  star: number;
  reviewer: ReviewsParts_reviewer | null;
}
