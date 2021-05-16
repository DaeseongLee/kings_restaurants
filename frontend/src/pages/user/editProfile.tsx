import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/button';
import { HelmetContainer } from '../../components/helmet';
import { useMe } from '../../hooks/useMe';
import { editProfile, editProfileVariables } from '../../__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($input: EditProfileInput!){
        editProfile(input: $input) {
            ok
            error
        }
    }
`;
interface IFormProps {
    address?: string;
    phone?: string;
    password?: string;
};


const EditProfile = () => {
    const { data: userData } = useMe();
    const client = useApolloClient();
    const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
        mode: "onChange",
        defaultValues: {
            phone: userData?.me.phone,
            address: userData?.me.address,
        }
    });

    const onCompleted = (data: editProfile) => {
        const {
            editProfile: { ok },
        } = data;
        if (ok && userData) {
            const {
                me: { address: prevAddress, phone: prevPhone, id }
            } = userData;
            const { address: newAddress, phone: newPhone } = getValues();
            if (prevAddress !== newAddress || prevPhone !== newPhone) {
                client.writeFragment({
                    id: `User:${id}`,
                    fragment: gql`
                        fragment EditedUser on User {
                            address
                            phone
                        }
                    `,
                    data: {
                        address: newAddress,
                        phone: newPhone,
                    },
                });
            };
        };
    };
    const [editProfile, { loading }] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
        onCompleted
    });
    const onSubmit = () => {
        const { address, phone, password } = getValues();
        editProfile({
            variables: {
                input: {
                    address,
                    phone,
                    ...(password !== "" && { password }),
                }
            }
        })
    };
    return (
        <div className="mt-52 flex flex-col justify-center items-center">
            <HelmetContainer title={"Edit Profile"} />
            <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
                <input  {...register("address")}
                    className="input" type="text" name="address" placeholder="Address"
                />
                <input  {...register("phone")}
                    className="input" type="text" name="phone" placeholder="Phone"
                />
                <input {...register("password")} className="input" type="password" name="password" placeholder="Password" />
                <Button loading={loading} canClick={formState.isValid} actionText="Save Profile" />
            </form>
        </div>
    )
};

export default EditProfile;