import React from 'react';

interface IProps {
    page: number;
    totalPage?: number | null;
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}
const Page: React.FC<IProps> = ({ page, totalPage, onPrevPageClick, onNextPageClick }) => {
    const handlePrevPageClick = () => {
        onPrevPageClick();
    }
    const handleNextPageClick = () => {
        onNextPageClick();
    };
    return (
        <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
                <button
                    onClick={handlePrevPageClick}
                    className="focus:outline-none font-medium text-2xl"
                >
                    &larr;
                </button>
            ) : (<div></div>)}
            <span>
                Page {page} of {totalPage}
            </span>
            {page !== totalPage ? (
                <button
                    onClick={handleNextPageClick}
                    className="focus:outline-none font-medium text-2xl"
                >
                    &rarr;
                </button>
            ) : (<div></div>)}
        </div>
    )
};

export default Page;