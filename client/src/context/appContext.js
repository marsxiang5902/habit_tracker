import React from 'react';

const defaultAppContext = {
    session: {
        isAuthed: false,
        jwt: "",
        user: null,
        perms: []
    },
    timedEvents: {
        loading: true
    }
}

const appContext = React.createContext(defaultAppContext)

export { defaultAppContext, appContext }