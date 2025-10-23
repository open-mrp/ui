import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import React from "react";
import { Button } from "./ShadButton";

const meta = {
  component: Button,
  title: "Buttons/ShadButton",
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Variant Stories
export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const DefaultWithIcon: Story = {
  args: {
    children: (
      <>
        <span>🔍</span>
        Search
      </>
    ),
  },
};

// Destructive Variant Stories
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <span>🗑️</span>
        Delete Item
      </>
    ),
  },
};

// Outline Variant Stories
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const OutlineWithIcon: Story = {
  args: {
    variant: "outline",
    children: (
      <>
        <span>📤</span>
        Export
      </>
    ),
  },
};

// Secondary Variant Stories
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const SecondaryWithIcon: Story = {
  args: {
    variant: "secondary",
    children: (
      <>
        <span>⚙️</span>
        Settings
      </>
    ),
  },
};

// Ghost Variant Stories
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const GhostWithIcon: Story = {
  args: {
    variant: "ghost",
    children: (
      <>
        <span>❤️</span>
        Like
      </>
    ),
  },
};

// Link Variant Stories
export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

export const LinkWithIcon: Story = {
  args: {
    variant: "link",
    children: (
      <>
        <span>🔗</span>
        Learn More
      </>
    ),
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const DefaultSize: Story = {
  args: {
    size: "default",
    children: "Default",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

// Icon Button Stories
export const IconButton: Story = {
  args: {
    size: "icon",
    children: "🔍",
  },
};

export const IconButtonSmall: Story = {
  args: {
    size: "icon-sm",
    children: "⚙️",
  },
};

export const IconButtonLarge: Story = {
  args: {
    size: "icon-lg",
    children: "📁",
  },
};

// Disabled States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const DisabledDestructive: Story = {
  args: {
    variant: "destructive",
    disabled: true,
    children: "Disabled Delete",
  },
};

export const DisabledOutline: Story = {
  args: {
    variant: "outline",
    disabled: true,
    children: "Disabled Outline",
  },
};

// As Child (Slot) Examples
export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#example">Link as Button</a>,
  },
};

export const AsChildWithVariant: Story = {
  args: {
    asChild: true,
    variant: "outline",
    children: <a href="#example">Styled Link</a>,
  },
};

// Loading State (Custom Implementation)
export const Loading: Story = {
  render: () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    return (
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            Loading...
          </>
        ) : (
          "Click to Load"
        )}
      </Button>
    );
  },
};

// Button Group Examples
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </div>
  ),
};

export const ButtonGroupWithIcons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">
        <span>←</span>
        Back
      </Button>
      <Button>
        Next
        <span>→</span>
      </Button>
    </div>
  ),
};

// Form Actions
export const FormActions: Story = {
  render: () => (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <Button type="submit">Submit</Button>
    </div>
  ),
};

// Toolbar Example
export const Toolbar: Story = {
  render: () => (
    <div className="flex gap-1 p-2 border rounded-md bg-muted/50">
      <Button size="icon-sm" variant="ghost">
        <span>📝</span>
      </Button>
      <Button size="icon-sm" variant="ghost">
        <span>🔍</span>
      </Button>
      <Button size="icon-sm" variant="ghost">
        <span>📋</span>
      </Button>
      <div className="w-px bg-border mx-1" />
      <Button size="icon-sm" variant="ghost">
        <span>🔗</span>
      </Button>
      <Button size="icon-sm" variant="ghost">
        <span>📎</span>
      </Button>
    </div>
  ),
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Default</h3>
        <Button>Default</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Destructive</h3>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Outline</h3>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Secondary</h3>
        <Button variant="secondary">Secondary</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Ghost</h3>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Link</h3>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon-sm">⚙️</Button>
      <Button size="icon">🔍</Button>
      <Button size="icon-lg">📁</Button>
    </div>
  ),
};

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    const [variant, setVariant] = React.useState<
      "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    >("default");

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
          <Button variant="outline" onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Variant:</label>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                "default",
                "destructive",
                "outline",
                "secondary",
                "ghost",
                "link",
              ] as const
            ).map((v) => (
              <Button
                key={v}
                size="sm"
                variant={variant === v ? "default" : "outline"}
                onClick={() => setVariant(v)}
              >
                {v}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-md">
          <p className="text-sm text-muted-foreground mb-2">
            Current variant: {variant}
          </p>
          <Button variant={variant}>{variant} Button</Button>
        </div>
      </div>
    );
  },
};

// Accessibility Example
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">ARIA Labels</h3>
        <Button aria-label="Close dialog">
          <span>✕</span>
        </Button>
        <Button aria-label="Save document">
          <span>💾</span>
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Keyboard Navigation</h3>
        <div className="flex gap-2">
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Focus States</h3>
        <Button>Focus me (Tab to focus)</Button>
      </div>
    </div>
  ),
};
