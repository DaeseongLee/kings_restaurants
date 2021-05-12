import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { HelmetContainer } from '../components/helmet';
import { UserRole } from '../__generated__/globalTypes';
import logo from "../images/cooking.png";
import { FormError } from '../components/form-error';
import Button from '../components/button';
import { Link, useHistory } from 'react-router-dom';
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation';

export const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccountMutation($input: CreateAccountInput!) {
        createAccount(input: $input) {
            ok
            error
        }
    }
`
interface ICreateAccountForm {
    email: string;
    password: string;
    address: string;
    phone: string;
    role: UserRole;
}

export const CreateAccount = () => {
    const { register, getValues, handleSubmit, formState: { errors, isValid } } = useForm<ICreateAccountForm>({
        mode: "onChange",
        defaultValues: {
            role: UserRole.Client,
        }
    });
    const history = useHistory()
    const onCompleted = (data: createAccountMutation) => {
        const { createAccount: { ok } } = data;
        if (ok) {
            alert("Account Created! Log in Now");
            history.push('/');
        }
    }
    const [createAccountMutation, { data: createAccountMutationResult, loading }] =
        useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
            onCompleted
        })
    const onSbumit = () => {
        if (!loading) {
            const { email, password, address, phone, role } = getValues();
            createAccountMutation({
                variables: {
                    input: {
                        email,
                        password,
                        address,
                        phone,
                        role,
                    }
                }
            });
        }
    };
    return (
        <div className="formContainer">
            <HelmetContainer title={'Create Account'} />
            <div className="inputContainer">
                <img src={logo} className="w-52 mb-10" alt="restaurants" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">
                    Welcome
                </h4>
                <form onSubmit={handleSubmit(onSbumit)}
                    className="form"
                >
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        })}
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input"
                    />
                    {errors.email?.message && (<FormError errorMessage={errors.email?.message} />)}
                    {errors.email?.type === "pattern" && (<FormError errorMessage={"Please enter a valid email"} />)}

                    <input
                        {...register("password", {
                            required: "Password is required",
                        })}
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="input"
                    />
                    {errors.password?.message && (<FormError errorMessage={errors.password?.message} />)}

                    <input
                        {...register("address", {
                            required: "Address is required",
                        })}
                        name="address"
                        type="address"
                        placeholder="Address"
                        className="input"
                    />
                    {errors.address?.message && (<FormError errorMessage={errors.address?.message} />)}

                    <input
                        {...register("phone", {
                            required: "Phone is required",
                        })}
                        name="phone"
                        type="phone"
                        placeholder="Phone"
                        className="input"
                    />
                    {errors.phone?.message && (<FormError errorMessage={errors.phone?.message} />)}
                    <select {...register("role")}
                        name="role"
                        className="input"
                    >
                        {Object.keys(UserRole).map((role, index) => (
                            <option key={index}>{role}</option>
                        ))}
                    </select>
                    <Button canClick={isValid} loading={loading} actionText={"Create Account"} />
                </form>
                {createAccountMutationResult?.createAccount.error && (<FormError errorMessage={createAccountMutationResult?.createAccount.error} />)}
                <div className="mb-9 mt-3">
                    Already have an account?{" "}
                    <Link to="/" className="text-purple-400 hover:underline hover:text-purple-600">
                        Log In now
                    </Link>
                </div>
            </div>
        </div>

    )
};

