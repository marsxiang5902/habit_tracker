import React, { useContext } from 'react';
import * as Icons from 'react-icons/fa';
import { appContext } from '../context/appContext';

function getSidebarData(context) {
    if (!context.session.isAuthed) {
        return []
    }
    return [
        {
            title: 'Next Up',
            path: '/',
            icon: <Icons.FaClock />,
        },
        // {
        //     title: 'Dashboard',
        //     path: '/dashboard',
        //     icon: <Icons.FaHome />,
        // },
        {
            title: 'Editor',
            path: '/editor',
            icon: <Icons.FaLightbulb />,
        },
        {
            title: 'Data Room',
            path: '/data',
            icon: <Icons.FaChartLine />,
        },
        // ...(context.session.partner ?
        //     [{
        //         title: 'Partner',
        //         path: '/accountability',
        //         icon: <Icons.FaUsers />,
        //         cName: 'nav-text'
        //     }] : []
        // ),
        {
            title: 'Groups',
            path: '/accountability',
            icon: <Icons.FaUsers />
        },
        {
            title: 'Settings',
            path: '/user',
            icon: <Icons.FaCog />,
        }
    ]
}

export default getSidebarData