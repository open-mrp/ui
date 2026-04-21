import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from './Select';

const meta = {
    component: Select,
    title: 'Overlays/Select',
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="p-4 dark:bg-background">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Select Story
export const Basic: Story = {
    render: () => {
        const [value, setValue] = useState('');

        return (
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="grape">Grape</SelectItem>
                </SelectContent>
            </Select>
        );
    },
};

// Select with Groups
export const WithGroups: Story = {
    render: () => {
        const [value, setValue] = useState('');

        return (
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Frontend</SelectLabel>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="vue">Vue</SelectItem>
                        <SelectItem value="angular">Angular</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                        <SelectLabel>Backend</SelectLabel>
                        <SelectItem value="node">Node.js</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    },
};

// Select with Icons
export const WithIcons: Story = {
    render: () => {
        const [value, setValue] = useState('');

        return (
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="javascript">
                        <span className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                            JavaScript
                        </span>
                    </SelectItem>
                    <SelectItem value="typescript">
                        <span className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                            TypeScript
                        </span>
                    </SelectItem>
                    <SelectItem value="python">
                        <span className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                            Python
                        </span>
                    </SelectItem>
                    <SelectItem value="rust">
                        <span className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
                            Rust
                        </span>
                    </SelectItem>
                </SelectContent>
            </Select>
        );
    },
};

// Small Size Select
export const SmallSize: Story = {
    render: () => {
        const [value, setValue] = useState('');

        return (
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger size="sm" className="w-[150px]">
                    <SelectValue placeholder="Small select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
            </Select>
        );
    },
};

// Disabled Select
export const Disabled: Story = {
    render: () => {
        return (
            <Select disabled>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Disabled select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );
    },
};

// Long List with Scroll
export const LongList: Story = {
    render: () => {
        const [value, setValue] = useState('');

        const countries = [
            'Afghanistan',
            'Albania',
            'Algeria',
            'Argentina',
            'Australia',
            'Austria',
            'Bangladesh',
            'Belgium',
            'Brazil',
            'Canada',
            'Chile',
            'China',
            'Colombia',
            'Denmark',
            'Egypt',
            'Finland',
            'France',
            'Germany',
            'Ghana',
            'Greece',
            'India',
            'Indonesia',
            'Ireland',
            'Italy',
            'Japan',
            'Kenya',
            'Mexico',
            'Netherlands',
            'New Zealand',
            'Nigeria',
            'Norway',
            'Pakistan',
            'Peru',
            'Philippines',
            'Poland',
            'Portugal',
            'Russia',
            'South Africa',
            'South Korea',
            'Spain',
            'Sweden',
            'Switzerland',
            'Thailand',
            'Turkey',
            'Ukraine',
            'United Kingdom',
            'United States',
            'Vietnam',
        ];

        return (
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                    <SelectScrollUpButton />
                    {countries.map((country) => (
                        <SelectItem key={country} value={country.toLowerCase()}>
                            {country}
                        </SelectItem>
                    ))}
                    <SelectScrollDownButton />
                </SelectContent>
            </Select>
        );
    },
};

// Multiple Selects
export const MultipleSelects: Story = {
    render: () => {
        const [framework, setFramework] = useState('');
        const [language, setLanguage] = useState('');
        const [database, setDatabase] = useState('');

        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Framework</label>
                    <Select value={framework} onValueChange={setFramework}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="vue">Vue</SelectItem>
                            <SelectItem value="angular">Angular</SelectItem>
                            <SelectItem value="svelte">Svelte</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="typescript">TypeScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Database</label>
                    <Select value={database} onValueChange={setDatabase}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select database" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="postgresql">PostgreSQL</SelectItem>
                            <SelectItem value="mysql">MySQL</SelectItem>
                            <SelectItem value="mongodb">MongoDB</SelectItem>
                            <SelectItem value="redis">Redis</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        );
    },
};

// Form Integration
export const FormIntegration: Story = {
    render: () => {
        const [formData, setFormData] = useState({
            role: '',
            department: '',
            experience: '',
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            console.log('Form submitted:', formData);
        };

        return (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="qa">QA Engineer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select
                        value={formData.department}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, department: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Engineering</SelectLabel>
                                <SelectItem value="frontend">Frontend</SelectItem>
                                <SelectItem value="backend">Backend</SelectItem>
                                <SelectItem value="devops">DevOps</SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectLabel>Other</SelectLabel>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Experience Level</label>
                    <Select
                        value={formData.experience}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, experience: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                            <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                            <SelectItem value="senior">Senior (5+ years)</SelectItem>
                            <SelectItem value="lead">Lead (8+ years)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    Submit
                </button>

                <div className="text-xs text-muted-foreground">
                    <p>Selected values:</p>
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                </div>
            </form>
        );
    },
};
