import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthentication } from "./Authentication";

function PrivateRoute({ component: Component, ...rest })
{
    const { isAuthenticated } = useAuthentication();

    return (
        <Route {...rest} render={props => isAuthenticated  ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { referer: props.location } }} />} />
    );
}

export default PrivateRoute;