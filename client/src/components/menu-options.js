import React from 'react';
import * as Icons from 'react-icons/fa';

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <Icons.FaHome />,
    cName: 'nav-text'
  },
  // {
  //   title: 'Habits',
  //   path: '/habits',
  //   icon: <Icons.FaRegCheckSquare />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'Triggers',
  //   path: '/triggers',
  //   icon: <Icons.FaBullhorn />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'Stacks',
  //   path: '/stacks',
  //   icon: <Icons.FaStackOverflow />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'Forms',
  //   path: '/forms',
  //   icon: <Icons.FaClipboardList />,
  //   cName: 'nav-text'
  // },
  {
    title: 'Data Room',
    path: '/data',
    icon: <Icons.FaDatabase />,
    cName: 'nav-text'
  },
  // nothing to see here
  {
    title: 'Editor',
    path: '/editor',
    icon: <Icons.FaPencilAlt />,
    cName: 'nav-text',
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