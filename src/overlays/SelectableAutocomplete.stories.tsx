import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import type { ListResponse } from './autocomplete-types';
import { SelectableAutocomplete } from './SelectableAutocomplete';

type UserOption = {
    id: string;
    name: string;
    email: string;
};

const USERS: UserOption[] = [
    { id: '1', name: 'Ada Lovelace', email: 'ada@augno.com' },
    { id: '2', name: 'Grace Hopper', email: 'grace@augno.com' },
    { id: '3', name: 'Katherine Johnson', email: 'katherine@augno.com' },
    { id: '4', name: 'Margaret Hamilton', email: 'margaret@augno.com' },
    { id: '5', name: 'Annie Easley', email: 'annie@augno.com' },
    { id: '6', name: 'Radia Perlman', email: 'radia@augno.com' },
];

async function fetchUsers({
    search,
    limit,
}: {
    search?: string;
    cursor?: string;
    limit?: number;
}): Promise<ListResponse<UserOption>> {
    const query = search?.trim().toLowerCase() ?? '';
    const filtered = USERS.filter((user) => {
        if (query === '') return true;
        return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
    }).slice(0, limit ?? USERS.length);

    return Promise.resolve({
        data: filtered,
        pageInfo: {
            nextCursor: null,
            prevCursor: null,
            hasNextPage: false,
            hasPrevPage: false,
        },
    });
}

function SingleSelectDemo({
    initialValue = null,
    disabled = false,
    error = false,
    helperText = 'Start typing to search users.',
    clearable = true,
}: {
    initialValue?: UserOption | null;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    clearable?: boolean;
}) {
    const [value, setValue] = useState<UserOption | null>(initialValue);

    return (
        <div className="w-[360px]">
            <SelectableAutocomplete<UserOption>
                value={value}
                onSelect={setValue}
                fetchItems={fetchUsers}
                queryKey={['storybook', 'selectable-autocomplete']}
                label="Assignee"
                placeholder="Search users..."
                helperText={helperText}
                error={error}
                disabled={disabled}
                clearable={clearable}
                prefetch
                getOptionLabel={(option) => ({
                    primary: option.name,
                    secondary: option.email,
                })}
                isOptionEqualToValue={(option, selected) => option.id === selected.id}
                getOptionKey={(option) => option.id}
            />
        </div>
    );
}

const meta = {
    title: 'Overlays/SelectableAutocomplete',
    component: SelectableAutocomplete,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof SelectableAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <SingleSelectDemo />,
};

export const WithInitialValue: Story = {
    render: () => <SingleSelectDemo initialValue={USERS[1]} helperText="Preselected user value." />,
};

export const ErrorState: Story = {
    render: () => (
        <SingleSelectDemo
            error
            helperText="A user selection is required before continuing."
            clearable={false}
        />
    ),
};

export const Disabled: Story = {
    render: () => <SingleSelectDemo disabled helperText="Selection is disabled in this state." />,
};
