import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT, REVIEWS_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import { createOrder, createOrderVariables } from '../../__generated__/createOrder';
import { HelmetContainer } from '../../components/helmet';
import Dish from '../../components/dish';
import DishOption from '../../components/dishOptionst';
import Review from '../../components/review';
import StarRatingComponent from 'react-star-rating-component';
import { useForm } from 'react-hook-form';
import { useMe } from '../../hooks/useMe';
import { createReview, createReviewVariables } from '../../__generated__/createReview';
import { reviews, reviewsVariables } from '../../__generated__/reviews';
import { editReview, editReviewVariables } from '../../__generated__/editReview';
import { deleteReview, deleteReviewVariables } from '../../__generated__/deleteReview';

const RESTAURANT_QUERY = gql`
    query restaurant($input: RestaurantInput!) {
        restaurant(input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu{
                    ...DishParts
                }
                
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
`;

const REVIEWS_QUERY = gql`
 query reviews($input: ReviewsInput!) {
      reviews(input: $input) {
            ok
            error
            reviews {
               ...ReviewsParts
            }
            reviewTotal
        }
    }
    ${REVIEWS_FRAGMENT}
`

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($input: CreateOrderInput!) {
        createOrder(input: $input){
            ok
            error
            orderId
        }
    }
`;

const CREATE_REVIEW_MUTATION = gql`
    mutation createReview($input: CreateReviewInput!) {
        createReview(input: $input) {
            ok
            error
        }
    }
`

const EDIT_REVIEW_MUTATION = gql`
    mutation editReview($input: EditReviewInput!) {
        editReview(input: $input) {
            ok
            error
        }
    }
`;
const DELETE_REVIEW_MUTATION = gql`
    mutation deleteReview($input: DeleteReviewInput!) {
        deleteReview(input: $input) {
            ok
            error
        }
    }
`;

interface IRestaurantParams {
    id: string;
}

interface IForm {
    comment: string;
}

const RestaurantDetail = () => {
    const [orderStarted, setOrderStarted] = useState(false);
    const [orderItem, setOrderItem] = useState<CreateOrderItemInput[]>([]);


    const history = useHistory();
    const me = useMe();

    const params = useParams<IRestaurantParams>();
    const { register, handleSubmit, getValues, setValue } = useForm<IForm>({
        mode: 'onChange',
    });

    const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
        variables: {
            input: {
                restaurantId: +params.id,
            }
        }
    });

    const { data: reviewData } = useQuery<reviews, reviewsVariables>(REVIEWS_QUERY, {
        variables: {
            input: {
                restaurantId: +params.id,
            }
        }
    });


    const triggerStartOrder = () => {
        setOrderStarted(true);
    }
    const getItem = (dishId: number) => {
        return orderItem.find(order => order.dishId === dishId);
    };
    const isSelected = (dishId: number) => {
        return Boolean(getItem(dishId));
    };
    const addItemToOrder = (dishId: number) => {
        if (isSelected(dishId)) {
            return;
        };
        setOrderItem(current => [{ dishId, options: [] }, ...current]);
    };
    const removeFromOrder = (dishId: number) => {
        setOrderItem(current => current.filter(dish => dish.dishId !== dishId));
    }

    const addOptionToItem = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) return;
        const oldItem = getItem(dishId);

        if (oldItem) {
            const hasOption = Boolean(oldItem.options?.find(aOption => aOption.name === optionName))
            if (!hasOption) {
                removeFromOrder(dishId);
                setOrderItem(current => [
                    { dishId, options: [{ name: optionName }, ...oldItem.options!] },
                    ...current,
                ]);
            };
        };
    };

    const removeOptionFromItem = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) return;
        const oldItem = getItem(dishId);
        if (oldItem) {
            removeFromOrder(dishId);
            setOrderItem(current => [
                {
                    dishId,
                    options: oldItem.options?.filter(
                        option => option.name !== optionName
                    ),
                }
            ]);
            return;
        };
    };

    const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
        return item.options?.find(option => option.name === optionName);
    };
    const isOptionSelected = (dishId: number, optionName: string) => {
        const item = getItem(dishId);
        if (item) {
            return Boolean(getOptionFromItem(item, optionName));
        };
        return false;
    };

    const triggerCancelOrder = () => {
        setOrderStarted(false);
        setOrderItem([]);
    };

    const onCompleted = (data: createOrder) => {
        const {
            createOrder: { orderId },
        } = data;
        if (data.createOrder.ok) {
            alert("order created");
            history.push(`/order/${orderId}`);
        }
    };
    const [createOrderMutation, { loading: placingOrder }] = useMutation<createOrder, createOrderVariables>(CREATE_ORDER_MUTATION, {
        onCompleted,
    });
    const triggerConfirmOrder = () => {
        if (placingOrder) return;
        if (orderItem.length === 0) {
            alert("can't place empty order");
            return;
        }
        const ok = window.confirm("You are abuout to place an order");
        if (ok) {
            createOrderMutation({
                variables: {
                    input: {
                        restaurantId: +params.id,
                        items: orderItem,
                    }
                }
            })
        }
    };

    const reviewOnCompleted = (data: createReview) => {
        const { createReview: { ok } } = data;
        setValue('comment', '');
    }
    const refetchQueries = [{
        query: REVIEWS_QUERY,
        variables: {
            input: {
                restaurantId: +params.id,
            }
        }
    }];
    const [createReviewMutation] = useMutation<createReview, createReviewVariables>(CREATE_REVIEW_MUTATION, {
        onCompleted: reviewOnCompleted,
        refetchQueries
    });


    const [editReviewMutation] = useMutation<editReview, editReviewVariables>(EDIT_REVIEW_MUTATION, {
        refetchQueries
    });
    const [deleteReviewMutation] = useMutation<deleteReview, deleteReviewVariables>(DELETE_REVIEW_MUTATION, {
        refetchQueries
    });

    const [rating, setRating] = useState({ rating: 1 });
    const onStarClick = (nextValue: number, prevValue: number, name: string) => {
        setRating({ rating: nextValue });
    };

    const onsubmit = () => {
        const { comment } = getValues();
        if (comment) {
            createReviewMutation({
                variables: {
                    input: {
                        comment,
                        star: rating.rating,
                        restaurantId: +params.id,
                    }
                }
            })
        }
    }

    const editReviewBtnClick = (id: number, comment: string, star: number) => {
        if (comment) {
            editReviewMutation({
                variables: {
                    input: {
                        comment,
                        star,
                        reviewId: id
                    }
                }
            });
        };
    };
    const deleteReviewBtnClick = (id: number) => {
        deleteReviewMutation({
            variables: {
                input: {
                    reviewId: id
                }
            }
        });
    };
    return (
        <div>
            <HelmetContainer title={data?.restaurant?.restaurant?.name || ""} />
            <div className="bg-gray-800 bg-center bg-cover py-48"
                style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}>
                <div className="bg-white xl:w-3/12 py-8 pl-48">
                    <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
                    <h5 className="text-sm font-light mb-2">{data?.restaurant.restaurant?.category?.name}</h5>
                    <h6 className="text-sm font-light">
                        {data?.restaurant.restaurant?.address}
                    </h6>
                </div>
            </div>
            <div className="container pb-32 flex flex-col items-end mt-20">
                {!orderStarted && (
                    <button onClick={triggerStartOrder} className="btn px-10">
                        Start Order
                    </button>
                )}
                {orderStarted && (
                    <div className="flex items-center">
                        <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
                            Confirm Order
                        </button>
                        <button onClick={triggerCancelOrder} className="btn px-10 bg-black hover:bg-black">
                            Cancel Order
                        </button>
                    </div>
                )}
                <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                    {data?.restaurant.restaurant?.menu.map((dish) => (
                        <Dish key={dish.id}
                            isSelected={isSelected(dish.id)}
                            id={dish.id}
                            orderStarted={orderStarted}
                            name={dish.name}
                            description={dish.description}
                            price={dish.price}
                            isCustomer={true}
                            options={dish.options}
                            addItemToOrder={addItemToOrder}
                            removeFromOrder={removeFromOrder}>
                            {dish.options?.map((option, index) => (
                                <DishOption key={index}
                                    dishId={dish.id}
                                    isSelected={isOptionSelected(dish.id, option.name)}
                                    name={option.name}
                                    extra={option.extra}
                                    addOptionToItem={addOptionToItem}
                                    removeOptionFromItem={removeOptionFromItem}
                                />
                            ))}

                        </Dish>
                    ))}
                </div>
                {reviewData?.reviews.reviews?.length &&
                    <div className="w-full mt-16 border-t-2 flex flex-col">
                        <div className="ml-4">
                            <span className="mt-4">Review {reviewData?.reviews.reviews.length}개</span>
                            <span className="ml-5">평점: {reviewData?.reviews.reviewTotal}/ 5 </span>
                        </div>
                        {reviewData?.reviews.reviews?.map(review => (
                            <Review key={review.id}
                                id={review.id}
                                comment={review.comment}
                                star={review.star}
                                updatedAt={review.updatedAt}
                                reviewer={review.reviewer?.email}
                                loginUser={me.data?.me.email}
                                editReviewBtnClick={editReviewBtnClick}
                                deleteReviewBtnClick={deleteReviewBtnClick}

                            />
                        ))
                        }
                    </div>
                }
                <div className="w-full mt-16 border-t-2 flex flex-col  ">
                    <div className="mt-5 ml-4">
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={rating.rating}
                            onStarClick={onStarClick}
                        />
                    </div>
                    <div className="w-full ml-4 border-2 border-gray-100">
                        <form onSubmit={handleSubmit(onsubmit)}  >
                            <input
                                {...register("comment")}
                                name="comment"
                                type="text"
                                placeholder="comment"
                                className="input rounded-md border-0 w-full "
                            />
                            <button className="px-5 mr-3 border-2 border-black hover:bg-gray-400">
                                입력
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default RestaurantDetail;