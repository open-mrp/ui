import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import {
    ArrowRightIcon,
    AugnoLogo,
    CheckIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CloseIcon,
    CopyIcon,
    DiscordIcon,
    EventIcon,
    FitViewIcon,
    GithubIcon,
    HelpIcon,
    HomeIcon,
    MenuIcon,
    MoonIcon,
    QuestionMarkIcon,
    SunIcon,
    TwitterIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from './index';

const meta = {
    title: 'Icons',
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="p-6 flex items-center justify-center">
                <div className="text-3xl">
                    <Story />
                </div>
            </div>
        ),
    ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// AugnoLogo
export const LogoIcon: Story = {
    render: () => <AugnoLogo />,
};

// ArrowRightIcon
export const ArrowRight: Story = {
    render: () => <ArrowRightIcon />,
};

// CheckIcon
export const Check: Story = {
    render: () => <CheckIcon />,
};

// ChevronDownIcon
export const ChevronDown: Story = {
    render: () => <ChevronDownIcon />,
};

// ChevronRightIcon
export const ChevronRight: Story = {
    render: () => <ChevronRightIcon />,
};

// ChevronUpIcon
export const ChevronUp: Story = {
    render: () => <ChevronUpIcon />,
};

// CloseIcon
export const Close: Story = {
    render: () => <CloseIcon />,
};

// CopyIcon
export const Copy: Story = {
    render: () => <CopyIcon />,
};

// EventIcon
export const Event: Story = {
    render: () => <EventIcon />,
};

// FitViewIcon
export const FitView: Story = {
    render: () => <FitViewIcon />,
};

// HelpIcon
export const Help: Story = {
    render: () => <HelpIcon />,
};

// QuestionMarkIcon
export const QuestionMark: Story = {
    render: () => <QuestionMarkIcon />,
};

// SunIcon
export const Sun: Story = {
    render: () => <SunIcon />,
};

// ZoomInIcon
export const ZoomIn: Story = {
    render: () => <ZoomInIcon />,
};

// ZoomOutIcon
export const ZoomOut: Story = {
    render: () => <ZoomOutIcon />,
};

// MoonIcon
export const Moon: Story = {
    render: () => <MoonIcon />,
};

// MenuIcon
export const Menu: Story = {
    render: () => <MenuIcon />,
};

// DiscordIcon
export const Discord: Story = {
    render: () => <DiscordIcon />,
};

// GithubIcon
export const Github: Story = {
    render: () => <GithubIcon />,
};

// HomeIcon
export const Home: Story = {
    render: () => <HomeIcon />,
};

// TwitterIcon
export const Twitter: Story = {
    render: () => <TwitterIcon />,
};

// Display all icons together
export const AllIcons: Story = {
    render: () => (
        <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
                <AugnoLogo />
                <span className="text-sm mt-2">AugnoLogo</span>
            </div>
            <div className="flex flex-col items-center">
                <ArrowRightIcon />
                <span className="text-sm mt-2">ArrowRightIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <CheckIcon />
                <span className="text-sm mt-2">CheckIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <ChevronDownIcon />
                <span className="text-sm mt-2">ChevronDownIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <ChevronRightIcon />
                <span className="text-sm mt-2">ChevronRightIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <ChevronUpIcon />
                <span className="text-sm mt-2">ChevronUpIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <CloseIcon />
                <span className="text-sm mt-2">CloseIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <CopyIcon />
                <span className="text-sm mt-2">CopyIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <DiscordIcon />
                <span className="text-sm mt-2">DiscordIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <EventIcon />
                <span className="text-sm mt-2">EventIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <FitViewIcon />
                <span className="text-sm mt-2">FitViewIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <GithubIcon />
                <span className="text-sm mt-2">GithubIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <HelpIcon />
                <span className="text-sm mt-2">HelpIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <HomeIcon />
                <span className="text-sm mt-2">HomeIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <MenuIcon />
                <span className="text-sm mt-2">MenuIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <MoonIcon />
                <span className="text-sm mt-2">MoonIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <QuestionMarkIcon />
                <span className="text-sm mt-2">QuestionMarkIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <SunIcon />
                <span className="text-sm mt-2">SunIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <TwitterIcon />
                <span className="text-sm mt-2">TwitterIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <ZoomInIcon />
                <span className="text-sm mt-2">ZoomInIcon</span>
            </div>
            <div className="flex flex-col items-center">
                <ZoomOutIcon />
                <span className="text-sm mt-2">ZoomOutIcon</span>
            </div>
        </div>
    ),
};

// Icons with different colors
export const ColorVariants: Story = {
    render: () => (
        <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-blue-500">
                <SunIcon />
                <span className="text-sm mt-2">Blue</span>
            </div>
            <div className="flex flex-col items-center text-red-500">
                <SunIcon />
                <span className="text-sm mt-2">Red</span>
            </div>
            <div className="flex flex-col items-center text-green-500">
                <SunIcon />
                <span className="text-sm mt-2">Green</span>
            </div>
            <div className="flex flex-col items-center text-yellow-500">
                <SunIcon />
                <span className="text-sm mt-2">Yellow</span>
            </div>
        </div>
    ),
};

// Icons with different sizes
export const SizeVariants: Story = {
    render: () => (
        <div className="flex items-end space-x-4">
            <div className="flex flex-col items-center text-xs">
                <SunIcon />
                <span className="text-xs mt-2">Small</span>
            </div>
            <div className="flex flex-col items-center text-base">
                <SunIcon />
                <span className="text-xs mt-2">Medium</span>
            </div>
            <div className="flex flex-col items-center text-xl">
                <SunIcon />
                <span className="text-xs mt-2">Large</span>
            </div>
            <div className="flex flex-col items-center text-3xl">
                <SunIcon />
                <span className="text-xs mt-2">X-Large</span>
            </div>
        </div>
    ),
};
