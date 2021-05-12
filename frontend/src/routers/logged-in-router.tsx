import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { UserRole } from '../__generated__/globalTypes';

const clientRoutes = [




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
    console.log(data);
    return (
        <Router>
            <Header />
            <Switch>
                {data.me.role === UserRole.Client
                }
            </Switch>
        </Router>
    )
};
