import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import DiscordIcon from "../icons/DiscordIcon";
import GithubIcon from "../icons/GithubIcon";
import HomeIcon from "../icons/HomeIcon";
import TwitterIcon from "../icons/TwitterIcon";
import Footer from "./Footer";

const meta = {
  component: Footer,
  title: "Footer",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with social links
export const Default: Story = {
  args: {
    home: {
      icon: <HomeIcon className="w-6 h-6" />,
      href: "/",
    },
    supportLinks: [
      {
        icon: <GithubIcon className="w-4 h-4 mr-2" />,
        text: "Find us on",
        link: {
          text: "GitHub",
          href: "https://github.com",
        },
      },
      {
        icon: <TwitterIcon className="w-4 h-4 mr-2" />,
        text: "Follow us on",
        link: {
          text: "Twitter",
          href: "https://twitter.com",
        },
      },
    ],
  },
};

// With Discord support
export const WithDiscord: Story = {
  args: {
    home: {
      icon: <HomeIcon className="w-6 h-6" />,
      href: "/",
    },
    supportLinks: [
      {
        icon: <DiscordIcon className="w-4 h-4 mr-2" />,
        text: "Join our",
        link: {
          text: "Discord",
          href: "https://discord.com",
        },
      },
      {
        icon: <GithubIcon className="w-4 h-4 mr-2" />,
        text: "Find us on",
        link: {
          text: "GitHub",
          href: "https://github.com",
        },
      },
    ],
  },
};

// Custom link rendering
export const CustomLinks: Story = {
  args: {
    home: {
      icon: <HomeIcon className="w-6 h-6" />,
      href: "/",
    },
    supportLinks: [
      {
        icon: <GithubIcon className="w-4 h-4 mr-2" />,
        text: "Find us on",
        link: {
          text: "GitHub",
          href: "https://github.com",
        },
      },
    ],
    renderLink: ({ href, children }) => (
      <a
        href={href}
        className="hover:text-primary transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

// Single support link
export const SingleLink: Story = {
  args: {
    home: {
      icon: <HomeIcon className="w-6 h-6" />,
      href: "/",
    },
    supportLinks: [
      {
        icon: <GithubIcon className="w-4 h-4 mr-2" />,
        text: "Find us on",
        link: {
          text: "GitHub",
          href: "https://github.com",
        },
      },
    ],
  },
};
