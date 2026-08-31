import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import NavItem from './NavItem';
import NavSubSection from './NavSubSection';
import type { NavLink, NavSubSectionData } from './types';

const meta = {
    title: 'Navigation/NavSubSection',
    component: NavSubSection,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div
                className="w-[280px] p-3 rounded-md"
                style={{
                    background: 'var(--sidenav-background)',
                    border: '1px solid var(--sidenav-border)',
                }}
            >
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof NavSubSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const isNavLink = (item: NavLink | NavSubSectionData): item is NavLink => 'href' in item;

const InteractiveWrapper = ({
    subSection,
    initialActive,
}: {
    subSection: NavSubSectionData;
    initialActive: string;
}) => {
    const [active, setActive] = useState(initialActive);
    const renderNavItem = (item: NavLink | NavSubSectionData): React.ReactNode => {
        if (isNavLink(item)) {
            return (
                <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    active={item.href === active}
                    onClick={(e) => {
                        e.preventDefault();
                        setActive(item.href);
                    }}
                >
                    {item.children}
                </NavItem>
            );
        }
        return (
            <NavSubSection
                key={item.title}
                subSection={item}
                isPathActive={(p) => p === active}
                renderNavItem={renderNavItem}
            />
        );
    };
    return (
        <NavSubSection
            subSection={subSection}
            isPathActive={(p) => p === active}
            renderNavItem={renderNavItem}
        />
    );
};

const flatSection: NavSubSectionData = {
    title: 'Inventory',
    items: [
        { href: '/inventory/skus', children: 'SKUs' },
        { href: '/inventory/warehouses', children: 'Warehouses' },
        { href: '/inventory/transfers', children: 'Transfers' },
        { href: '/inventory/adjustments', children: 'Adjustments' },
    ],
};

const nestedSection: NavSubSectionData = {
    title: 'API reference',
    items: [
        { href: '/api/auth', children: 'Authentication' },
        {
            title: 'Orders',
            items: [
                { href: '/api/orders/list', children: 'List orders' },
                { href: '/api/orders/create', children: 'Create order' },
                { href: '/api/orders/cancel', children: 'Cancel order' },
            ],
        },
        {
            title: 'Inventory',
            items: [
                { href: '/api/inventory/skus', children: 'SKUs' },
                { href: '/api/inventory/warehouses', children: 'Warehouses' },
            ],
        },
    ],
};

export const FlatItems: Story = {
    render: () => (
        <InteractiveWrapper subSection={flatSection} initialActive="/inventory/warehouses" />
    ),
};

export const Nested: Story = {
    render: () => (
        <InteractiveWrapper subSection={nestedSection} initialActive="/api/orders/list" />
    ),
};

export const CollapsedByDefault: Story = {
    render: () => (
        <InteractiveWrapper subSection={flatSection} initialActive="/somewhere-unrelated" />
    ),
};
