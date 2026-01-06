import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import DocTab from './DocTab';
import DocTabs from './DocTabs';

describe('DocTabs', () => {
    it('renders all tab labels in the navigation', () => {
        render(
            <DocTabs>
                <DocTab label="Tab 1">Content 1</DocTab>
                <DocTab label="Tab 2">Content 2</DocTab>
            </DocTabs>,
        );

        expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    });

    it('shows first tab content by default', () => {
        render(
            <DocTabs>
                <DocTab label="Tab 1">Content 1</DocTab>
                <DocTab label="Tab 2">Content 2</DocTab>
            </DocTabs>,
        );

        expect(screen.getByText('Content 1')).toBeInTheDocument();
        expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('switches content when clicking a different tab', async () => {
        const user = userEvent.setup();
        render(
            <DocTabs>
                <DocTab label="Tab 1">Content 1</DocTab>
                <DocTab label="Tab 2">Content 2</DocTab>
            </DocTabs>,
        );

        await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
        expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('filters out non-DocTab children (whitespace/text nodes from MDX)', () => {
        render(
            <DocTabs>
                {/* MDX often inserts whitespace nodes */} <DocTab label="Tab 1">Content 1</DocTab>
                {'\n'}
                <DocTab label="Tab 2">Content 2</DocTab>{' '}
            </DocTabs>,
        );

        // Should only have two tabs, not throw errors
        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);
    });

    it('uses defaultTab prop to set initial active tab', () => {
        render(
            <DocTabs defaultTab="Tab 2">
                <DocTab label="Tab 1">Content 1</DocTab>
                <DocTab label="Tab 2">Content 2</DocTab>
            </DocTabs>,
        );

        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
        expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
});
