import React from 'react';
import * as Icons from 'react-icons/fa';

export const SidebarData = [
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
  {
    title: 'Partner',
    path: '/accountability',
    icon: <Icons.FaUsers />,
    cName: 'nav-text'
  },
  {
    title: 'User',
    path: '/user',
    icon: <Icons.FaUserAlt />,
    cName: 'nav-text'
  }
];