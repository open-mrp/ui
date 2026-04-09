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

// ---------------------------------------------------------------------------
// Overflow / clipping edge cases
// ---------------------------------------------------------------------------

export const InsideCardNearBottom: Story = {
    parameters: { layout: 'fullscreen' },
    render: () => (
        <div className="flex min-h-screen flex-col items-center justify-end p-8 pb-24">
            <p className="mb-4 max-w-sm text-center text-xs text-gray-400">
                The dropdown should float above the card boundary without clipping.
            </p>
            <div className="w-[460px] overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Short card
                </h3>
                <MultiSelectDemo helperText="" />
            </div>
        </div>
    ),
};

export const InsideOverflowHiddenContainer: Story = {
    parameters: { layout: 'fullscreen' },
    render: () => (
        <div className="flex min-h-screen items-end justify-center p-8 pb-16">
            <div className="w-[460px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Card with overflow:hidden
                    </h3>
                </div>
                <div className="p-4">
                    <MultiSelectDemo helperText="Dropdown should escape this container." />
                </div>
            </div>
        </div>
    ),
};

// ---------------------------------------------------------------------------
// Blur (shader background)
// ---------------------------------------------------------------------------

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
