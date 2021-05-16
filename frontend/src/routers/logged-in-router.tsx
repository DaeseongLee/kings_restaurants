import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NotFound } from '../components/404';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import Category from '../pages/clients/category';
import RestaurantDetail from '../pages/clients/restaurantDetail';
import { Restaurants } from '../pages/clients/restaurants';
import Search from '../pages/clients/search';
import ConfirmEmail from '../pages/user/confirmEmail';
import EditProfile from '../pages/user/editProfile';
import Order from '../pages/user/order';
import { UserRole } from '../__generated__/globalTypes';

const commonRoutes = [
    { path: "/confirm", component: <ConfirmEmail />, },
    { path: "/edit-profile", component: <EditProfile />, },
    { path: "/order/:id", component: <Order />, },
]

const clientRoutes = [
    { path: "/", component: <Restaurants /> },
    { path: "/category/:slug", component: <Category /> },
    { path: "/search", component: <Search /> },
    { path: "/restaurant/:id", component: <RestaurantDetail /> },
];


export const LoggedInRouter = () => {
    const { data, loading, error } = useMe();
    if (!data || loading || error) {
        return (
            <div className="h-screen flex justify-center items-center" >
                <span className="font-medium text-xl tracking-wide">Loading ...</span>
            </div>
        )
    }
    return (
        <Router>
            <Header />
            <Switch>
                {data.me.role === UserRole.Client &&
                    clientRoutes.map(route => (
                        <Route exact key={route.path} path={route.path}>
                            {route.component}
                        </Route>
                    ))
                }
                {data.me.role === UserRole.Owner &&
                    clientRoutes.map(route => (
                        <Route exact key={route.path} path={route.path}>
                            {route.component}
                        </Route>
                    ))
                }
                {data.me.role === UserRole.Delievery &&
                    clientRoutes.map(route => (
                        <Route exact key={route.path} path={route.path}>
                            {route.component}
                        </Route>
                    ))
                }
                {
                    commonRoutes.map(route => (
                        <Route exact key={route.path} path={route.path}>
                            {route.component}
                        </Route>
                    ))
                }
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    )
};
