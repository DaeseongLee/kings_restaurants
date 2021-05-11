import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { CreateAccount } from '../pages/create-account';
import { Login } from '../pages/login';

export const LoggedOutRouter = () => {
    const onClick = () => {
        isLoggedInVar(true);
    }

    return (
        <Router>
            <Switch>
                <Route path="/create-account">
                    <CreateAccount />
                </Route>
                <Route path="/" exact>
                    <Login />
                </Route>
                <Route>

                </Route>
            </Switch>
        </Router>
    )
}
