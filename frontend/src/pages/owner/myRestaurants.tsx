import { gql, useApolloClient, useQuery } from '@apollo/client';
import React from 'react';
import { Link } from 'react-router-dom';
import { HelmetContainer } from '../../components/helmet';
import Restaurant from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurants } from '../../__generated__/myRestaurants';
export const MY_RESTAURANTS_QUERY = gql`
    query myRestaurants {
        myRestaurants {
            ok
            error
            restaurants {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`

const MyRestaurants = () => {
    const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);

    return (
        <div>
            <HelmetContainer title={"My Restaurants"} />
            <div className="max-w-screen-2xl mx-auto mt-32">
                <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
                {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
                    <>
                        <h4 className="text-xl mb-5">You have no restaurants.</h4>
                        <Link className="text-purple-600 hover:underline" to="/add-restaurant">
                            Create one &rarr;
                        </Link>
                    </>
                ) : (
                    <div className="grid mt-16 lg:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.myRestaurants.restaurants?.map(restaurant => (
                            <Restaurant
                                key={restaurant.id}
                                id={restaurant.id + ""}
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
                                categoryName={restaurant.category?.name}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRestaurants;