import { gql, useQuery } from '@apollo/client';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { HelmetContainer } from '../../components/helmet';
import Page from '../../components/page';
import Restaurant from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';

const CATEGORY_QUERY = gql`
    query category($input: CategoryInput!) {
        category(input: $input) {
            ok
            error
            totalPages
            totalResults
            restaurants {
                ...RestaurantParts
            }
            category{
                ...CategoryParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`
interface ICategoryParams {
    slug: string;
}
const Category = () => {
    const [page, setPage] = useState(1);
    const params = useParams<ICategoryParams>();

    const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page,
                slug: params.slug,
            }
        }
    })
    const onNextPageClick = useCallback(() => { setPage(curr => curr + 1) }, []);
    const onPrevPageClick = useCallback(() => { setPage(curr => curr - 1) }, []);
    return (
        <div>
            <HelmetContainer title={"Category"} />
            {!loading && (
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="grid mt-16 lg:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.category?.restaurants?.map(restaurant => (
                            <Restaurant
                                key={restaurant.id}
                                id={restaurant.id + ""}
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
                                categoryName={restaurant.category?.name}
                            />
                        ))}
                    </div>
                    {data?.category?.totalPages !== 0 &&
                        <Page page={page} totalPage={data?.category?.totalPages}
                            onNextPageClick={onNextPageClick} onPrevPageClick={onPrevPageClick} />
                    }
                </div>
            )}
        </div>
    )
};

export default Category;