import React, { useState } from 'react';
import StarRatingComponent from 'react-star-rating-component';

import moment from "moment";
import { useForm } from 'react-hook-form';
interface IProps {
    id: number;
    star: number;
    comment: string;
    updatedAt: Date;
    reviewer: string | undefined;
    loginUser: string | undefined;
    editReviewBtnClick?: (id: number, comment: string, star: number) => void;
    deleteReviewBtnClick?: (id: number) => void;
}

const Review: React.FC<IProps> = ({
    id,
    star,
    comment,
    updatedAt,
    reviewer,
    loginUser,
    editReviewBtnClick,
    deleteReviewBtnClick
}) => {
    const [isUpdated, setIsUpdated] = useState(false);
    const { getValues, handleSubmit, register, setValue } = useForm({
        mode: 'onChange',
    });
    const [rating, setRating] = useState({ rating: star });
    const onStarClick = (nextValue: number, prevValue: number, name: string) => {
        setRating({ rating: nextValue });
    }

    const updateReview = () => {
        setValue('comment', comment)
        setIsUpdated(true);
    }

    const deleteReview = () => {
        deleteReviewBtnClick && deleteReviewBtnClick(id);
    }

    const onsubmit = () => {
        setIsUpdated(false);
        const { comment } = getValues();
        editReviewBtnClick && editReviewBtnClick(id, comment, rating.rating);
    }
    return (
        <div>
            <div className="mt-5 ml-4">
                {!isUpdated &&
                    <>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={star}
                        />
                        <div className="flex flex-col">
                            <div className="text-xs">
                                <span>{reviewer}</span>{"  "}
                                <span className="ml-3 text-sm text-gray-500">{moment(new Date(updatedAt), "YYYYMMDD").fromNow()}</span>
                            </div>
                            <p className="text-lg font-bold">{comment}</p>
                        </div>
                        {reviewer === loginUser && (
                            <div className="mt-2">
                                <button onClick={updateReview} className="px-5 mr-3 border-2 border-black hover:bg-gray-400">
                                    수정
                                </button>
                                <button onClick={deleteReview} className="px-5 border-2 border-black hover:bg-gray-400">
                                    삭제
                                </button>
                            </div>
                        )}
                    </>
                }
                {isUpdated &&
                    <>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={rating.rating}
                            onStarClick={onStarClick}
                        />
                        <div className="w-full ml-4 border-2 border-gray-100">
                            <form onSubmit={handleSubmit(onsubmit)}  >
                                <input
                                    {...register("comment")}
                                    name="comment"
                                    type="text"
                                    placeholder="comment"
                                    className="input rounded-md border-0 w-full "
                                />
                            </form>
                        </div>
                        <div className="mt-2">
                            <button onClick={onsubmit} className="px-5 mr-3 border-2 border-black hover:bg-gray-400">
                                수정완료
                            </button>
                            <button onClick={() => { setIsUpdated(false) }} className="px-5 border-2 border-black hover:bg-gray-400">
                                수정취소
                            </button>
                        </div>
                    </>
                }
            </div>
        </div>

    )
};

export default Review;