import React, { useState } from 'react';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant';
import { HelmetContainer } from '../../components/helmet';
import Button from '../../components/button';
import { FormError } from '../../components/form-error';
import { MY_RESTAURANTS_QUERY } from './myRestaurants';

const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant($input: CreateRestaurantInput!) {
        createRestaurant(input: $input) {
            error
            ok
            restaurantId
        }
    }
`;

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
    file: FileList;
}

const AddRestaurants = () => {
    const client = useApolloClient();
    const history = useHistory();
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const { register, getValues, formState: { isValid }, handleSubmit } = useForm<IFormProps>({
        mode: 'onChange',
    });

    const onCompleted = (data: createRestaurant) => {
        const {
            createRestaurant: { ok, restaurantId }
        } = data;
        if (ok) {
            const { name, categoryName, address } = getValues();
            setUploading(false);
            const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
            client.writeQuery({
                query: MY_RESTAURANTS_QUERY,
                data: {
                    myRestaurants: {
                        ...queryResult.myRestaurants,
                        restaurants: [
                            {
                                address,
                                category: {
                                    name: categoryName,
                                    __typename: "Category",
                                },
                                coverImg: imageUrl,
                                id: restaurantId,
                                isPromoted: false,
                                name,
                                __typename: "Restaurant",
                            },
                            ...queryResult.myRestaurants.restaurants,
                        ],
                    },
                },
            });
            history.push("/");
        }
    };
    const [createRestaurantMutation, { data }] = useMutation<createRestaurant, createRestaurantVariables>(CREATE_RESTAURANT_MUTATION, {
        onCompleted
    });
    const onSubmit = async () => {
        try {
            setUploading(true);
            const { file, name, categoryName, address } = getValues();
            const actualFile = file[0];
            const formBody = new FormData();
            formBody.append("file", actualFile);

            const { url: coverImg } = await (
                await fetch(process.env.NODE_ENV === "production"
                    ? 'https://kings-restaurant.herokuapp.com/uploads'
                    : "http://localhost:4500/uploads"
                    , {
                        method: "POST",
                        body: formBody,
                    })
            ).json();
            setImageUrl(coverImg);
            createRestaurantMutation({
                variables: {
                    input: {
                        name,
                        categoryName,
                        address,
                        coverImg
                    }
                }
            });
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <div className="container flex flex-col items-center mt-52">
            <HelmetContainer title={"Add Restaurant"} />
            <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
                <input {...register("name", { required: "Name is required." })}
                    name="name" className="input" type="text" placeholder="Name" />
                <input {...register("address", { required: "Address is required." })}
                    name="address" className="input" type="text" placeholder="Address" />
                <input {...register("categoryName", { required: "Category Name is required." })}
                    name="categoryName" className="input" type="text" placeholder="Category Name" />
                <div>
                    <input {...register("file", { required: true })}
                        name="file" className="input" accept="image/*" type="file" placeholder="File" />
                </div>
                <Button loading={uploading} canClick={isValid} actionText="Create Restaurant" />
                {data?.createRestaurant?.error && (
                    <FormError errorMessage={data.createRestaurant.error} />
                )}
            </form>
        </div>
    );
};

export default AddRestaurants;