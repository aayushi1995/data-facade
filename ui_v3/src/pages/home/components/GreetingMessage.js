import React from "react";
import {useAuth0} from "@auth0/auth0-react";

const GreetingMessage = () => {
    const {user, isAuthenticated} = useAuth0();

    if (isAuthenticated) {
        return (
            <div className="text-center hero my-5">
                <h1 className="mb-4">Welcome to DataFacade {user.name} !</h1>
                <p className="lead">
                    Please enjoy our awsome services !!
                </p>
            </div>
        );
    }

    return (
        <div className="text-center hero my-5">
            <h1 className="mb-4">Welcome to DataFacade</h1>
            <p className="lead">
                Please Login to enjoy our awsome services !!
            </p>
        </div>
    );
}

export default GreetingMessage