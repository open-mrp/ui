import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../buttons/ShadButton";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Popover Title</h4>
          <p className="text-sm text-muted-foreground">
            This is a popover with some content inside.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => {
    const [theme, setTheme] = React.useState("");
    const [language, setLanguage] = React.useState("");

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Settings</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Settings</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};

export const WithList: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Actions</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            Edit
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Duplicate
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Share
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600">
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
