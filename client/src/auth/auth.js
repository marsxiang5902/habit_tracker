'use strict'

import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import config from "../config";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()}>Log In</button>;
};
const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
        </button>
    );
};
const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userMetadata, setUserMetadata] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    audience: `https://${config.auth0_domain}/api/v2/`,
                    scope: 'read:current_user'
                })
                const userDetailsByIdUrl = `https://${config.auth0_domain}/api/v2/users/${user.sub}`
                const metadataResponse = await fetch(userDetailsByIdUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                const { userMetadata } = await metadataResponse.json()
                setUserMetadata(userMetadata)
            } catch (err) {
            }
        })()
    }, [])

    return (
        isAuthenticated ? (
            <div>
                {/* <img src={user.picture} alt={user.name} /> */}
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <h3>User Metadata</h3>
                {userMetadata ?
                    <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
                    : "No user metadata defined"}
            </div>
        ) : <div>Not authed.</div>
    )
}

export { LoginButton, LogoutButton, Profile };