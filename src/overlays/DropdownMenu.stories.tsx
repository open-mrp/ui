import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ChevronDownIcon,
    CopyIcon,
    EditIcon,
    MoreHorizontalIcon,
    SettingsIcon,
    TrashIcon,
    UserIcon,
} from 'lucide-react';
import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuButton,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
    title: 'Overlays/DropdownMenu',
    component: DropdownMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                    <MoreHorizontalIcon className="size-4" />
                    Actions
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <UserIcon className="size-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SettingsIcon className="size-4" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <EditIcon className="size-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CopyIcon className="size-4" />
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                    <TrashIcon className="size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const WithShortcuts: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                    <MoreHorizontalIcon className="size-4" />
                    File Menu
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <UserIcon className="size-4" />
                    New File
                    <DropdownMenuShortcut>Cmd+N</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SettingsIcon className="size-4" />
                    Open
                    <DropdownMenuShortcut>Cmd+O</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <EditIcon className="size-4" />
                    Save
                    <DropdownMenuShortcut>Cmd+S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <CopyIcon className="size-4" />
                    Copy
                    <DropdownMenuShortcut>Cmd+C</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <EditIcon className="size-4" />
                    Paste
                    <DropdownMenuShortcut>Cmd+V</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const WithCheckboxes: Story = {
    render: () => {
        const [showStatusBar, setShowStatusBar] = React.useState(true);
        const [showActivityBar, setShowActivityBar] = React.useState(false);
        const [showPanel, setShowPanel] = React.useState(false);

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                        <SettingsIcon className="size-4" />
                        View Options
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={showStatusBar}
                        onCheckedChange={setShowStatusBar}
                    >
                        Status Bar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showActivityBar}
                        onCheckedChange={setShowActivityBar}
                    >
                        Activity Bar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
                        Panel
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};

export const WithRadioGroups: Story = {
    render: () => {
        const [position, setPosition] = React.useState('bottom');

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                        <SettingsIcon className="size-4" />
                        Position: {position}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                        <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};

export const WithSubmenus: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                    <MoreHorizontalIcon className="size-4" />
                    More Tools
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <UserIcon className="size-4" />
                    New Tab
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SettingsIcon className="size-4" />
                    New Window
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <EditIcon className="size-4" />
                        Developer Tools
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>
                            <CopyIcon className="size-4" />
                            Console
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <EditIcon className="size-4" />
                            Network
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SettingsIcon className="size-4" />
                            Sources
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <TrashIcon className="size-4" />
                    Close Tab
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const WithGroups: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                    <MoreHorizontalIcon className="size-4" />
                    Account
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <UserIcon className="size-4" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <SettingsIcon className="size-4" />
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <EditIcon className="size-4" />
                        Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CopyIcon className="size-4" />
                        Copy Link
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                    <TrashIcon className="size-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const WithDisabledItems: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                    <MoreHorizontalIcon className="size-4" />
                    Actions
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <UserIcon className="size-4" />
                    Available Action
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <SettingsIcon className="size-4" />
                    Disabled Action
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <EditIcon className="size-4" />
                    Another Available Action
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked disabled>
                    Disabled Checkbox
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Enabled Checkbox</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const CustomTrigger: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    <ChevronDownIcon className="size-4" />
                    Custom Trigger
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <UserIcon className="size-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SettingsIcon className="size-4" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <EditIcon className="size-4" />
                    Edit
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const ButtonVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <DropdownMenu>
                <DropdownMenuButton variant="contained" color="primary">
                    <ChevronDownIcon className="size-4" />
                    Contained
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                    <DropdownMenuItem>Option 3</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuButton variant="outlined" color="primary">
                    <ChevronDownIcon className="size-4" />
                    Outlined
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                    <DropdownMenuItem>Option 3</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuButton variant="text" color="primary">
                    <ChevronDownIcon className="size-4" />
                    Text
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                    <DropdownMenuItem>Option 3</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuButton variant="icon" color="gray">
                    <MoreHorizontalIcon className="size-4" />
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                    <DropdownMenuItem>Option 3</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ),
};

export const ButtonSizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuButton variant="outlined" color="primary" size="sm">
                    <ChevronDownIcon className="size-3" />
                    Small
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuButton variant="outlined" color="primary" size="md">
                    <ChevronDownIcon className="size-4" />
                    Medium
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuButton variant="outlined" color="primary" size="lg">
                    <ChevronDownIcon className="size-5" />
                    Large
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ),
};

export const ButtonColors: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <DropdownMenu>
                <DropdownMenuButton variant="contained" color="primary">
                    Primary
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuButton variant="contained" color="secondary">
                    Secondary
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuButton variant="contained" color="#ef4444">
                    Custom Red
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuButton variant="outlined" color="primary">
                    Outlined Primary
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ),
};

export const AlignedContent: Story = {
    render: () => (
        <div className="flex gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                        <MoreHorizontalIcon className="size-4" />
                        Start Aligned
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                    <DropdownMenuItem>Item 3</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                        <MoreHorizontalIcon className="size-4" />
                        Center Aligned
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                    <DropdownMenuItem>Item 3</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                        <MoreHorizontalIcon className="size-4" />
                        End Aligned
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                    <DropdownMenuItem>Item 3</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ),
};
