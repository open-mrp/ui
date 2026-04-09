import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { WaveShader } from '@/shaders/wave-shader/WaveShader';

import type { ListResponse } from './autocomplete-types';
import { SelectableAutocomplete } from './SelectableAutocomplete';
import type { SelectableAutocompleteVariant } from './SelectableAutocomplete';

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
    variant = 'outlined',
    blur = false,
}: {
    initialValue?: UserOption | null;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    clearable?: boolean;
    variant?: SelectableAutocompleteVariant;
    blur?: boolean;
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
                variant={variant}
                blur={blur}
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

export const LineVariant: Story = {
    render: () => <SingleSelectDemo variant="line" helperText="Simple underline input style." />,
};

export const LineVariantWithValue: Story = {
    render: () => (
        <SingleSelectDemo
            variant="line"
            initialValue={USERS[1]}
            helperText="Line variant with a preselected value."
        />
    ),
};

export const LineVariantError: Story = {
    render: () => (
        <SingleSelectDemo
            variant="line"
            error
            helperText="A user selection is required."
            clearable={false}
        />
    ),
};

function ShaderBackground({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative rounded-lg overflow-hidden" style={{ width: 400, height: 200 }}>
            <div className="absolute inset-0">
                <WaveShader width={400} height={200} animate seed={42} />
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
            <div className="w-[400px] overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Short card
                </h3>
                <SingleSelectDemo helperText="" />
            </div>
        </div>
    ),
};

export const InsideOverflowHiddenContainer: Story = {
    parameters: { layout: 'fullscreen' },
    render: () => (
        <div className="flex min-h-screen items-end justify-center p-8 pb-16">
            <div className="w-[420px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Card with overflow:hidden
                    </h3>
                </div>
                <div className="p-4">
                    <SingleSelectDemo helperText="Dropdown should escape this container." />
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
            <SingleSelectDemo variant="outlined" blur helperText="" />
        </ShaderBackground>
    ),
};

export const BlurOutlinedWithValue: Story = {
    render: () => (
        <ShaderBackground>
            <SingleSelectDemo variant="outlined" blur initialValue={USERS[1]} helperText="" />
        </ShaderBackground>
    ),
};

export const BlurLine: Story = {
    render: () => (
        <ShaderBackground>
            <SingleSelectDemo variant="line" blur helperText="" />
        </ShaderBackground>
    ),
};

export const BlurLineWithValue: Story = {
    render: () => (
        <ShaderBackground>
            <SingleSelectDemo variant="line" blur initialValue={USERS[1]} helperText="" />
        </ShaderBackground>
    ),
};
