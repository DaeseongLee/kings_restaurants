import { gql } from '@apollo/client';

export const RESTAURANT_FRAGMENT = gql`
    fragment RestaurantParts on Restaurant {
        id
        name
        coverImg
        category{
            name
        }
        address
    }
`;

export const CATEGORY_FRAGMENT = gql`
    fragment CategoryParts on Category {
        id
        name
        coverImg
        slug
        restaurantCount
    }
`;

export const DISH_FRAGMENT = gql`
    fragment DishParts on Dish {
        id
        name
        price
        photo
        description
        options {
            name
            extra
            choiced {
                name
                extra
            }
        }
    }
`;

export const ORDERS_FRAGMENT = gql`
    fragment OrderParts on Order {
        id
        createdAt
        totalPrice
    }
`;

export const FULL_ORDER_FRAGMENT = gql`
    fragment FullOrderParts on Order {
        id
        orderStatus
        totalPrice
        driver {
            email
        }
        customer{
            email
        }
         restaurant {
            name
        }
    }
`;
export const REVIEWS_FRAGMENT = gql`
    fragment ReviewsParts on Review {
        id
        updatedAt
        comment
        star
        reviewer{
            email
        }
    }
`;