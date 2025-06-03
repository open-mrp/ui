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
        title: "Getting Started with Our Comprehensive Documentation Suite",
        links: [
          { href: "/docs", children: "Documentation & Getting Started Guide" },
          {
            href: "/tutorials",
            children: "Step-by-Step Interactive Tutorials",
          },
          { href: "/active", children: "Currently Active Link Example" },
          { href: "/quickstart", children: "5-Minute Quickstart Guide" },
        ],
      },
      {
        title: "Components Library",
        links: [
          { href: "/buttons", children: "Buttons & Interactive Elements" },
          { href: "/forms", children: "Forms & Input Components" },
          { href: "/cards", children: "Cards & Container Components" },
          { href: "/layout", children: "Layout & Grid Systems" },
        ],
      },
      {
        title: "Design System Guidelines & Best Practices for Implementation",
        links: [
          { href: "/typography", children: "Typography & Font Guidelines" },
          { href: "/colors", children: "Color Palette & Usage" },
          { href: "/spacing", children: "Spacing & Layout Rules" },
        ],
      },
      {
        title: "Advanced Topics",
        links: [
          {
            href: "/performance",
            children: "Performance Optimization Techniques & Best Practices",
          },
          {
            href: "/accessibility",
            children: "Accessibility Guidelines & WCAG 2.1 Compliance",
          },
          {
            href: "/internationalization",
            children: "Internationalization & Localization Support",
          },
        ],
      },
      {
        title: "Empty Section Test",
        links: [],
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
        title: "Getting Started with Development",
        links: [
          { href: "/docs", children: "Comprehensive Documentation" },
          { href: "/tutorials", children: "Interactive Learning Path" },
          {
            title: "Advanced Implementation Topics & Best Practices",
            items: [
              {
                href: "/advanced/performance",
                children: "Performance Optimization Strategies & Techniques",
              },
              {
                href: "/advanced/security",
                children: "Security Best Practices & Implementation Guidelines",
              },
              { href: "/active", children: "Active Link Example" },
              {
                title: "Deep Dive Topics",
                items: [
                  {
                    href: "/advanced/architecture",
                    children: "Architecture Patterns & Anti-patterns",
                  },
                  {
                    href: "/advanced/state-management",
                    children: "Complex State Management Solutions",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Component Library & Usage Guidelines",
        links: [
          { href: "/buttons", children: "Button Components & Variants" },
          {
            title: "Form Elements & Input Components",
            items: [
              { href: "/forms/inputs", children: "Input Fields & Text Areas" },
              {
                href: "/forms/selects",
                children: "Select Components & Dropdowns",
              },
              {
                href: "/forms/validation",
                children: "Form Validation & Error Handling",
              },
              {
                title: "Advanced Form Patterns",
                items: [
                  {
                    href: "/forms/advanced/multi-step",
                    children: "Multi-step Form Implementation",
                  },
                  {
                    href: "/forms/advanced/dynamic",
                    children: "Dynamic Form Generation & Handling",
                  },
                ],
              },
            ],
          },
          {
            title: "Layout Components & Systems",
            items: [
              {
                href: "/layout/grid",
                children: "Grid System & Responsive Layouts",
              },
              {
                href: "/layout/containers",
                children: "Container Components & Usage",
              },
            ],
          },
        ],
      },
      {
        title: "Testing Edge Cases",
        links: [
          { href: "/empty-subsection", children: "Empty Subsection Below" },
          {
            title: "Empty Subsection",
            items: [],
          },
          {
            title:
              "Very Long Title That Might Need Special Handling in the Navigation Component Structure",
            items: [
              { href: "/edge/case1", children: "Edge Case Test 1" },
              {
                href: "/edge/case2",
                children:
                  "Edge Case with a Very Long Title That Might Need Truncation or Special Styling in the Navigation",
              },
            ],
          },
          {
            title: "Large Item Collection",
            items: [
              { href: "/items/1", children: "Navigation Item 1" },
              { href: "/items/2", children: "Navigation Item 2" },
              { href: "/items/3", children: "Navigation Item 3" },
              { href: "/items/4", children: "Navigation Item 4" },
              { href: "/items/5", children: "Navigation Item 5" },
              { href: "/items/6", children: "Navigation Item 6" },
              { href: "/items/7", children: "Navigation Item 7" },
              { href: "/items/8", children: "Navigation Item 8" },
              { href: "/items/9", children: "Navigation Item 9" },
              { href: "/items/10", children: "Navigation Item 10" },
              { href: "/items/11", children: "Navigation Item 11" },
              { href: "/items/12", children: "Navigation Item 12" },
              { href: "/items/13", children: "Navigation Item 13" },
              { href: "/items/14", children: "Navigation Item 14" },
              { href: "/items/15", children: "Navigation Item 15" },
              { href: "/items/16", children: "Navigation Item 16" },
              { href: "/items/17", children: "Navigation Item 17" },
              { href: "/items/18", children: "Navigation Item 18" },
              { href: "/items/19", children: "Navigation Item 19" },
              { href: "/items/20", children: "Navigation Item 20" },
              { href: "/items/21", children: "Navigation Item 21" },
              { href: "/items/22", children: "Navigation Item 22" },
              { href: "/items/23", children: "Navigation Item 23" },
              { href: "/items/24", children: "Navigation Item 24" },
              { href: "/items/25", children: "Navigation Item 25" },
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
