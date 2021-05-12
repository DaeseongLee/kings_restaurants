import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import Button from '../components/button';
import { FormError } from '../components/form-error';
import { HelmetContainer } from '../components/helmet';
import { LOCAL_STORAGE_TOKEN } from '../constant';
import logo from "../images/cooking.png";
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';

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
    const { register, getValues, formState: { errors, isValid }, handleSubmit } = useForm<ILoginFrom>({
        mode: "onChange",
    });
    const onCompleted = (data: loginMutation) => {
        let { login: { ok, token } } = data;


        if (ok && token) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
            isLoggedInVar(true);
            authTokenVar(token);
        }
    }
    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
        onCompleted,
    });


    const onSubmit = () => {
        if (!loading) {
            const { email, password } = getValues();
            loginMutation({
                variables: {
                    loginInput: {
                        email,
                        password,
                    },
                }
            })
        }
    };
    return (
        <div className="formContainer">
            <HelmetContainer title={'Login'} />
            <div className="inputContainer">
                <img src={logo} className="w-52 mb-10" alt="restaurants" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">
                    Welcome
                </h4>
                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <input {...register("email", {
                        required: "Email is required",
                        pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                        type="email" name="email" required placeholder="Email" className="input" />
                    {errors.email?.message && (<FormError errorMessage={errors.email?.message} />)}
                    {errors.email?.type === 'pattern' && (<FormError errorMessage={"Please enter a valid email"} />)}

                    <input {...register("password", {
                        required: "Password is required",
                    })}
                        type="password" name="password" required placeholder="Password" className="input" />
                    {errors.password?.message && (<FormError errorMessage={errors.password?.message} />)}

                    <Button
                        canClick={isValid}
                        loading={loading}
                        actionText={"Log In"}
                    >Log In</Button>
                    {loginMutationResult?.login.error && (
                        <FormError errorMessage={loginMutationResult.login.error} />
                    )}
                </form>
                <div className="mb-9">
                    New to Account?{" "}
                    <Link to="/create-account" className="text-purple-400 hover:underline hover:text-purple-600">
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    )
};

