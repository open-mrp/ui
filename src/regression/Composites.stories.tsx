import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../buttons/Button';
import { Autocomplete } from '../forms/Autocomplete';
import { TextField } from '../forms/TextField';
import { Drawer } from '../overlays/Drawer';
import { MenuItem } from '../overlays/Menu';

declare global {
    interface Window {
        __log?: string[];
    }
}

function log(entry: string) {
    window.__log = [...(window.__log ?? []), entry];
}

const meta: Meta = {
    title: 'Regression/Composites',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

function SelectDemo() {
    const [value, setValue] = useState('Banana');
    return (
        <div className="flex max-w-xs flex-col gap-4">
            <TextField
                select
                label="Fruit"
                value={value}
                onChange={(event) => {
                    log(`select:${event.target.value}`);
                    setValue(event.target.value);
                }}
                data-testid="select"
            >
                {fruits.map((fruit) => (
                    <MenuItem key={fruit} value={fruit} data-testid={`option-${fruit}`}>
                        {fruit}
                    </MenuItem>
                ))}
            </TextField>
            <div data-testid="value">Value {value}</div>
        </div>
    );
}

export const SelectStory: Story = { name: 'Select', render: () => <SelectDemo /> };

function AutocompleteDemo() {
    const [value, setValue] = useState<string | null>(null);
    return (
        <div className="flex max-w-xs flex-col gap-4">
            <Autocomplete
                options={fruits}
                value={value}
                onChange={(_, next, reason) => {
                    log(`autocomplete:${next}:${reason}`);
                    setValue(next);
                }}
                renderInput={(params) => <TextField {...params} label="Fruit" />}
            />
            <div data-testid="value">Value {String(value)}</div>
        </div>
    );
}

export const AutocompleteStory: Story = {
    name: 'Autocomplete',
    render: () => <AutocompleteDemo />,
};

function DrawerDemo() {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    return (
        <div className="flex flex-col items-start gap-4">
            <Button data-testid="open" onClick={() => setOpen(true)}>
                Open drawer
            </Button>
            <Drawer
                open={open}
                anchor="right"
                onClose={(_, reason) => {
                    log(`drawer-close:${reason}:${count}`);
                    setOpen(false);
                }}
            >
                <div className="flex w-72 flex-col gap-2 p-4" data-testid="drawer-body">
                    <span>Drawer body</span>
                    <Button
                        data-testid="increment"
                        variant="outlined"
                        onClick={() => setCount((previous) => previous + 1)}
                    >
                        Count {count}
                    </Button>
                </div>
            </Drawer>
        </div>
    );
}

export const DrawerStory: Story = { name: 'Drawer', render: () => <DrawerDemo /> };

function MultilineDemo() {
    const [value, setValue] = useState('');
    return (
        <div className="flex max-w-md flex-col gap-4">
            <TextField
                multiline
                minRows={2}
                maxRows={5}
                label="Notes"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                inputClassName="multiline-input"
            />
            <Button
                data-testid="fill"
                variant="outlined"
                onClick={() =>
                    setValue(Array.from({ length: 8 }, (_, i) => `Line ${i + 1}`).join('\n'))
                }
            >
                Fill
            </Button>
        </div>
    );
}

export const MultilineStory: Story = {
    name: 'TextField multiline',
    render: () => <MultilineDemo />,
};
