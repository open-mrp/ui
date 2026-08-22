import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search, Eye, EyeOff, DollarSign, Hash, Lock, User } from 'lucide-react';
import { useState } from 'react';

import { WaveShader } from '@/shaders/wave-shader/WaveShader';

import { Input } from './Input';

const meta = {
    title: 'Forms/Input',
    component: Input,
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
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Basic
// ---------------------------------------------------------------------------

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Full name',
        placeholder: 'Jane Doe',
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        helperText: 'We will never share your email.',
    },
};

export const WithValue: Story = {
    render: () => {
        const [value, setValue] = useState('hello@openmrp.ai');
        return (
            <Input
                label="Email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                helperText="Editable prefilled input."
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const Outlined: Story = {
    args: {
        variant: 'outlined',
        label: 'Outlined',
        placeholder: 'Default variant',
    },
};

export const Line: Story = {
    args: {
        variant: 'line',
        label: 'Line',
        placeholder: 'Underline style',
    },
};

export const Plain: Story = {
    args: {
        variant: 'plain',
        label: 'Plain',
        placeholder: 'No border or underline',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-6">
            <Input variant="outlined" label="Outlined" placeholder="Outlined variant" />
            <Input variant="line" label="Line" placeholder="Line variant" />
            <Input variant="plain" label="Plain" placeholder="Plain variant" />
        </div>
    ),
};

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

export const Small: Story = {
    args: {
        size: 'sm',
        label: 'Small',
        placeholder: 'Small input',
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
        label: 'Medium',
        placeholder: 'Medium input (default)',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        label: 'Large',
        placeholder: 'Large input',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div className="space-y-6">
            <Input size="sm" label="Small" placeholder="Small input" />
            <Input size="md" label="Medium" placeholder="Medium input" />
            <Input size="lg" label="Large" placeholder="Large input" />
        </div>
    ),
};

// ---------------------------------------------------------------------------
// Sizes x Variants
// ---------------------------------------------------------------------------

export const SizeVariantMatrix: Story = {
    render: () => (
        <div className="space-y-8">
            {(['outlined', 'line', 'plain'] as const).map((variant) => (
                <div key={variant} className="space-y-4">
                    <h3 className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                        {variant}
                    </h3>
                    <div className="space-y-3">
                        {(['sm', 'md', 'lg'] as const).map((size) => (
                            <Input
                                key={size}
                                variant={variant}
                                size={size}
                                placeholder={`${variant} / ${size}`}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
};

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export const ErrorState: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        error: true,
        helperText: 'Please enter a valid email address.',
    },
};

export const ErrorLine: Story = {
    args: {
        variant: 'line',
        label: 'Email',
        placeholder: 'you@example.com',
        error: true,
        helperText: 'Please enter a valid email address.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled',
        placeholder: 'Cannot type here',
        disabled: true,
    },
};

export const DisabledWithValue: Story = {
    args: {
        label: 'Disabled',
        value: 'Read-only content',
        disabled: true,
    },
};

// ---------------------------------------------------------------------------
// Clearable
// ---------------------------------------------------------------------------

export const Clearable: Story = {
    render: () => {
        const [value, setValue] = useState('Clearable text');
        return (
            <Input
                label="Clearable"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                clearable
                onClear={() => setValue('')}
                helperText="Click the X to clear."
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

export const Loading: Story = {
    args: {
        label: 'Loading',
        placeholder: 'Fetching data...',
        loading: true,
    },
};

export const LoadingWithValue: Story = {
    args: {
        label: 'Validating',
        value: 'hello@openmrp.ai',
        loading: true,
        helperText: 'Checking availability...',
    },
};

// ---------------------------------------------------------------------------
// Prefix & Suffix
// ---------------------------------------------------------------------------

export const WithSearchIcon: Story = {
    args: {
        placeholder: 'Search...',
        prefix: <Search className="h-4 w-4 text-gray-400" />,
    },
};

export const WithMailIcon: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        prefix: <Mail className="h-4 w-4 text-gray-400" />,
    },
};

export const WithUserIcon: Story = {
    args: {
        label: 'Username',
        placeholder: 'johndoe',
        prefix: <User className="h-4 w-4 text-gray-400" />,
    },
};

export const WithDollarPrefix: Story = {
    args: {
        label: 'Amount',
        placeholder: '0.00',
        prefix: <DollarSign className="h-4 w-4 text-gray-400" />,
        type: 'number',
    },
};

export const WithHashPrefix: Story = {
    args: {
        label: 'Order number',
        placeholder: '12345',
        prefix: <Hash className="h-4 w-4 text-gray-400" />,
    },
};

export const PasswordToggle: Story = {
    render: () => {
        const [show, setShow] = useState(false);
        const [value, setValue] = useState('supersecret');
        return (
            <Input
                label="Password"
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                prefix={<Lock className="h-4 w-4 text-gray-400" />}
                suffix={
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {show ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                }
            />
        );
    },
};

export const PrefixAndSuffix: Story = {
    args: {
        label: 'Website',
        placeholder: 'example.com',
        prefix: (
            <span className="text-xs text-gray-400">https://</span>
        ),
        suffix: (
            <span className="text-xs text-gray-400">.com</span>
        ),
    },
};

// ---------------------------------------------------------------------------
// Combined features
// ---------------------------------------------------------------------------

export const SearchInput: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <Input
                placeholder="Search..."
                prefix={<Search className="h-4 w-4 text-gray-400" />}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                clearable
                onClear={() => setValue('')}
            />
        );
    },
};

export const FullFeatured: Story = {
    render: () => {
        const [value, setValue] = useState('hello@openmrp.ai');
        return (
            <Input
                label="Email address"
                placeholder="you@example.com"
                prefix={<Mail className="h-4 w-4 text-gray-400" />}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                clearable
                onClear={() => setValue('')}
                helperText="Your primary email for notifications."
            />
        );
    },
};

export const FullFeaturedError: Story = {
    render: () => {
        const [value, setValue] = useState('not-an-email');
        return (
            <Input
                label="Email address"
                placeholder="you@example.com"
                prefix={<Mail className="h-4 w-4 text-gray-400" />}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                clearable
                onClear={() => setValue('')}
                error
                helperText="Please enter a valid email address."
            />
        );
    },
};

// ---------------------------------------------------------------------------
// Blur (on shader background)
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
    render: () => (
        <ShaderBackground>
            <Input
                variant="outlined"
                blur
                placeholder="Search..."
                prefix={<Search className="h-4 w-4 text-white/50" />}
            />
        </ShaderBackground>
    ),
};

export const BlurLine: Story = {
    render: () => (
        <ShaderBackground>
            <Input variant="line" blur placeholder="Type here..." />
        </ShaderBackground>
    ),
};

export const BlurWithValue: Story = {
    render: () => (
        <ShaderBackground>
            <Input variant="outlined" blur value="Blurred input" readOnly />
        </ShaderBackground>
    ),
};

// ---------------------------------------------------------------------------
// HTML input types
// ---------------------------------------------------------------------------

export const NumberInput: Story = {
    args: {
        label: 'Quantity',
        type: 'number',
        placeholder: '0',
        min: 0,
        max: 100,
    },
};

export const DateInput: Story = {
    args: {
        label: 'Date',
        type: 'date',
    },
};

// ---------------------------------------------------------------------------
// Form layout
// ---------------------------------------------------------------------------

export const FormLayout: Story = {
    render: () => {
        const [form, setForm] = useState({ name: '', email: '', password: '' });
        return (
            <div className="space-y-4">
                <Input
                    label="Full name"
                    placeholder="Jane Doe"
                    prefix={<User className="h-4 w-4 text-gray-400" />}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                    label="Email"
                    placeholder="jane@example.com"
                    prefix={<Mail className="h-4 w-4 text-gray-400" />}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="At least 8 characters"
                    prefix={<Lock className="h-4 w-4 text-gray-400" />}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
            </div>
        );
    },
};
