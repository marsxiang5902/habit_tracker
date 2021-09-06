import React, { useContext } from 'react';
import * as Icons from 'react-icons/fa';
import { appContext } from '../context/appContext';

function getSidebarData(context) {
    if (!context.session.isAuthed) {
        return []
    }
    return [
        {
            title: 'Dashboard',
            path: '/',
            icon: <Icons.FaHome />,
            cName: 'nav-text'
        },
        {
            title: 'Editor',
            path: '/editor',
            icon: <Icons.FaPencilAlt />,
            cName: 'nav-text',
        },
        {
            title: 'Data Room',
            path: '/data',
            icon: <Icons.FaDatabase />,
            cName: 'nav-text'
        },
        ...(context.session.partner ?
            [{
                title: 'Partner',
                path: '/accountability',
                icon: <Icons.FaUsers />,
                cName: 'nav-text'
            }] : []
        ),
        {
            title: 'User',
            path: '/user',
            icon: <Icons.FaUserAlt />,
            cName: 'nav-text'
        }
    ]
}

export default getSidebarData