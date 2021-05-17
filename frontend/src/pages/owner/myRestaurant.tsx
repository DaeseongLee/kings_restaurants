import { gql, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Dish from '../../components/dish';
import { HelmetContainer } from '../../components/helmet';
import Review from '../../components/review';
import { DISH_FRAGMENT, FULL_ORDER_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT, REVIEWS_FRAGMENT } from '../../fragments';
import { myRestaurant, myRestaurantVariables } from '../../__generated__/myRestaurant';
import { pendingOrders } from '../../__generated__/pendingOrders';
import { useMe } from '../../hooks/useMe';

export const MY_RESTAURANT_QUERY = gql`
    query myRestaurant($input: MyRestaurantInput!){
        myRestaurant(input: $input) {
            ok
            error
            restaurant{
                ...RestaurantParts
                menu{
                    ...DishParts
                }
                orders {
                    ...OrderParts
                }
                reviews{
                    ...ReviewsParts
                }
                reviewTotal
            }

        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
    ${ORDERS_FRAGMENT}
    ${REVIEWS_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
    subscription pendingOrders {
        pendingOrders {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
    id: string;
}

const MyRestaurant = () => {
    const { data: me } = useMe();
    const { id } = useParams<IParams>();
    const history = useHistory();
    const { data } = useQuery<myRestaurant, myRestaurantVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +id,
            }
        }
    });

    const { data: subscriptionData } = useSubscription<pendingOrders>(PENDING_ORDERS_SUBSCRIPTION);
    useEffect(() => {
        if (subscriptionData?.pendingOrders.id) {
            history.push(`/order/${subscriptionData.pendingOrders.id}`);
        }
    }, [subscriptionData]);
    console.log(subscriptionData);
    return (
        <div>
            <HelmetContainer title={data?.myRestaurant.restaurant?.name || "Loading..."} />
            <div className="bg-gray-700 py-28 bg-center bg-cover"
                style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }}
            ></div>
            <div className="container mt-10 ">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link to={`/restaurant/${id}/add-dish`} className="mr-3 text-white bg-gray-800 py-3 px-10">
                    Add Dish &rarr;
                </Link>
                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu.length === 0 ? (
                        <h4 className="text-xl mb-5"> Please upload a dish!</h4>
                    ) : (
                        <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                            {data?.myRestaurant.restaurant?.menu.map(dish => (
                                <Dish key={dish.id} name={dish.name}
                                    description={dish.description}
                                    price={dish.price}
                                    options={dish.options} />
                            ))}
                        </div>
                    )}
                </div>
                {data?.myRestaurant.restaurant?.reviews.length !== 0 &&
                    <div className="w-full mt-16 border-t-2 flex flex-col">
                        <div className="ml-4">
                            <span className="mt-4">Review {data?.myRestaurant.restaurant?.reviews.length}개</span>
                            <span className="ml-5">평점: {data?.myRestaurant.restaurant?.reviewTotal}/ 5 </span>
                        </div>
                        {data?.myRestaurant.restaurant?.reviews?.map(review => (
                            <Review key={review.id}
                                id={review.id}
                                comment={review.comment}
                                star={review.star}
                                updatedAt={review.updatedAt}
                                reviewer={review.reviewer?.email}
                                loginUser={me?.me.email}
                            />
                        ))
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default MyRestaurant;