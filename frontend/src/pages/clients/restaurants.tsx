import { gql } from '@apollo/client';
import React, { useState } from 'react';

const RESTAURANT_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!){
        allCategories {
            ok
            error
            categories {
                ...CategoryParts
            }
        }
        restaurants(input: $input){
            ok
            error
            totalPages
            totalResults
            results {
                ...RestaurantParts
            }
        }
    }
`


export const Restaurants = () => {
    const [page, setPage] = useState(1);

    return (
        <h1></h1>
    )
};

