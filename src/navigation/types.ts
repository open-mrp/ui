import type { ReactNode } from 'react';

export interface NavLink {
    href: string;
    children: string;
    icon?: ReactNode;
}

export interface NavSubSectionData {
    title: string;
    items: (NavLink | NavSubSectionData)[];
}
