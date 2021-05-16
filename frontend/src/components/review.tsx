import React, { useState } from 'react';
import StarRatingComponent from 'react-star-rating-component';

import moment from "moment";
interface IProps {
    star: number;
    comment: string;
    updatedAt: Date;
    reviewer: string | undefined;
    loginUser: string | undefined;
}

const Review: React.FC<IProps> = ({
    star,
    comment,
    updatedAt,
    reviewer,
    loginUser
}) => {

    const [rating, setRating] = useState({ rating: 1 });
    const onStarClick = (nextValue: number, prevValue: number, name: string) => {
        setRating({ rating: nextValue });
    }
    console.log(updatedAt)
    return (
        <div>
            <div className="mt-5 ml-4">
                <StarRatingComponent
                    name="rate1"
                    starCount={5}
                    value={star}
                // onStarClick={onStarClick}
                />
                <div className="flex flex-col">
                    <div className="text-xs">
                        <span>{reviewer}</span>{"  "}
                        <span className="ml-3 text-sm text-gray-500">{moment(new Date(updatedAt), "YYYYMMDD").fromNow()}</span>
                    </div>
                    <p className="text-lg font-bold">{comment}</p>
                </div>

                {reviewer === loginUser && (
                    <div>
                        <button className="px-5 mr-3 border-2 border-black hover:bg-gray-400">
                            수정
                    </button>
                        <button className="px-5 border-2 border-black hover:bg-gray-400">
                            삭제
                    </button>
                    </div>
                )}
            </div>
        </div>

    )
};

export default Review;