import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, Home, Settings } from 'lucide-react';
import { useState } from 'react';

import NavItem from './NavItem';

const meta = {
    title: 'Navigation/NavItem',
    component: NavItem,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div
                className="w-[240px] p-3 rounded-md"
                style={{
                    background: 'var(--sidenav-background)',
                    border: '1px solid var(--sidenav-border)',
                }}
            >
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
    args: {
        href: '/docs/overview',
        active: false,
        children: 'Overview',
    },
};

export const Active: Story = {
    args: {
        href: '/docs/overview',
        active: true,
        children: 'Overview',
    },
};

export const WithIcon: Story = {
    args: {
        href: '/dashboard',
        active: false,
        icon: <Home className="h-4 w-4" />,
        children: 'Dashboard',
    },
};

export const LongLabel: Story = {
    args: {
        href: '/settings',
        active: false,
        icon: <Settings className="h-4 w-4" />,
        children: 'Settings and other configuration things that overflow',
    },
};

export const ListOfItems: Story = {
    render: () => {
        const [active, setActive] = useState('/dashboard');
        const items = [
            { href: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
            { href: '/orders', label: 'Orders', icon: <FileText className="h-4 w-4" /> },
            { href: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
        ];
        return (
            <div className="flex flex-col gap-0.5">
                {items.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        active={item.href === active}
                        icon={item.icon}
                        onClick={(e) => {
                            e.preventDefault();
                            setActive(item.href);
                        }}
                    >
                        {item.label}
                    </NavItem>
                ))}
            </div>
        );
    },
};

export const CustomLinkRenderer: Story = {
    args: {
        href: '/custom',
        active: false,
        children: 'Rendered via custom Link',
        renderLink: ({ href, children, className, style }) => (
            <a
                href={href}
                className={className}
                style={style}
                data-custom-link="true"
                onClick={(e) => e.preventDefault()}
            >
                {children}
            </a>
        ),
    },
};
