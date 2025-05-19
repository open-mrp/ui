import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DarkModeButton from "../buttons/DarkModeButton";
import HomeIcon from "../icons/HomeIcon";
import BlurSearchBar from "./BlurSearchBar";
import Navbar from "./NavBar";

const meta = {
  component: Navbar,
  title: "Navbar",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with logo and navigation
export const Default: Story = {
  args: {
    children: (
      <>
        <div className="flex items-center gap-4">
          <HomeIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">My App</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm hover:text-primary">
            Home
          </a>
          <a href="#" className="text-sm hover:text-primary">
            About
          </a>
          <a href="#" className="text-sm hover:text-primary">
            Contact
          </a>
        </div>
      </>
    ),
  },
};

// With search bar
export const WithSearch: Story = {
  args: {
    children: (
      <>
        <div className="flex items-center gap-4">
          <HomeIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">My App</span>
        </div>
        <div className="flex-1 max-w-md mx-4">
          <BlurSearchBar />
        </div>
        <div className="flex items-center gap-4">
          <DarkModeButton />
        </div>
      </>
    ),
  },
};

// With dark mode button
export const WithDarkMode: Story = {
  args: {
    children: (
      <>
        <div className="flex items-center gap-4">
          <HomeIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">My App</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm hover:text-primary">
            Home
          </a>
          <a href="#" className="text-sm hover:text-primary">
            About
          </a>
          <a href="#" className="text-sm hover:text-primary">
            Contact
          </a>
          <DarkModeButton />
        </div>
      </>
    ),
  },
};

// Full featured navbar
export const FullFeatured: Story = {
  args: {
    children: (
      <>
        <div className="flex items-center gap-4">
          <HomeIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">My App</span>
        </div>
        <div className="flex-1 max-w-md mx-4">
          <BlurSearchBar />
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm hover:text-primary">
            Home
          </a>
          <a href="#" className="text-sm hover:text-primary">
            About
          </a>
          <a href="#" className="text-sm hover:text-primary">
            Contact
          </a>
          <DarkModeButton />
        </div>
      </>
    ),
  },
};
