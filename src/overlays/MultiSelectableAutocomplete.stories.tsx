import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import type { ListResponse } from './autocomplete-types';
import { MultiSelectableAutocomplete } from './MultiSelectableAutocomplete';

type TeamOption = {
    id: string;
    name: string;
    role: string;
};

const TEAM_MEMBERS: TeamOption[] = [
    { id: '1', name: 'Ada Lovelace', role: 'Platform Engineer' },
    { id: '2', name: 'Grace Hopper', role: 'Backend Engineer' },
    { id: '3', name: 'Katherine Johnson', role: 'Data Scientist' },
    { id: '4', name: 'Margaret Hamilton', role: 'Product Engineer' },
    { id: '5', name: 'Annie Easley', role: 'ML Engineer' },
    { id: '6', name: 'Radia Perlman', role: 'Infrastructure Engineer' },
];

async function fetchTeamMembers({
    search,
    limit,
}: {
    search?: string;
    cursor?: string;
    limit?: number;
}): Promise<ListResponse<TeamOption>> {
    const query = search?.trim().toLowerCase() ?? '';
    const filtered = TEAM_MEMBERS.filter((member) => {
        if (query === '') return true;
        return member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query);
    }).slice(0, limit ?? TEAM_MEMBERS.length);

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

function MultiSelectDemo({
    initialValues = [],
    disabled = false,
    error = false,
    helperText = 'Select one or more team members.',
    clearable = true,
}: {
    initialValues?: TeamOption[];
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    clearable?: boolean;
}) {
    const [value, setValue] = useState<TeamOption[]>(initialValues);

    return (
        <div className="w-[420px]">
            <MultiSelectableAutocomplete<TeamOption>
                value={value}
                onSelect={setValue}
                fetchItems={fetchTeamMembers}
                queryKey={['storybook', 'multi-selectable-autocomplete']}
                label="Reviewers"
                placeholder="Search team members..."
                helperText={helperText}
                error={error}
                disabled={disabled}
                clearable={clearable}
                prefetch
                getOptionLabel={(option) => ({
                    primary: option.name,
                    secondary: option.role,
                })}
                isOptionEqualToValue={(option, selected) => option.id === selected.id}
                getOptionKey={(option) => option.id}
            />
        </div>
    );
}

const meta = {
    title: 'Overlays/MultiSelectableAutocomplete',
    component: MultiSelectableAutocomplete,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof MultiSelectableAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <MultiSelectDemo />,
};

export const WithInitialValues: Story = {
    render: () => (
        <MultiSelectDemo
            initialValues={[TEAM_MEMBERS[0], TEAM_MEMBERS[2], TEAM_MEMBERS[5]]}
            helperText="Initial reviewer set is preselected."
        />
    ),
};

export const ErrorState: Story = {
    render: () => (
        <MultiSelectDemo
            error
            helperText="At least one reviewer must be selected."
            clearable={false}
        />
    ),
};

export const Disabled: Story = {
    render: () => (
        <MultiSelectDemo
            disabled
            initialValues={[TEAM_MEMBERS[1], TEAM_MEMBERS[3]]}
            helperText="This field is locked in read-only mode."
        />
    ),
};
