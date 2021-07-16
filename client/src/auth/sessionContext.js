import React from 'react';

const defaultSessionContext = {
    isAuthed: false,
    jwt: "",
    user: null,
    perms: []
}

const sessionContext = React.createContext(defaultSessionContext)

export { defaultSessionContext, sessionContext }