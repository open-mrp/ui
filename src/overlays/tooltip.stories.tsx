import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ShadButton as Button } from "../buttons";
import { HelpIcon, QuestionMarkIcon } from "../icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta = {
  component: Tooltip,
  title: "Overlays/Tooltip",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Story
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a default tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

// Light Mode Customization
export const LightMode: Story = {
  decorators: [
    (Story) => (
      <div className="p-8 bg-white">
        <div className="dark:hidden">
          <Story />
        </div>
      </div>
    ),
  ],
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Light Mode Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This tooltip appears in light mode</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default">Primary Button</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hover over buttons to see tooltips</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2 border rounded-md hover:bg-gray-100 flex items-center justify-center">
              <HelpIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Icon button with tooltip</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

// Dark Mode Customization
export const DarkMode: Story = {
  decorators: [
    (Story) => {
      React.useEffect(() => {
        document.documentElement.classList.add("dark");
        return () => {
          document.documentElement.classList.remove("dark");
        };
      }, []);
      return (
        <div className="p-8 bg-gray-900">
          <Story />
        </div>
      );
    },
  ],
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="dark:border-gray-600 dark:text-gray-100"
            >
              Dark Mode Tooltip
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This tooltip appears in dark mode</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default">Primary Button</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltips adapt to dark backgrounds</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2 border border-gray-600 rounded-md hover:bg-gray-800 text-gray-100 flex items-center justify-center">
              <QuestionMarkIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dark mode icon button</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

// Complete Customization
export const CompleteCustomization: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Different Sides */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Different Positions</h3>
        <div className="flex items-center justify-center gap-8 p-12 border rounded-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Left
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip on left</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Top
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Tooltip on top</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Bottom
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Tooltip on bottom</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Right
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip on right</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Custom Delay */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Custom Delay</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Using TooltipProvider delayDuration prop (use
              TooltipPrimitive.Root directly)
            </p>
            <div className="flex items-center gap-4">
              <TooltipProvider delayDuration={500}>
                <TooltipPrimitive.Root>
                  <TooltipTrigger asChild>
                    <Button variant="outline">500ms Delay</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This tooltip has a 500ms delay</p>
                  </TooltipContent>
                </TooltipPrimitive.Root>
              </TooltipProvider>

              <TooltipProvider delayDuration={1000}>
                <TooltipPrimitive.Root>
                  <TooltipTrigger asChild>
                    <Button variant="outline">1s Delay</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This tooltip has a 1 second delay</p>
                  </TooltipContent>
                </TooltipPrimitive.Root>
              </TooltipProvider>

              <TooltipProvider delayDuration={0}>
                <TooltipPrimitive.Root>
                  <TooltipTrigger asChild>
                    <Button variant="outline">No Delay (Default)</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This tooltip appears immediately</p>
                  </TooltipContent>
                </TooltipPrimitive.Root>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Multiple tooltips sharing a TooltipProvider
            </p>
            <TooltipProvider delayDuration={750}>
              <div className="flex items-center gap-4">
                <TooltipPrimitive.Root>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Shared 750ms</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>All tooltips in this group have 750ms delay</p>
                  </TooltipContent>
                </TooltipPrimitive.Root>

                <TooltipPrimitive.Root>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Also 750ms</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Same delay from provider</p>
                  </TooltipContent>
                </TooltipPrimitive.Root>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Custom Styling */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Custom Styling</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Color Variations
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Blue</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-blue-600 bg-blue-600 text-white dark:fill-blue-500 dark:bg-blue-500">
                  <p>Blue tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Green</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-green-600 bg-green-600 text-white dark:fill-green-500 dark:bg-green-500">
                  <p>Green tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Red</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-red-600 bg-red-600 text-white dark:fill-red-500 dark:bg-red-500">
                  <p>Red tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Purple</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-purple-600 bg-purple-600 text-white dark:fill-purple-500 dark:bg-purple-500">
                  <p>Purple tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Orange</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-orange-600 bg-orange-600 text-white dark:fill-orange-500 dark:bg-orange-500">
                  <p>Orange tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Pink</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-pink-600 bg-pink-600 text-white dark:fill-pink-500 dark:bg-pink-500">
                  <p>Pink tooltip</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Shadows
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Small Shadow</Button>
                </TooltipTrigger>
                <TooltipContent className="shadow-sm">
                  <p>Small shadow</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Medium Shadow</Button>
                </TooltipTrigger>
                <TooltipContent className="shadow-md">
                  <p>Medium shadow (default)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Large Shadow</Button>
                </TooltipTrigger>
                <TooltipContent className="shadow-lg">
                  <p>Large shadow</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">XL Shadow</Button>
                </TooltipTrigger>
                <TooltipContent className="shadow-xl">
                  <p>Extra large shadow</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">2XL Shadow</Button>
                </TooltipTrigger>
                <TooltipContent className="shadow-2xl">
                  <p>2XL shadow</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Borders
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Thin Border</Button>
                </TooltipTrigger>
                <TooltipContent className="border border-gray-300 dark:border-gray-600">
                  <p>Thin border</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Thick Border</Button>
                </TooltipTrigger>
                <TooltipContent className="border-2 border-blue-500 dark:border-blue-400">
                  <p>Thick blue border</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Colored Border</Button>
                </TooltipTrigger>
                <TooltipContent className="border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100">
                  <p>Green border with tinted background</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Border Radius Variations
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Default</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Default rounded</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Large</Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-lg">
                  <p>Large border radius</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">XL</Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-xl">
                  <p>Extra large border radius</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Combined Styling - Color + Shadow + Border
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Blue Premium</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-blue-600 bg-blue-600 text-white shadow-xl border-2 border-blue-400 rounded-lg dark:fill-blue-500 dark:bg-blue-500 dark:border-blue-300">
                  <p>Blue with shadow & border</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Green Premium</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-green-600 bg-green-600 text-white shadow-xl border-2 border-green-400 rounded-lg dark:fill-green-500 dark:bg-green-500 dark:border-green-300">
                  <p>Green with shadow & border</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Purple Premium</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-purple-600 bg-purple-600 text-white shadow-xl border-2 border-purple-400 rounded-lg dark:fill-purple-500 dark:bg-purple-500 dark:border-purple-300">
                  <p>Purple with shadow & border</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Gradient Backgrounds
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Blue Gradient</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-blue-600 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg dark:fill-blue-500">
                  <p>Blue gradient</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Green Gradient</Button>
                </TooltipTrigger>
                <TooltipContent className="fill-green-600 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg dark:fill-green-500">
                  <p>Green gradient</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              showArrow prop (default: true)
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">With Arrow (Default)</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tooltip with arrow</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">No Arrow</Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={8} showArrow={false}>
                  <p>Tooltip with custom offset (no arrow visible)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Long Content */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Long Content</h3>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover for details</Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                This is a longer tooltip that contains more information. It can
                wrap to multiple lines and will adjust its width accordingly.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">With Icons</h3>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
                <HelpIcon />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help icon with tooltip</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
                <QuestionMarkIcon />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Info icon with tooltip</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Disabled Elements</h3>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <TooltipPrimitive.Root>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button variant="outline" disabled>
                    Disabled Button
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tooltip on disabled button</p>
              </TooltipContent>
            </TooltipPrimitive.Root>
          </TooltipProvider>
        </div>
      </div>

      {/* TooltipContent Positioning Props */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">TooltipContent Positioning</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              sideOffset prop - Distance from trigger
            </p>
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Default Offset</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Default sideOffset (0px)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Large Offset</Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={16}>
                  <p>sideOffset: 16px</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              align prop - Alignment on the side
            </p>
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Start
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="start">
                  <p>align: start</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Center
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p>align: center (default)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    End
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="end">
                  <p>align: end</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* TooltipProvider Options */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">TooltipProvider Options</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              disableHoverableContent: true - Content cannot be hovered
            </p>
            <TooltipProvider delayDuration={300} disableHoverableContent={true}>
              <TooltipPrimitive.Root>
                <TooltipTrigger asChild>
                  <Button variant="outline">Try hovering the tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Moving to this tooltip will close it</p>
                </TooltipContent>
              </TooltipPrimitive.Root>
            </TooltipProvider>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              disableHoverableContent: false (default) - Content can be hovered
            </p>
            <TooltipProvider
              delayDuration={300}
              disableHoverableContent={false}
            >
              <TooltipPrimitive.Root>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover tooltip content</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    You can move your mouse to this tooltip and it stays open
                  </p>
                </TooltipContent>
              </TooltipPrimitive.Root>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Multiple Tooltips */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Multiple Tooltips</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Individual tooltips
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save your changes</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Discard changes</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Permanently delete item</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Multiple tooltips with shared TooltipProvider configuration
            </p>
            <TooltipProvider delayDuration={300} skipDelayDuration={200}>
              <div className="flex items-center gap-4 flex-wrap">
                <TooltipPrimitive.Root>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit this item</p>
                  </TooltipContent>
                </TooltipPrimitive.Root>

                <TooltipPrimitive.Root>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share with others</p>
                  </TooltipContent>
                </TooltipPrimitive.Root>

                <TooltipPrimitive.Root>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      Archive
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Move to archive</p>
                  </TooltipContent>
                </TooltipPrimitive.Root>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  ),
};
