import type { Meta, StoryObj } from '@storybook/react-vite';
import { memo, Profiler, useRef, useState, type ReactNode } from 'react';
import { Button } from '../buttons/Button';
import { Snackbar } from '../feedback/Snackbar';
import { TextareaAutosize } from '../forms/TextareaAutosize';
import { useForkRef } from '../hooks/use-fork-ref';
import { List, ListItem, ListItemText } from '../layout/List';
import { Step, StepLabel, Stepper } from '../navigation/Stepper';
import { Tab, Tabs } from '../navigation/Tabs';
import { ClickAwayListener } from '../overlays/ClickAwayListener';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '../overlays/Dialog';
import { Menu, MenuItem } from '../overlays/Menu';
import { Modal } from '../overlays/Modal';
import { Popover } from '../overlays/Popover';
import { Popper } from '../overlays/Popper';
import { Tooltip } from '../overlays/Tooltip';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../tables/Table';

declare global {
    interface Window {
        __log?: string[];
        __commits?: Record<string, number>;
    }
}

function log(entry: string) {
    window.__log = [...(window.__log ?? []), entry];
}

function countCommit(id: string) {
    window.__commits = window.__commits ?? {};
    window.__commits[id] = (window.__commits[id] ?? 0) + 1;
}

function Counter({ count, onIncrement }: { count: number; onIncrement: () => void }) {
    return (
        <Button data-testid="increment" variant="outlined" onClick={onIncrement}>
            Count {count}
        </Button>
    );
}

const meta: Meta = {
    title: 'Regression/Primitives',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

function PopoverDemo() {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [count, setCount] = useState(0);
    return (
        <div className="flex flex-col items-start gap-4">
            <Button data-testid="open" onClick={(event) => setAnchor(event.currentTarget)}>
                Open popover
            </Button>
            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onEntered={() => log(`popover-entered:${count}`)}
                onClose={(_, reason) => {
                    log(`popover-close:${reason}:${count}`);
                    setAnchor(null);
                }}
            >
                <div className="flex flex-col gap-2 p-4" data-testid="popover-body">
                    <span>Popover body</span>
                    <Counter count={count} onIncrement={() => setCount((value) => value + 1)} />
                    <input data-testid="popover-input" className="border px-2" />
                </div>
            </Popover>
        </div>
    );
}

export const PopoverStory: Story = { name: 'Popover', render: () => <PopoverDemo /> };

function ModalDemo() {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    return (
        <div className="flex flex-col items-start gap-4">
            <Button data-testid="open" onClick={() => setOpen(true)}>
                Open modal
            </Button>
            <Modal
                open={open}
                onClose={(_, reason) => {
                    log(`modal-close:${reason}:${count}`);
                    setOpen(false);
                }}
                backdropClassName="bg-black/40"
                contentClassName="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-paper p-6"
            >
                <div className="flex flex-col gap-2" data-testid="modal-body">
                    <span>Modal body</span>
                    <Counter count={count} onIncrement={() => setCount((value) => value + 1)} />
                    <input data-testid="modal-input" className="border px-2" />
                </div>
            </Modal>
        </div>
    );
}

export const ModalStory: Story = { name: 'Modal', render: () => <ModalDemo /> };

function DialogDemo() {
    const [open, setOpen] = useState(false);
    const [nested, setNested] = useState(false);
    const [count, setCount] = useState(0);
    return (
        <div className="flex flex-col items-start gap-4">
            <Button data-testid="open" onClick={() => setOpen(true)}>
                Open dialog
            </Button>
            <Dialog
                open={open}
                onClose={(_, reason) => {
                    log(`dialog-close:${reason}:${count}`);
                    setOpen(false);
                }}
            >
                <DialogTitle>Dialog title</DialogTitle>
                <DialogContent>
                    <div className="flex flex-col gap-2">
                        <Counter count={count} onIncrement={() => setCount((value) => value + 1)} />
                        <input data-testid="dialog-input" className="border px-2" />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button data-testid="open-nested" onClick={() => setNested(true)}>
                        Nested
                    </Button>
                    <Button data-testid="close" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={nested}
                onClose={(_, reason) => {
                    log(`nested-close:${reason}`);
                    setNested(false);
                }}
            >
                <DialogTitle>Nested dialog</DialogTitle>
                <DialogContent>
                    <input data-testid="nested-input" className="border px-2" />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export const DialogStory: Story = { name: 'Dialog', render: () => <DialogDemo /> };

function MenuDemo() {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [selected, setSelected] = useState('Two');
    const [dense, setDense] = useState(false);
    return (
        <div className="flex flex-col items-start gap-4">
            <div className="flex gap-2">
                <Button data-testid="open" onClick={(event) => setAnchor(event.currentTarget)}>
                    Open menu ({selected})
                </Button>
                <Button
                    data-testid="toggle-dense"
                    variant="outlined"
                    onClick={() => setDense((value) => !value)}
                >
                    Dense: {String(dense)}
                </Button>
            </div>
            <Menu
                open={Boolean(anchor)}
                anchorEl={anchor}
                listProps={{ dense }}
                onClose={(_, reason) => {
                    log(`menu-close:${reason}`);
                    setAnchor(null);
                }}
            >
                {['One', 'Two', 'Three', 'Four'].map((label) => (
                    <MenuItem
                        key={label}
                        data-testid={`item-${label}`}
                        selected={label === selected}
                        disabled={label === 'Three'}
                        onClick={() => {
                            setSelected(label);
                            setAnchor(null);
                        }}
                    >
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export const MenuStory: Story = { name: 'Menu', render: () => <MenuDemo /> };

function ClickAwayDemo() {
    const [count, setCount] = useState(0);
    return (
        <div className="flex flex-col items-start gap-4">
            <Counter count={count} onIncrement={() => setCount((value) => value + 1)} />
            <ClickAwayListener onClickAway={() => log(`clickaway:${count}`)}>
                <div data-testid="inside" className="rounded border p-6">
                    Inside the listener
                </div>
            </ClickAwayListener>
            <div data-testid="outside" className="rounded border border-dashed p-6">
                Outside
            </div>
        </div>
    );
}

export const ClickAwayStory: Story = { name: 'ClickAwayListener', render: () => <ClickAwayDemo /> };

function SnackbarDemo() {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    return (
        <div className="flex flex-col items-start gap-4">
            <div className="flex gap-2">
                <Button data-testid="open" onClick={() => setOpen(true)}>
                    Show snackbar
                </Button>
                <Counter count={count} onIncrement={() => setCount((value) => value + 1)} />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                message="Saved"
                onClose={(_, reason) => {
                    log(`snackbar-close:${reason}:${count}`);
                    setOpen(false);
                }}
            />
        </div>
    );
}

export const SnackbarStory: Story = { name: 'Snackbar', render: () => <SnackbarDemo /> };

function PopperDemo() {
    const [open, setOpen] = useState(false);
    const [anchorName, setAnchorName] = useState<'left' | 'right'>('left');
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Button data-testid="toggle" onClick={() => setOpen((value) => !value)}>
                    Toggle popper
                </Button>
                <Button
                    data-testid="swap"
                    variant="outlined"
                    onClick={() => setAnchorName((value) => (value === 'left' ? 'right' : 'left'))}
                >
                    Anchor: {anchorName}
                </Button>
            </div>
            <div className="flex justify-between">
                <div ref={leftRef} data-testid="anchor-left" className="rounded border p-4">
                    Left anchor
                </div>
                <div ref={rightRef} data-testid="anchor-right" className="rounded border p-4">
                    Right anchor
                </div>
            </div>
            <Popper
                open={open}
                anchorEl={() => (anchorName === 'left' ? leftRef.current : rightRef.current)}
                placement="bottom"
                offset={8}
                transition
            >
                <div data-testid="popper-body" className="rounded bg-paper p-3 shadow">
                    Popper for {anchorName}
                </div>
            </Popper>
        </div>
    );
}

export const PopperStory: Story = { name: 'Popper', render: () => <PopperDemo /> };

function TooltipDemo() {
    return (
        <div className="flex gap-8 p-12">
            <Tooltip title="First tooltip">
                <Button data-testid="first">Hover me</Button>
            </Tooltip>
            <Tooltip title="Second tooltip" placement="right" arrow>
                <Button data-testid="second" variant="outlined">
                    And me
                </Button>
            </Tooltip>
        </div>
    );
}

export const TooltipStory: Story = { name: 'Tooltip', render: () => <TooltipDemo /> };

const longText = Array.from({ length: 12 }, (_, index) => `Line ${index + 1}`).join('\n');

function TextareaDemo() {
    const [value, setValue] = useState('');
    const [other, setOther] = useState(0);
    return (
        <div className="flex max-w-md flex-col gap-4">
            <div className="flex gap-2">
                <Button data-testid="fill" onClick={() => setValue(longText)}>
                    Fill
                </Button>
                <Button data-testid="clear" variant="outlined" onClick={() => setValue('')}>
                    Clear
                </Button>
                <Button
                    data-testid="rerender"
                    variant="outlined"
                    onClick={() => setOther((previous) => previous + 1)}
                >
                    Rerender {other}
                </Button>
            </div>
            <label className="flex flex-col gap-1">
                Controlled (2–6 rows)
                <TextareaAutosize
                    data-testid="controlled"
                    className="w-full border p-2 text-sm"
                    minRows={2}
                    maxRows={6}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </label>
            <label className="flex flex-col gap-1">
                Uncontrolled (1+ rows)
                <TextareaAutosize
                    data-testid="uncontrolled"
                    className="w-full border p-2 text-sm"
                />
            </label>
        </div>
    );
}

export const TextareaAutosizeStory: Story = {
    name: 'TextareaAutosize',
    render: () => <TextareaDemo />,
};

function TabsDemo() {
    const [value, setValue] = useState(0);
    const [extra, setExtra] = useState(false);
    const [longLabel, setLongLabel] = useState(false);
    const labels = [
        longLabel ? 'Overview with a much longer label' : 'Overview',
        'Orders',
        'Shipments',
        'Invoices',
        'Payments',
        'Returns',
        'Analytics',
        'Settings',
        ...(extra ? ['Extra'] : []),
    ];
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Button
                    data-testid="toggle-extra"
                    onClick={() => setExtra((previous) => !previous)}
                >
                    Extra tab: {String(extra)}
                </Button>
                <Button
                    data-testid="toggle-label"
                    variant="outlined"
                    onClick={() => setLongLabel((previous) => !previous)}
                >
                    Long first label: {String(longLabel)}
                </Button>
            </div>
            <Tabs value={value} onChange={(_, next) => setValue(next)}>
                {labels.slice(0, 4).map((label, index) => (
                    <Tab key={label} label={label} value={index} data-testid={`tab-${index}`} />
                ))}
            </Tabs>
            <div className="max-w-sm">
                <Tabs
                    value={value}
                    variant="scrollable"
                    scrollButtons
                    onChange={(_, next) => setValue(next)}
                >
                    {labels.map((label, index) => (
                        <Tab
                            key={label}
                            label={label}
                            value={index}
                            data-testid={`stab-${index}`}
                        />
                    ))}
                </Tabs>
            </div>
            <div data-testid="selected">Selected {value}</div>
        </div>
    );
}

export const TabsStory: Story = { name: 'Tabs', render: () => <TabsDemo /> };

const MemoRow = memo(function MemoRow({ id }: { id: number }) {
    return (
        <Profiler id={`row-${id}`} onRender={() => countCommit(`row-${id}`)}>
            <TableRow>
                <TableCell>Row {id}</TableCell>
                <TableCell align="right">{id * 10}</TableCell>
            </TableRow>
        </Profiler>
    );
});

const MemoListItem = memo(function MemoListItem({ id }: { id: number }) {
    return (
        <Profiler id={`list-${id}`} onRender={() => countCommit(`list-${id}`)}>
            <ListItem>
                <ListItemText primary={`Item ${id}`} secondary="Secondary" />
            </ListItem>
        </Profiler>
    );
});

const MemoStepLabel = memo(function MemoStepLabel({ label }: { label: string }) {
    return (
        <Profiler id={`step-${label}`} onRender={() => countCommit(`step-${label}`)}>
            <StepLabel>{label}</StepLabel>
        </Profiler>
    );
});

function ContextDemo() {
    const [tick, setTick] = useState(0);
    const [size, setSize] = useState<'small' | 'medium'>('medium');
    const [dense, setDense] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
                <Button data-testid="tick" onClick={() => setTick((previous) => previous + 1)}>
                    Parent rerender {tick}
                </Button>
                <Button
                    data-testid="toggle-size"
                    variant="outlined"
                    onClick={() =>
                        setSize((previous) => (previous === 'small' ? 'medium' : 'small'))
                    }
                >
                    Table size: {size}
                </Button>
                <Button
                    data-testid="toggle-dense"
                    variant="outlined"
                    onClick={() => setDense((previous) => !previous)}
                >
                    List dense: {String(dense)}
                </Button>
                <Button
                    data-testid="next-step"
                    variant="outlined"
                    onClick={() => setActiveStep((previous) => (previous + 1) % 4)}
                >
                    Step {activeStep}
                </Button>
            </div>
            <Table size={size} data-testid="table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[1, 2, 3].map((id) => (
                        <MemoRow key={id} id={id} />
                    ))}
                </TableBody>
            </Table>
            <List dense={dense} data-testid="list">
                {[1, 2].map((id) => (
                    <MemoListItem key={id} id={id} />
                ))}
            </List>
            <Stepper activeStep={activeStep} data-testid="stepper">
                {['Cart', 'Shipping', 'Payment', 'Review'].map((label) => (
                    <Step key={label}>
                        <MemoStepLabel label={label} />
                    </Step>
                ))}
            </Stepper>
        </div>
    );
}

export const ContextValuesStory: Story = {
    name: 'Context values',
    render: () => <ContextDemo />,
};

function ForkRefTarget({
    refA,
    refB,
    useA,
}: {
    refA: React.Ref<HTMLDivElement>;
    refB: React.Ref<HTMLDivElement>;
    useA: boolean;
}) {
    const local = useRef<HTMLDivElement | null>(null);
    const handleRef = useForkRef(local, useA ? refA : refB);
    return (
        <div ref={handleRef} data-testid="fork-target" className="rounded border p-4">
            Target
        </div>
    );
}

function ForkRefDemo() {
    const [useA, setUseA] = useState(true);
    const [, force] = useState(0);
    const refA = useRef<HTMLDivElement | null>(null);
    const refB = useRef<HTMLDivElement | null>(null);
    const describe = (): ReactNode =>
        `A: ${refA.current ? 'attached' : 'null'} · B: ${refB.current ? 'attached' : 'null'}`;
    return (
        <div className="flex flex-col items-start gap-4">
            <div className="flex gap-2">
                <Button data-testid="swap" onClick={() => setUseA((previous) => !previous)}>
                    Using {useA ? 'A' : 'B'}
                </Button>
                <Button
                    data-testid="refresh"
                    variant="outlined"
                    onClick={() => force((n) => n + 1)}
                >
                    Refresh
                </Button>
            </div>
            <ForkRefTarget refA={refA} refB={refB} useA={useA} />
            <div data-testid="ref-state">{describe()}</div>
        </div>
    );
}

export const ForkRefStory: Story = { name: 'useForkRef', render: () => <ForkRefDemo /> };
