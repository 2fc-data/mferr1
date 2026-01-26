/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Assets
 */
import {
  BookOpenIcon,
  // ChartPieIcon,
  // CopyCheckIcon,
  CopyIcon,
  // FolderKanbanIcon,
  HomeIcon,
  // LayoutDashboardIcon,
  LifeBuoyIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserIcon,
  // UsersIcon,
} from 'lucide-react';

/**
 * Types
 */
// import type { Vendor } from '@/components/Columns';

export const VENDOR_BREAKDOWN = [
  { month: 'Jan 2025', asia: 35, us: 20, eu: 30 },
  { month: 'Feb 2025', asia: 30, us: 30, eu: 32 },
  { month: 'Mar 2025', asia: 24, us: 20, eu: 30 },
  { month: 'Apr 2025', asia: 28, us: 30, eu: 24 },
  { month: 'May 2025', asia: 10, us: 28, eu: 32 },
  { month: 'Jun 2025', asia: 13, us: 30, eu: 33 },
  { month: 'Jul 2025', asia: 10, us: 20, eu: 30 },
  { month: 'Aug 2025', asia: 20, us: 30, eu: 35 },
  { month: 'Sep 2025', asia: 10, us: 20, eu: 30 },
  { month: 'Oct 2025', asia: 28, us: 30, eu: 20 },
  { month: 'Nov 2025', asia: 24, us: 30, eu: 30 },
  { month: 'Dec 2025', asia: 35, us: 40, eu: 20 },
];

export const APP_SIDEBAR = {
  primaryNav: [
    {
      title: 'Home',
      url: '/',
      Icon: HomeIcon,
    },
    // {
    //   title: 'Dashboard',
    //   url: '#',
    //   Icon: LayoutDashboardIcon,
    // },
    // {
    //   title: 'Project',
    //   url: '#',
    //   Icon: FolderKanbanIcon,
    // },
    // {
    //   title: 'Tasks',
    //   url: '#',
    //   Icon: CopyCheckIcon,
    // },
    // {
    //   title: 'Reporting',
    //   url: '#',
    //   Icon: ChartPieIcon,
    // },
    // {
    //   title: 'Users',
    //   url: '#',
    //   Icon: UsersIcon,
    // },
  ],
  adminNav: [
    {
      title: 'Regras',
      url: '/Dashboard/rules',
      Icon: ShieldCheckIcon,
    },
  ],
  secondaryNav: [
    {
      title: 'Support',
      url: '#',
      Icon: LifeBuoyIcon,
    },
    {
      title: 'Settings',
      url: '#',
      Icon: SettingsIcon,
    },
  ],
  curProfile: {
    src: 'https://randomuser.me/api/portraits/men/47.jpg',
    name: 'Salvador Pearson',
    email: 'salvador.pearson@example.com',
  },
  allProfiles: [
    {
      src: 'https://randomuser.me/api/portraits/men/47.jpg',
      name: 'Salvador Pearson',
      email: 'salvador.pearson@example.com',
    },
    {
      src: 'https://randomuser.me/api/portraits/women/43.jpg',
      name: 'Violet Hicks',
      email: 'violet.hicks@example.com',
    },
  ],
  userMenu: {
    itemsPrimary: [
      {
        title: 'View profile',
        url: '#',
        Icon: UserIcon,
        kbd: '⌘K->P',
      },
      {
        title: 'Account settings',
        url: '#',
        Icon: SettingsIcon,
        kbd: '⌘S',
      },
      {
        title: 'Documentation',
        url: '#',
        Icon: BookOpenIcon,
      },
    ],
    itemsSecondary: [
      {
        title: 'Sign out',
        url: '#',
        Icon: LogOutIcon,
        kbd: '⌥⇧Q',
      },
    ],
  },
};

export const DASHBOARD_CARD_MENU = [
  {
    label: 'Editar',
    Icon: PencilIcon,
  },
  {
    label: 'Copiar',
    Icon: CopyIcon,
  },
  {
    label: 'Apagar',
    Icon: TrashIcon,
  },
];