import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { Restaurants } from '../pages/clients/restaurants';
import { UserRole } from '../__generated__/globalTypes';

const clientRoutes = [
    { path: "/", component: <Restaurants /> }



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
            </Switch>
        </Router>
    )
};
