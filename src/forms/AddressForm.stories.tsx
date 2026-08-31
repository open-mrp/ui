import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import Button from '@/buttons/Button';
import { Selector, type SelectorOption } from '@/overlays/Selector';

import { Input } from './Input';
import { Switch } from './Switch';

const COUNTRY_OPTIONS: SelectorOption[] = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'MX', label: 'Mexico' },
    { value: 'GB', label: 'United Kingdom' },
];

interface AddressValue {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDropShip: boolean;
    phone: string;
    email: string;
}

const EMPTY_ADDRESS: AddressValue = {
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    isDropShip: false,
    phone: '',
    email: '',
};

const FILLED_ADDRESS: AddressValue = {
    name: 'Global Manufacturing Solutions',
    addressLine1: '789 Mission St',
    addressLine2: 'Suite 400',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    country: 'US',
    isDropShip: false,
    phone: '',
    email: '',
};

function AddressFormDemo({ initial = EMPTY_ADDRESS }: { initial?: AddressValue }) {
    const [value, setValue] = useState<AddressValue>(initial);

    const update = (field: keyof AddressValue, v: string | boolean) =>
        setValue((prev) => ({ ...prev, [field]: v }));

    return (
        <div className="flex flex-col gap-3">
            <Input
                label="Address Name"
                placeholder="Ex. Acme Inc. or Home Office"
                value={value.name}
                onChange={(e) => update('name', e.target.value)}
                variant="outlined"
                required
            />
            <Input
                label="Address Line 1"
                value={value.addressLine1}
                onChange={(e) => update('addressLine1', e.target.value)}
                variant="outlined"
                required
            />
            <Input
                label="Address Line 2"
                value={value.addressLine2}
                onChange={(e) => update('addressLine2', e.target.value)}
                variant="outlined"
            />
            <div className="grid grid-cols-[2fr_1fr] gap-3">
                <Input
                    label="City"
                    value={value.city}
                    onChange={(e) => update('city', e.target.value)}
                    variant="outlined"
                    required
                />
                <Input
                    label="State"
                    value={value.state}
                    onChange={(e) => update('state', e.target.value)}
                    variant="outlined"
                    required
                />
            </div>
            <div className="grid grid-cols-[1fr_2fr] gap-3">
                <Input
                    label="Postal Code"
                    value={value.postalCode}
                    onChange={(e) => update('postalCode', e.target.value)}
                    variant="outlined"
                    required
                />
                <Selector
                    label="Country"
                    options={COUNTRY_OPTIONS}
                    value={value.country}
                    onChange={(v) => update('country', v ?? 'US')}
                    variant="outlined"
                />
            </div>
            <Switch
                checked={value.isDropShip}
                onCheckedChange={(checked) => update('isDropShip', checked)}
                label="Drop ship address"
            />
            {value.isDropShip && (
                <div className="flex gap-3">
                    <Input
                        label="Phone"
                        placeholder="555-555-5555"
                        value={value.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        variant="outlined"
                        containerClassName="flex-1"
                    />
                    <Input
                        label="Email"
                        placeholder="contact@example.com"
                        value={value.email}
                        onChange={(e) => update('email', e.target.value)}
                        variant="outlined"
                        containerClassName="flex-1"
                    />
                </div>
            )}
            <div className="flex gap-2 justify-end mt-4">
                <Button variant="text" color="#D14343">
                    Delete
                </Button>
                <div className="flex-1" />
                <Button variant="outlined" color="primary">
                    Cancel
                </Button>
                <Button variant="contained" color="primary">
                    Save
                </Button>
            </div>
        </div>
    );
}

const meta = {
    title: 'Forms/AddressForm',
    component: AddressFormDemo,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[480px] p-6 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Edit address details
                </h2>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AddressFormDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        initial: EMPTY_ADDRESS,
    },
};

export const Filled: Story = {
    args: {
        initial: FILLED_ADDRESS,
    },
};

export const DropShip: Story = {
    args: {
        initial: {
            ...FILLED_ADDRESS,
            isDropShip: true,
            phone: '415-555-0123',
            email: 'shipping@globalmanuf.com',
        },
    },
};

export const ValidationError: Story = {
    render: () => {
        const [value, setValue] = useState(FILLED_ADDRESS);
        const update = (field: keyof AddressValue, v: string | boolean) =>
            setValue((prev) => ({ ...prev, [field]: v }));

        return (
            <div className="flex flex-col gap-3">
                <Input
                    label="Address Name"
                    placeholder="Ex. Acme Inc. or Home Office"
                    value={value.name}
                    onChange={(e) => update('name', e.target.value)}
                    variant="outlined"
                    required
                />
                <Input
                    label="Address Line 1"
                    value={value.addressLine1}
                    onChange={(e) => update('addressLine1', e.target.value)}
                    variant="outlined"
                    required
                />
                <Input
                    label="Address Line 2"
                    value={value.addressLine2}
                    onChange={(e) => update('addressLine2', e.target.value)}
                    variant="outlined"
                />
                <div className="grid grid-cols-[2fr_1fr] gap-3">
                    <Input
                        label="City"
                        value={value.city}
                        onChange={(e) => update('city', e.target.value)}
                        variant="outlined"
                        required
                    />
                    <Input
                        label="State"
                        value={value.state}
                        onChange={(e) => update('state', e.target.value)}
                        variant="outlined"
                        required
                    />
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <Input
                        label="Postal Code"
                        value={value.postalCode}
                        onChange={(e) => update('postalCode', e.target.value)}
                        variant="outlined"
                        required
                    />
                    <Selector
                        label="Country"
                        options={COUNTRY_OPTIONS}
                        value={value.country}
                        onChange={(v) => update('country', v ?? 'US')}
                        variant="outlined"
                    />
                </div>
                <p className="text-xs text-red-500">Some address components were inferred</p>
                <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outlined" color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" color="#FFB020">
                        Save anyway
                    </Button>
                </div>
            </div>
        );
    },
};

export const CorrectionDiff: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="p-3 border border-blue-400 rounded bg-white dark:bg-gray-900">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Suggested corrections
                </p>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-1 items-center">
                    <span className="text-xs font-semibold text-gray-500">Your input</span>
                    <span />
                    <span className="text-xs font-semibold text-gray-500">Suggested</span>

                    <div>
                        <span className="text-xs text-gray-500">Address Line 1</span>
                        <p className="text-sm line-through text-red-600 break-words">
                            7869 West Main Street
                        </p>
                    </div>
                    <span className="text-gray-400 px-1">&rarr;</span>
                    <div>
                        <span className="text-xs text-gray-500">Address Line 1</span>
                        <p className="text-sm font-medium text-emerald-600 break-words">
                            7869 W Main St
                        </p>
                    </div>

                    <div>
                        <span className="text-xs text-gray-500">Postal Code</span>
                        <p className="text-sm line-through text-red-600 break-words">70360</p>
                    </div>
                    <span className="text-gray-400 px-1">&rarr;</span>
                    <div>
                        <span className="text-xs text-gray-500">Postal Code</span>
                        <p className="text-sm font-medium text-emerald-600 break-words">
                            70360-4461
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
                <Button variant="outlined" color="primary">
                    Cancel
                </Button>
                <Button variant="outlined" color="primary">
                    Keep original
                </Button>
                <Button variant="contained" color="primary">
                    Accept corrections
                </Button>
            </div>
        </div>
    ),
};
