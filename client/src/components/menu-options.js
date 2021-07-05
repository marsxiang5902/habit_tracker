import React from 'react';
import * as Icons from 'react-icons/fa';
import { icons } from 'react-icons/lib';

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
    pageTitle: "🗺 THE PLAN",
  },
  {
    title: 'Habits',
    path: '/habits',
    icon: <Icons.FaRegCheckSquare />,
    cName: 'nav-text'
  },
  {
    title: 'Updates',
    path: '/updates',
    icon: <Icons.FaClipboardList />,
    cName: 'nav-text'
  },
  {
    title: 'Data Room',
    path: '/data',
    icon: <Icons.FaDatabase />,
    cName: 'nav-text'
  }
];