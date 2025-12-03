import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta = {
  component: Tabs,
  title: "Navigation/Tabs",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Tabs Story
export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
          <p className="text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Password Settings</h3>
          <p className="text-muted-foreground">
            Update your password and security settings.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">General Settings</h3>
          <p className="text-muted-foreground">
            Configure your application preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Tabs with Icons
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="dashboard" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="dashboard">
          <span className="flex items-center gap-2">
            <span>📊</span>
            Dashboard
          </span>
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <span className="flex items-center gap-2">
            <span>📈</span>
            Analytics
          </span>
        </TabsTrigger>
        <TabsTrigger value="reports">
          <span className="flex items-center gap-2">
            <span>📋</span>
            Reports
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
          <p className="text-muted-foreground">
            View your key metrics and performance indicators.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-muted-foreground">
            Deep dive into your data and trends.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Reports</h3>
          <p className="text-muted-foreground">
            Generate and download detailed reports.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Vertical Tabs
export const Vertical: Story = {
  render: () => (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="flex gap-4 w-[500px]"
    >
      <TabsList className="flex-col h-fit w-[200px]">
        <TabsTrigger value="profile" className="w-full justify-start">
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start">
          Notifications
        </TabsTrigger>
        <TabsTrigger value="billing" className="w-full justify-start">
          Billing
        </TabsTrigger>
        <TabsTrigger value="security" className="w-full justify-start">
          Security
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="profile" className="mt-0">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
            <p className="text-muted-foreground">
              Update your personal information and profile picture.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="mt-0">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">
              Notification Settings
            </h3>
            <p className="text-muted-foreground">
              Configure how and when you receive notifications.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="billing" className="mt-0">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">
              Billing & Subscription
            </h3>
            <p className="text-muted-foreground">
              Manage your subscription and payment methods.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="security" className="mt-0">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">Security Settings</h3>
            <p className="text-muted-foreground">
              Manage your security preferences and two-factor authentication.
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

// Many Tabs with Scroll
export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        <TabsTrigger value="tab4">Tab 4</TabsTrigger>
        <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        <TabsTrigger value="tab6">Tab 6</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Tab 1 Content</h3>
          <p className="text-muted-foreground">
            This is the content for tab 1.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab2" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Tab 2 Content</h3>
          <p className="text-muted-foreground">
            This is the content for tab 2.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab3" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Tab 3 Content</h3>
          <p className="text-muted-foreground">
            This is the content for tab 3.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab4" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Tab 4 Content</h3>
          <p className="text-muted-foreground">
            This is the content for tab 4.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab5" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Tab 5 Content</h3>
          <p className="text-muted-foreground">
            This is the content for tab 5.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab6" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Tab 6 Content</h3>
          <p className="text-muted-foreground">
            This is the content for tab 6.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Disabled Tabs
export const WithDisabledTabs: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Active Tab</h3>
          <p className="text-muted-foreground">
            This tab is active and functional.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="disabled" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Disabled Tab</h3>
          <p className="text-muted-foreground">
            This tab is disabled and cannot be accessed.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="another" className="mt-4">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Another Tab</h3>
          <p className="text-muted-foreground">This is another active tab.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Code Editor Tabs
export const CodeEditor: Story = {
  render: () => (
    <Tabs defaultValue="index" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="index">
          <span className="flex items-center gap-2">
            <span className="text-blue-500">📄</span>
            index.tsx
          </span>
        </TabsTrigger>
        <TabsTrigger value="components">
          <span className="flex items-center gap-2">
            <span className="text-green-500">🧩</span>
            components.tsx
          </span>
        </TabsTrigger>
        <TabsTrigger value="styles">
          <span className="flex items-center gap-2">
            <span className="text-purple-500">🎨</span>
            styles.css
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="index" className="mt-4">
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
          <pre className="text-sm">
            {`import React from 'react';
import { Button } from './components';

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
    </div>
  );
}`}
          </pre>
        </div>
      </TabsContent>
      <TabsContent value="components" className="mt-4">
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
          <pre className="text-sm">
            {`import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {children}
    </button>
  );
}`}
          </pre>
        </div>
      </TabsContent>
      <TabsContent value="styles" className="mt-4">
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
          <pre className="text-sm">
            {`.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.button:hover {
  background-color: #2563eb;
}`}
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Settings Panel
export const SettingsPanel: Story = {
  render: () => (
    <Tabs defaultValue="general" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-4">
        <div className="p-4 border rounded-md space-y-4">
          <h3 className="text-lg font-semibold">General Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Enable notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Auto-save changes
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Show tooltips
            </label>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="appearance" className="mt-4">
        <div className="p-4 border rounded-md space-y-4">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <div className="space-y-2">
            <label className="block">
              Theme
              <select className="mt-1 block w-full p-2 border rounded">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </label>
            <label className="block">
              Font Size
              <select className="mt-1 block w-full p-2 border rounded">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </label>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="privacy" className="mt-4">
        <div className="p-4 border rounded-md space-y-4">
          <h3 className="text-lg font-semibold">Privacy Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Share usage analytics
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Allow data collection
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              Enable crash reporting
            </label>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="advanced" className="mt-4">
        <div className="p-4 border rounded-md space-y-4">
          <h3 className="text-lg font-semibold">Advanced Settings</h3>
          <div className="space-y-2">
            <label className="block">
              Debug Level
              <select className="mt-1 block w-full p-2 border rounded">
                <option>None</option>
                <option>Error</option>
                <option>Warning</option>
                <option>Info</option>
                <option>Debug</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Enable experimental features
            </label>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Dynamic Tabs
export const DynamicTabs: Story = {
  render: () => {
    const [tabs, setTabs] = React.useState([
      { id: "tab1", label: "Tab 1", content: "Content for tab 1" },
      { id: "tab2", label: "Tab 2", content: "Content for tab 2" },
    ]);
    const [activeTab, setActiveTab] = React.useState("tab1");
    const [newTabLabel, setNewTabLabel] = React.useState("");

    const addTab = () => {
      if (newTabLabel.trim()) {
        const newId = `tab${Date.now()}`;
        setTabs([
          ...tabs,
          {
            id: newId,
            label: newTabLabel,
            content: `Content for ${newTabLabel}`,
          },
        ]);
        setActiveTab(newId);
        setNewTabLabel("");
      }
    };

    const removeTab = (id: string) => {
      const newTabs = tabs.filter((tab) => tab.id !== id);
      setTabs(newTabs);
      if (activeTab === id && newTabs.length > 0) {
        setActiveTab(newTabs[0].id);
      }
    };

    return (
      <div className="w-[500px]">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTabLabel}
            onChange={(e) => setNewTabLabel(e.target.value)}
            placeholder="New tab label"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addTab}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Tab
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative group"
              >
                {tab.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="ml-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-semibold mb-2">{tab.label}</h3>
                <p className="text-muted-foreground">{tab.content}</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  },
};
