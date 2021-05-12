import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {

    const onClick = () => {
        isLoggedInVar(false);
    }

    return (
        <Router>

        </Router>
    )
};
