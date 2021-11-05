import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { appContext } from '../context/appContext'

export default function AuthRoute(props) {
    let context = useContext(appContext);
    return context.session.isAuthed ? <Route {...props} /> : <Redirect to='/app/login' />
}