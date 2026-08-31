import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { WaveShader } from '@/shaders/wave-shader/WaveShader';

import { Selector } from './Selector';
import type { SelectorOption } from './Selector';

const FRUITS: SelectorOption[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
    { label: 'Elderberry', value: 'elderberry' },
];

const COUNTRIES: SelectorOption[] = [
    { label: 'United States', value: 'us', description: 'North America' },
    { label: 'United Kingdom', value: 'uk', description: 'Europe' },
    { label: 'Canada', value: 'ca', description: 'North America' },
    { label: 'Germany', value: 'de', description: 'Europe' },
    { label: 'Japan', value: 'jp', description: 'Asia' },
    { label: 'Australia', value: 'au', description: 'Oceania' },
    { label: 'Brazil', value: 'br', description: 'South America' },
    { label: 'France', value: 'fr', description: 'Europe' },
    { label: 'India', value: 'in', description: 'Asia' },
    { label: 'Mexico', value: 'mx', description: 'North America' },
];

const STATUSES: SelectorOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Archived', value: 'archived', disabled: true },
];

const ROLES: SelectorOption[] = [
    { label: 'Admin', value: 'admin', description: 'Full access to all resources' },
    { label: 'Editor', value: 'editor', description: 'Can edit and publish content' },
    { label: 'Viewer', value: 'viewer', description: 'Read-only access' },
    { label: 'Billing', value: 'billing', description: 'Manage billing and invoices' },
];

const MANY_OPTIONS: SelectorOption[] = Array.from({ length: 50 }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `option-${i + 1}`,
    description: i % 3 === 0 ? `Description for option ${i + 1}` : undefined,
}));

const meta = {
    title: 'Overlays/Selector',
    component: Selector,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[360px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Selector>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Single select — basics
// ---------------------------------------------------------------------------

export const Default: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Pick a fruit..."
            />
        );
    },
};

export const WithLabel: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                label="Fruit"
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Pick a fruit..."
                helperText="Choose your favourite fruit."
            />
        );
    },
};

export const WithPreselectedValue: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>('cherry');
        return (
            <Selector
                label="Fruit"
                options={FRUITS}
                value={value}
                onChange={setValue}
                helperText="Preselected value."
            />
        );
    },
};

export const WithDescriptions: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                label="Role"
                options={ROLES}
                value={value}
                onChange={setValue}
                placeholder="Assign a role..."
                helperText="Options have descriptions."
            />
        );
    },
};

const UNITS: SelectorOption[] = [
    { label: 'Pair', value: 'pr', description: 'pr' },
    { label: 'Carton (12 pr)', value: 'ct12pr', description: 'ct12pr' },
    { label: 'Case (48 pr)', value: 'cs48pr', description: 'cs48pr' },
];

export const WithInlineDescriptions: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>('ct12pr');
        return (
            <Selector
                label="Unit"
                options={UNITS}
                value={value}
                onChange={setValue}
                descriptionPosition="inline"
                placeholder="Select unit..."
                helperText="Description sits to the right of the label."
            />
        );
    },
};

export const WithDisabledOptions: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                label="Status"
                options={STATUSES}
                value={value}
                onChange={setValue}
                placeholder="Set status..."
                helperText="Archived is disabled."
            />
        );
    },
};

export const Clearable: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>('banana');
        return (
            <Selector
                label="Fruit"
                options={FRUITS}
                value={value}
                onChange={setValue}
                clearable
                helperText="Click the X to deselect."
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Searchable
// ---------------------------------------------------------------------------

export const Searchable: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                label="Country"
                options={COUNTRIES}
                value={value}
                onChange={setValue}
                searchable
                placeholder="Select a country..."
                helperText="Type to filter the list."
            />
        );
    },
};

export const SearchableWithValue: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>('jp');
        return (
            <Selector
                label="Country"
                options={COUNTRIES}
                value={value}
                onChange={setValue}
                searchable
                clearable
                helperText="Preselected, searchable, clearable."
            />
        );
    },
};

export const SearchableManyOptions: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                label="Choose an option"
                options={MANY_OPTIONS}
                value={value}
                onChange={setValue}
                searchable
                placeholder="Search 50 options..."
                helperText="Search is useful for long lists."
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const Outlined: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                variant="outlined"
                label="Outlined"
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Outlined variant"
            />
        );
    },
};

export const LineVariant: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                variant="line"
                label="Line"
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Line variant"
            />
        );
    },
};

export const PlainVariant: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                variant="plain"
                label="Plain"
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Plain variant"
            />
        );
    },
};

export const AllVariants: Story = {
    render: () => {
        const [v1, setV1] = useState<string | null>(null);
        const [v2, setV2] = useState<string | null>(null);
        const [v3, setV3] = useState<string | null>(null);
        return (
            <div className="space-y-6">
                <Selector
                    variant="outlined"
                    label="Outlined"
                    options={FRUITS}
                    value={v1}
                    onChange={setV1}
                    placeholder="Outlined"
                />
                <Selector
                    variant="line"
                    label="Line"
                    options={FRUITS}
                    value={v2}
                    onChange={setV2}
                    placeholder="Line"
                />
                <Selector
                    variant="plain"
                    label="Plain"
                    options={FRUITS}
                    value={v3}
                    onChange={setV3}
                    placeholder="Plain"
                />
            </div>
        );
    },
};

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

export const Small: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                size="sm"
                label="Small"
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Small"
            />
        );
    },
};

export const Medium: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                size="md"
                label="Medium"
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Medium"
            />
        );
    },
};

export const LargeSize: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                size="lg"
                label="Large"
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Large"
            />
        );
    },
};

export const AllSizes: Story = {
    render: () => {
        const [s1, setS1] = useState<string | null>(null);
        const [s2, setS2] = useState<string | null>(null);
        const [s3, setS3] = useState<string | null>(null);
        return (
            <div className="space-y-6">
                <Selector
                    size="sm"
                    label="Small"
                    options={FRUITS}
                    value={s1}
                    onChange={setS1}
                    placeholder="Small"
                />
                <Selector
                    size="md"
                    label="Medium"
                    options={FRUITS}
                    value={s2}
                    onChange={setS2}
                    placeholder="Medium"
                />
                <Selector
                    size="lg"
                    label="Large"
                    options={FRUITS}
                    value={s3}
                    onChange={setS3}
                    placeholder="Large"
                />
            </div>
        );
    },
};

// ---------------------------------------------------------------------------
// Size x Variant matrix
// ---------------------------------------------------------------------------

export const SizeVariantMatrix: Story = {
    render: () => {
        const [values, setValues] = useState<Record<string, string | null>>({});
        const set = (key: string) => (v: string | null) =>
            setValues((prev) => ({ ...prev, [key]: v }));

        return (
            <div className="space-y-8">
                {(['outlined', 'line', 'plain'] as const).map((variant) => (
                    <div key={variant} className="space-y-4">
                        <h3 className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                            {variant}
                        </h3>
                        <div className="space-y-3">
                            {(['sm', 'md', 'lg'] as const).map((size) => {
                                const key = `${variant}-${size}`;
                                return (
                                    <Selector
                                        key={key}
                                        variant={variant}
                                        size={size}
                                        options={FRUITS}
                                        value={values[key] ?? null}
                                        onChange={set(key)}
                                        placeholder={`${variant} / ${size}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    },
};

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export const ErrorState: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                label="Status"
                options={STATUSES}
                value={value}
                onChange={setValue}
                error
                helperText="This field is required."
                placeholder="Select status..."
            />
        );
    },
};

export const ErrorLineVariant: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <Selector
                variant="line"
                label="Status"
                options={STATUSES}
                value={value}
                onChange={setValue}
                error
                helperText="This field is required."
                placeholder="Select status..."
            />
        );
    },
};

export const Disabled: Story = {
    render: () => (
        <Selector
            label="Fruit"
            options={FRUITS}
            value="apple"
            onChange={() => {}}
            disabled
            helperText="Selection is disabled."
        />
    ),
};

// ---------------------------------------------------------------------------
// Multi-select
// ---------------------------------------------------------------------------

export const MultiDefault: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>([]);
        return (
            <Selector
                mode="multi"
                label="Fruits"
                options={FRUITS}
                value={value}
                onChange={setValue}
                placeholder="Pick fruits..."
                helperText="Select one or more."
            />
        );
    },
};

export const MultiWithPreselected: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>(['apple', 'cherry']);
        return (
            <Selector
                mode="multi"
                label="Fruits"
                options={FRUITS}
                value={value}
                onChange={setValue}
                helperText="Two preselected values."
            />
        );
    },
};

export const MultiClearable: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>(['banana', 'elderberry']);
        return (
            <Selector
                mode="multi"
                label="Fruits"
                options={FRUITS}
                value={value}
                onChange={setValue}
                clearable
                helperText="Clear all with one click."
            />
        );
    },
};

export const MultiSearchable: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>([]);
        return (
            <Selector
                mode="multi"
                label="Countries"
                options={COUNTRIES}
                value={value}
                onChange={setValue}
                searchable
                placeholder="Select countries..."
                helperText="Search and select multiple."
            />
        );
    },
};

export const MultiSearchableWithPreselected: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>(['us', 'jp', 'de']);
        return (
            <Selector
                mode="multi"
                label="Countries"
                options={COUNTRIES}
                value={value}
                onChange={setValue}
                searchable
                clearable
                helperText="Preselected, searchable, clearable."
            />
        );
    },
};

export const MultiWithDescriptions: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>([]);
        return (
            <Selector
                mode="multi"
                label="Roles"
                options={ROLES}
                value={value}
                onChange={setValue}
                placeholder="Assign roles..."
                helperText="Options show descriptions and checkboxes."
            />
        );
    },
};

export const MultiWithDisabledOptions: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>(['active']);
        return (
            <Selector
                mode="multi"
                label="Statuses"
                options={STATUSES}
                value={value}
                onChange={setValue}
                helperText="Archived is disabled."
            />
        );
    },
};

export const MultiManySelected: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>(['us', 'uk', 'ca', 'de', 'jp', 'au', 'br']);
        return (
            <Selector
                mode="multi"
                label="Countries"
                options={COUNTRIES}
                value={value}
                onChange={setValue}
                clearable
                helperText="Many pills wrap to multiple lines."
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Multi variants
// ---------------------------------------------------------------------------

export const MultiLineVariant: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>(['apple']);
        return (
            <Selector
                mode="multi"
                variant="line"
                label="Fruits (line)"
                options={FRUITS}
                value={value}
                onChange={setValue}
            />
        );
    },
};

export const MultiPlainVariant: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>(['banana']);
        return (
            <Selector
                mode="multi"
                variant="plain"
                label="Fruits (plain)"
                options={FRUITS}
                value={value}
                onChange={setValue}
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Multi sizes
// ---------------------------------------------------------------------------

export const MultiAllSizes: Story = {
    render: () => {
        const [s1, setS1] = useState<string[]>(['apple']);
        const [s2, setS2] = useState<string[]>(['apple', 'banana']);
        const [s3, setS3] = useState<string[]>(['apple', 'banana', 'cherry']);
        return (
            <div className="space-y-6">
                <Selector
                    mode="multi"
                    size="sm"
                    label="Small"
                    options={FRUITS}
                    value={s1}
                    onChange={setS1}
                />
                <Selector
                    mode="multi"
                    size="md"
                    label="Medium"
                    options={FRUITS}
                    value={s2}
                    onChange={setS2}
                />
                <Selector
                    mode="multi"
                    size="lg"
                    label="Large"
                    options={FRUITS}
                    value={s3}
                    onChange={setS3}
                />
            </div>
        );
    },
};

// ---------------------------------------------------------------------------
// Blur (shader background)
// ---------------------------------------------------------------------------

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

export const BlurOutlined: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <ShaderBackground>
                <Selector
                    variant="outlined"
                    blur
                    options={FRUITS}
                    value={value}
                    onChange={setValue}
                    placeholder="Pick a fruit..."
                />
            </ShaderBackground>
        );
    },
};

export const BlurOutlinedWithValue: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>('cherry');
        return (
            <ShaderBackground>
                <Selector
                    variant="outlined"
                    blur
                    options={FRUITS}
                    value={value}
                    onChange={setValue}
                    clearable
                />
            </ShaderBackground>
        );
    },
};

export const BlurLine: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <ShaderBackground>
                <Selector
                    variant="line"
                    blur
                    options={FRUITS}
                    value={value}
                    onChange={setValue}
                    placeholder="Pick a fruit..."
                />
            </ShaderBackground>
        );
    },
};

// ---------------------------------------------------------------------------
// Overflow / clipping edge cases
// ---------------------------------------------------------------------------

export const InsideCardNearBottom: Story = {
    parameters: { layout: 'fullscreen' },
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <div className="flex min-h-screen flex-col items-center justify-end p-8 pb-24">
                <p className="mb-4 max-w-sm text-center text-xs text-gray-400">
                    The dropdown should float above the card boundary without clipping.
                </p>
                <div className="w-[360px] overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Short card
                    </h3>
                    <Selector
                        label="Country"
                        options={COUNTRIES}
                        value={value}
                        onChange={setValue}
                        searchable
                        placeholder="Select a country..."
                    />
                </div>
            </div>
        );
    },
};

export const InsideOverflowHiddenContainer: Story = {
    parameters: { layout: 'fullscreen' },
    render: () => {
        const [v1, setV1] = useState<string | null>(null);
        const [v2, setV2] = useState<string[]>([]);
        return (
            <div className="flex min-h-screen items-end justify-center p-8 pb-16">
                <div className="w-[400px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Card with overflow:hidden
                        </h3>
                    </div>
                    <div className="space-y-4 p-4">
                        <Selector
                            label="Single select"
                            options={MANY_OPTIONS}
                            value={v1}
                            onChange={setV1}
                            searchable
                            placeholder="Pick one..."
                        />
                        <Selector
                            mode="multi"
                            label="Multi select"
                            options={COUNTRIES}
                            value={v2}
                            onChange={setV2}
                            searchable
                            placeholder="Pick many..."
                        />
                    </div>
                </div>
            </div>
        );
    },
};

export const StackedCardsBottomSelector: Story = {
    parameters: { layout: 'fullscreen' },
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <div className="flex min-h-screen flex-col items-center justify-end gap-4 p-8 pb-12">
                <div className="w-[360px] overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500">
                        Content card above — the selector below should not be clipped by this card
                        or the viewport edge.
                    </p>
                </div>
                <div className="w-[360px] overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                    <Selector
                        label="Country"
                        options={COUNTRIES}
                        value={value}
                        onChange={setValue}
                        searchable
                        placeholder="Select a country..."
                    />
                </div>
            </div>
        );
    },
};

// ---------------------------------------------------------------------------
// Narrow trigger — dropdown sizes to content
// ---------------------------------------------------------------------------

const LONG_LABELS: SelectorOption[] = [
    {
        label: 'A very descriptive option label that is quite long',
        value: 'a',
    },
    {
        label: 'Another lengthy label for demonstration purposes',
        value: 'b',
    },
    {
        label: 'Short',
        value: 'c',
    },
    {
        label: 'Yet another option with a verbose, wordy label',
        value: 'd',
    },
];

export const NarrowTriggerWideDropdown: Story = {
    decorators: [
        (Story) => (
            <div className="flex w-full items-start justify-center p-8">
                <Story />
            </div>
        ),
    ],
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <div className="w-[80px]">
                <Selector
                    options={LONG_LABELS}
                    value={value}
                    onChange={setValue}
                    placeholder="Pick"
                />
            </div>
        );
    },
};

// ---------------------------------------------------------------------------
// Form layout
// ---------------------------------------------------------------------------

export const FormLayout: Story = {
    render: () => {
        const [role, setRole] = useState<string | null>(null);
        const [status, setStatus] = useState<string | null>(null);
        const [countries, setCountries] = useState<string[]>([]);
        return (
            <div className="space-y-4">
                <Selector
                    label="Role"
                    options={ROLES}
                    value={role}
                    onChange={setRole}
                    placeholder="Assign a role..."
                />
                <Selector
                    label="Status"
                    options={STATUSES}
                    value={status}
                    onChange={setStatus}
                    placeholder="Set status..."
                />
                <Selector
                    mode="multi"
                    label="Operating countries"
                    options={COUNTRIES}
                    value={countries}
                    onChange={setCountries}
                    searchable
                    placeholder="Select countries..."
                />
            </div>
        );
    },
};
