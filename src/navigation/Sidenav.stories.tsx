import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import NavItem from "./NavItem";
import NavSubSection from "./NavSubSection";
import Sidenav from "./Sidenav";
import { NavLink, NavSubSectionData } from "./types";

const meta: Meta<typeof Sidenav> = {
  title: "Navigation/Sidenav",
  component: Sidenav,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Sidenav>;

// Helper function to check if an item is a NavLink
const isNavLink = (item: NavLink | NavSubSectionData): item is NavLink => {
  return "href" in item;
};

// Create a wrapper component to manage state
const SidenavWithState = (props: React.ComponentProps<typeof Sidenav>) => {
  const [activeLink, setActiveLink] = useState<string>("/active");

  // Basic render function for nav items
  const renderNavItem = (item: NavLink | NavSubSectionData) => {
    if (isNavLink(item)) {
      return (
        <NavItem
          key={item.href}
          href={item.href}
          active={item.href === activeLink}
          onClick={(e) => {
            e.preventDefault();
            setActiveLink(item.href);
          }}
        >
          {item.children}
        </NavItem>
      );
    }
    return (
      <NavSubSection
        key={item.title}
        subSection={item}
        isPathActive={(path) => path === activeLink}
        renderNavItem={renderNavItem}
      />
    );
  };

  return <Sidenav {...props} renderNavItem={renderNavItem} />;
};

// Basic navigation with simple links
export const Basic: Story = {
  render: (args) => <SidenavWithState {...args} />,
  args: {
    sections: [
      {
        title: "Getting Started",
        links: [
          { href: "/docs", children: "Documentation" },
          { href: "/tutorials", children: "Tutorials" },
          { href: "/active", children: "Active Link" },
        ],
      },
      {
        title: "Components",
        links: [
          { href: "/buttons", children: "Buttons" },
          { href: "/forms", children: "Forms" },
          { href: "/cards", children: "Cards" },
        ],
      },
    ],
  },
};

// Navigation with subsections
export const WithSubsections: Story = {
  render: (args) => <SidenavWithState {...args} />,
  args: {
    sections: [
      {
        title: "Getting Started",
        links: [
          { href: "/docs", children: "Documentation" },
          { href: "/tutorials", children: "Tutorials" },
          {
            title: "Advanced Topics",
            items: [
              { href: "/advanced/performance", children: "Performance" },
              { href: "/advanced/security", children: "Security" },
              { href: "/active", children: "Active Link" },
            ],
          },
        ],
      },
      {
        title: "Components",
        links: [
          { href: "/buttons", children: "Buttons" },
          {
            title: "Form Elements",
            items: [
              { href: "/forms/inputs", children: "Inputs" },
              { href: "/forms/selects", children: "Selects" },
            ],
          },
        ],
      },
    ],
  },
};

// Navigation with custom styling
export const CustomStyling: Story = {
  render: (args) => <SidenavWithState {...args} />,
  args: {
    sections: [
      {
        title: "Getting Started",
        links: [
          { href: "/docs", children: "Documentation" },
          { href: "/tutorials", children: "Tutorials" },
          { href: "/active", children: "Active Link" },
        ],
      },
    ],
    className: "bg-gray-800",
  },
};
