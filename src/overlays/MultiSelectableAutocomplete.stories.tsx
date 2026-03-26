import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { WaveShader } from '@/shaders/wave-shader/WaveShader';

import type { ListResponse } from './autocomplete-types';
import { MultiSelectableAutocomplete } from './MultiSelectableAutocomplete';
import type { MultiSelectableAutocompleteVariant } from './MultiSelectableAutocomplete';

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
    variant = 'outlined',
    blur = false,
}: {
    initialValues?: TeamOption[];
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    clearable?: boolean;
    variant?: MultiSelectableAutocompleteVariant;
    blur?: boolean;
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
                variant={variant}
                blur={blur}
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

export const LineVariant: Story = {
    render: () => <MultiSelectDemo variant="line" helperText="Simple underline input style." />,
};

export const LineVariantWithValues: Story = {
    render: () => (
        <MultiSelectDemo
            variant="line"
            initialValues={[TEAM_MEMBERS[0], TEAM_MEMBERS[2]]}
            helperText="Line variant with preselected values."
        />
    ),
};

export const LineVariantError: Story = {
    render: () => (
        <MultiSelectDemo
            variant="line"
            error
            helperText="At least one reviewer must be selected."
            clearable={false}
        />
    ),
};

function ShaderBackground({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative rounded-lg overflow-hidden" style={{ width: 460, height: 200 }}>
            <div className="absolute inset-0">
                <WaveShader width={460} height={200} animate seed={42} />
            </div>
            <div className="relative z-10 flex items-center justify-center px-8 py-10">
                <div className="w-full">{children}</div>
            </div>
        </div>
    );
}

export const BlurOutlined: Story = {
    render: () => (
        <ShaderBackground>
            <MultiSelectDemo variant="outlined" blur helperText="" />
        </ShaderBackground>
    ),
};

export const BlurOutlinedWithValues: Story = {
    render: () => (
        <ShaderBackground>
            <MultiSelectDemo
                variant="outlined"
                blur
                initialValues={[TEAM_MEMBERS[0], TEAM_MEMBERS[2]]}
                helperText=""
            />
        </ShaderBackground>
    ),
};

export const BlurLine: Story = {
    render: () => (
        <ShaderBackground>
            <MultiSelectDemo variant="line" blur helperText="" />
        </ShaderBackground>
    ),
};

export const BlurLineWithValues: Story = {
    render: () => (
        <ShaderBackground>
            <MultiSelectDemo
                variant="line"
                blur
                initialValues={[TEAM_MEMBERS[0], TEAM_MEMBERS[2]]}
                helperText=""
            />
        </ShaderBackground>
    ),
};
