import type { Meta, StoryObj } from '@storybook/react-vite';
import { StrictMode, useState } from 'react';
import { Button } from '../buttons/Button';
import { Autocomplete } from '../forms/Autocomplete';
import { TextField } from '../forms/TextField';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../overlays/Accordion';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '../overlays/Dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../overlays/DropdownMenu';
import { MultiSelectableAutocomplete } from '../overlays/MultiSelectableAutocomplete';
import { SelectableAutocomplete } from '../overlays/SelectableAutocomplete';
import { Selector } from '../overlays/Selector';
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '../overlays/Sheet';

declare global {
    interface Window {
        __log?: string[];
    }
}

function log(entry: string) {
    window.__log = [...(window.__log ?? []), entry];
}

const meta: Meta = {
    title: 'Regression/Replaced',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const fruitOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'].map(
    (label) => ({ label, value: label.toLowerCase() }),
);

type Fruit = (typeof fruitOptions)[number];

async function fetchFruits({ search }: { search?: string }) {
    const query = (search ?? '').toLowerCase();
    return {
        data: fruitOptions.filter((option) => option.label.toLowerCase().includes(query)),
        pageInfo: { hasNextPage: false, hasPrevPage: false },
    };
}

const fruitLabel = (option: Fruit) => ({ primary: option.label, secondary: null });
const sameFruit = (a: Fruit, b: Fruit) => a.value === b.value;

function SheetDemo() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fruit, setFruit] = useState<string | null>(null);
    return (
        <div className="flex flex-col items-start gap-4">
            <Button data-testid="open" onClick={() => setOpen(true)}>
                Open sheet
            </Button>
            <div data-testid="fruit">Fruit {String(fruit)}</div>
            <Sheet
                open={open}
                onOpenChange={(isOpen) => {
                    log(`sheet-change:${isOpen}:${saving}`);
                    if (!isOpen && !saving) setOpen(false);
                }}
            >
                <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Add new address</SheetTitle>
                    </SheetHeader>
                    <SheetBody className="flex flex-col gap-4">
                        <input data-testid="sheet-input" className="border px-2 py-1" />
                        <Selector
                            options={fruitOptions}
                            value={fruit}
                            onChange={setFruit}
                            searchable
                            placeholder="Pick a fruit"
                        />
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                data-testid="saving"
                                checked={saving}
                                onChange={(event) => setSaving(event.target.checked)}
                            />
                            Saving (blocks close)
                        </label>
                    </SheetBody>
                    <SheetFooter className="flex-row justify-end border-t border-gray-200 dark:border-gray-700">
                        <Button
                            data-testid="cancel"
                            variant="outlined"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export const SheetStory: Story = { name: 'Sheet controlled', render: () => <SheetDemo /> };

function SelectorInDialogDemo() {
    const [open, setOpen] = useState(false);
    const [single, setSingle] = useState<string | null>(null);
    const [multi, setMulti] = useState<string[]>([]);
    const [auto, setAuto] = useState<Fruit | null>(null);
    return (
        <div className="flex flex-col items-start gap-4">
            <Button data-testid="open" onClick={() => setOpen(true)}>
                Open dialog
            </Button>
            <div data-testid="values">
                {String(single)} | {multi.join(',')} | {auto?.label ?? 'null'}
            </div>
            <Dialog
                open={open}
                onClose={(_, reason) => {
                    log(`dialog-close:${reason}`);
                    setOpen(false);
                }}
                fullWidth
            >
                <DialogTitle>Selectors in a dialog</DialogTitle>
                <DialogContent>
                    <div className="flex flex-col gap-4 pt-2">
                        <Selector
                            label="Single"
                            options={fruitOptions}
                            value={single}
                            onChange={setSingle}
                            searchable
                            clearable
                        />
                        <Selector
                            label="Multi"
                            mode="multi"
                            options={fruitOptions}
                            value={multi}
                            onChange={setMulti}
                        />
                        <SelectableAutocomplete
                            label="Autocomplete"
                            queryKey="fruits"
                            value={auto}
                            onSelect={setAuto}
                            fetchItems={fetchFruits}
                            getOptionLabel={fruitLabel}
                            isOptionEqualToValue={sameFruit}
                            prefetch
                            debounceTime={50}
                        />
                        <input data-testid="dialog-input" className="border px-2 py-1" />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button data-testid="close" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export const SelectorInDialogStory: Story = {
    name: 'Selectors in Dialog',
    render: () => <SelectorInDialogDemo />,
};

function GridMenuDemo() {
    return (
        <div className="flex gap-8">
            {['Name', 'Status'].map((column) => (
                <div
                    key={column}
                    className="group flex items-center gap-1 rounded border px-3 py-2"
                >
                    <span>{column}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                data-testid={`menu-${column}`}
                                aria-label={`${column} column menu`}
                                className="inline-flex h-6 w-5 shrink-0 cursor-pointer items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                            >
                                ⋮
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            className="w-48"
                            onCloseAutoFocus={(event) => event.preventDefault()}
                        >
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => log(`${column}:sort-asc`)}
                            >
                                Sort ascending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => log(`${column}:sort-desc`)}
                            >
                                Sort descending
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled onClick={() => log(`${column}:hide`)}>
                                Hide column
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => log(`${column}:pin`)}
                            >
                                Pin column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        data-testid="menu-user"
                        className="rounded-full border px-3 py-1"
                    >
                        User
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <div className="px-2 py-1.5">Signed in as dev</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => log('user:profile')}
                    >
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => log('user:logout')}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export const GridMenuStory: Story = {
    name: 'DropdownMenu like GridHeader',
    render: () => <GridMenuDemo />,
};

function AccordionDemo() {
    return (
        <div className="max-w-md rounded border">
            <Accordion type="single" collapsible>
                <AccordionItem value="frequent" className="border-b-0">
                    <AccordionTrigger data-testid="trigger-frequent">
                        Frequent items
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                        <div data-testid="content-frequent" className="p-4">
                            Frequently ordered items
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="other">
                    <AccordionTrigger data-testid="trigger-other">Other items</AccordionTrigger>
                    <AccordionContent>
                        <div data-testid="content-other">Everything else</div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export const AccordionStory: Story = {
    name: 'Accordion single collapsible',
    render: () => <AccordionDemo />,
};

const manyOptions = Array.from(
    { length: 5000 },
    (_, index) => `Item ${String(index + 1).padStart(4, '0')}`,
);

function LargeAutocompleteDemo() {
    const [value, setValue] = useState<string | null>(null);
    return (
        <div className="flex max-w-xs flex-col gap-4">
            <Autocomplete
                options={manyOptions}
                value={value}
                onChange={(_, next, reason) => {
                    log(`large:${next}:${reason}`);
                    setValue(next);
                }}
                renderInput={(params) => <TextField {...params} label="Item" />}
            />
            <div data-testid="value">Value {String(value)}</div>
        </div>
    );
}

export const LargeAutocompleteStory: Story = {
    name: 'Autocomplete 5000 options',
    render: () => <LargeAutocompleteDemo />,
};

function MultiAutocompleteDemo() {
    const [value, setValue] = useState<Fruit[]>([]);
    return (
        <div className="flex max-w-sm flex-col gap-4">
            <MultiSelectableAutocomplete
                label="Fruits"
                queryKey="fruits-multi"
                value={value}
                onSelect={setValue}
                fetchItems={fetchFruits}
                getOptionLabel={fruitLabel}
                isOptionEqualToValue={sameFruit}
                prefetch
                debounceTime={50}
            />
            <div data-testid="value">Value {value.map((item) => item.label).join(',')}</div>
        </div>
    );
}

export const MultiAutocompleteStory: Story = {
    name: 'MultiSelectableAutocomplete',
    render: () => <MultiAutocompleteDemo />,
};

function StrictDialogDemo() {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col items-start gap-4">
            <Button data-testid="open" onClick={() => setOpen(true)}>
                Open dialog
            </Button>
            {open && (
                <Dialog open onClose={() => setOpen(false)}>
                    <DialogTitle>Mounted on open</DialogTitle>
                    <DialogContent>
                        <input data-testid="dialog-input" className="border px-2 py-1" autoFocus />
                    </DialogContent>
                    <DialogActions>
                        <Button data-testid="cancel" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}

export const StrictDialogStory: Story = {
    name: 'Dialog mounted on open in StrictMode',
    render: () => (
        <StrictMode>
            <StrictDialogDemo />
        </StrictMode>
    ),
};
