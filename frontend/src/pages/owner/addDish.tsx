import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory, useParams } from 'react-router';
import { MY_RESTAURANT_QUERY } from './myRestaurant';
import { useForm } from 'react-hook-form';
import { createDish, createDishVariables } from '../../__generated__/createDish';
import { HelmetContainer } from '../../components/helmet';
import Button from '../../components/button';

const CREATE_DISH_MUTATION = gql`
    mutation createDish($input: CreateDishInput!) {
        createDish(input: $input) {
            ok
            error
        }
    }
`;

interface IForm {
    name: string;
    price: string;
    description: string;
    [key: string]: string;
}
interface IParams {
    restaurantId: string;
}
const AddDish = () => {
    const { restaurantId } = useParams<IParams>();
    const history = useHistory();
    const [createDishMutation, { loading, error }] = useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION, {
        refetchQueries: [
            {
                query: MY_RESTAURANT_QUERY,
                variables: {
                    input: {
                        id: +restaurantId
                    },
                },
            },
        ],
    });
    const { register, handleSubmit, formState, getValues, setValue } = useForm<IForm>();

    const onSubmit = () => {
        const { name, price, description, ...rest } = getValues();
        const optionObjects = optionsNumber.map(theId => ({
            name: rest[`${theId}-optionName`],
            extra: +rest[`${theId}-optionExtra`],
        }));

        createDishMutation({
            variables: {
                input: {
                    name,
                    price: +price,
                    description,
                    restaurantId: +restaurantId,
                    options: optionObjects,
                },
            },
        });
        history.goBack();
    };
    const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
    const onAddOptionClick = () => {
        setOptionsNumber((current) => [Date.now(), ...current]);
    };
    const onDeleteClick = (idToDelete: number) => {
        setOptionsNumber(current => current.filter(id => id !== idToDelete));
        setValue(`${idToDelete}-optionName`, "");
        setValue(`${idToDelete}-optionExtra`, "");
    }
    console.log(loading);
    return (
        <div className="container flex flex-col items-center mt-52">
            <HelmetContainer title={"Add Dish"} />
            <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
            <form onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
                <input {...register("name", { required: "Name is required.", minLength: 5 })}
                    className="input" type="text" name="name" placeholder="Name" />
                <input {...register("price", { required: "Price is required." })}
                    className="input" type="number" name="price" placeholder="Price" min={0} />
                <input {...register("description", { required: "Description is required.", minLength: 5 })} className="input" type="text"
                    name="description" placeholder="Description" />
                <div className="my-10">
                    <h4 className="font-medium mb-3 text-lg">Dish Option</h4>
                    <span onClick={onAddOptionClick} className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-">Add Dish Option</span>
                    {optionsNumber.length !== 0 &&
                        optionsNumber.map((id) => (
                            <div key={id} className="mt-5">
                                <input {...register(`${id}-optionName`)} name={`${id}-optionName`}
                                    className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                                    type="text"
                                    placeholder="Option Name" />
                                <input {...register(`${id}-optionExtra`)} name={`${id}-optionExtra`}
                                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                                    type="number"
                                    min={0}
                                    placeholder="Option Extra" />
                                <span className="cursor-pointer text-white bg-red-500 py-3 px-4 mt-5 ml-2"
                                    onClick={() => onDeleteClick(id)}>Delete Option</span>
                            </div>
                        ))}
                </div>
                <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
            </form>
        </div>
    );
};

export default AddDish;