import React, { useCallback, useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { useHistory, useLocation } from 'react-router';
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';
import { useForm } from 'react-hook-form';
import { IFormProps } from './restaurants';
import { HelmetContainer } from '../../components/helmet';
import Restaurant from '../../components/restaurant';
import Page from '../../components/page';

const SEARCH_RESTAURANT = gql`
    query searchRestaurant($input: SearchRestaurantInput!) {
        searchRestaurant(input: $input) {
            ok
            error
            totalPages
            totalResults
            restaurants {
                 ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`

const Search = () => {
    const [page, setPage] = useState(1);
    const location = useLocation();

    const history = useHistory();
    const [callQuery, { loading, data, called }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(SEARCH_RESTAURANT);
    const { register, getValues, handleSubmit } = useForm<IFormProps>();

    useEffect(() => {
        const [_, query] = location.search.split("?term=");
        if (!query) {
            return history.replace("/");
        }

        callQuery({
            variables: {
                input: {
                    page,
                    query,
                }
            }
        });
    }, [location, page]);

    const onSearchSubmit = () => {
        const { searchTerm } = getValues();
        history.push({
            pathname: "/search",
            search: `?term=${searchTerm}`,
        })
    };
    const onNextPageClick = useCallback(() => setPage(current => current + 1), []);
    const onPrevPageClick = useCallback(() => setPage(current => current - 1), []);
    return (
        <div>
            <HelmetContainer title={"Search"} />
            <form onSubmit={handleSubmit(onSearchSubmit)} className="bg-gray-800 w-full py-40 flex items-center justify-center" >
                <input
                    {...register("searchTerm")}
                    name="searchTerm"
                    type="Search"
                    className="input rounded-md border-0 w-3/4 md:w-3/12"
                    placeholder="Search Restaurants..."
                />
            </form>
            {!loading && (
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="grid mt-16 lg:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.searchRestaurant.restaurants?.map(restaurant => (
                            <Restaurant
                                key={restaurant.id}
                                id={restaurant.id + ""}
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
                                categoryName={restaurant.category?.name}
                            />
                        ))}
                    </div>
                    {data?.searchRestaurant?.totalPages !== 0 &&
                        <Page page={page} totalPage={data?.searchRestaurant.totalPages}
                            onNextPageClick={onNextPageClick} onPrevPageClick={onPrevPageClick} />
                    }
                </div>
            )}
        </div>
    )
};

export default Search;