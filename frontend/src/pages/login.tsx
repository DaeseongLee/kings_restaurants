import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import logo from "../images/cooking.png";

export const LOGIN_MUTATION = gql`
    mutation loginMutation($loginInput: LoginInput!) {
        login(input: $loginInput){
            ok
            token
            error
        }
    }
`;

interface ILoginFrom {
    email: string;
    password: string;
    resultError?: string;
}

export const Login = () => {
    const { register, getValues, formState: { errors }, handleSubmit } = useForm<ILoginFrom>({
        mode: "onChange",
    });
    const [loginMutation, { data, loading }] = useMutation(LOGIN_MUTATION)
    const onSubmit = () => {
        const email = "hsl5539@gmail.com", password = "1234";
        loginMutation({
            variables: {
                email,
                password,
            }
        })
    }
    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Login | Nuber Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src={logo} className="w-52 mb-10" alt="restaurants" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">
                    Welcome
                </h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
                    <input type="email" name="email" required placeholder="Email"
                        className="input" />
                    <input type="password" name="password" required placeholder="Password" className="input" />
                    <button>Log In</button>
                </form>
                <div>
                    New to Account?{" "}
                    <Link to="/create-account" className="text-purple-400 hover:underline hover:text-purple-600">
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    )
};

