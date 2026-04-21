import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './Accordion';

const meta = {
    title: 'Overlays/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[520px] rounded-lg border border-gray-200 dark:border-gray-700">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
    render: () => (
        <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
                <AccordionTrigger>What is Augno?</AccordionTrigger>
                <AccordionContent>
                    Augno is a SaaS platform for inventory management and order fulfillment.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>How does billing work?</AccordionTrigger>
                <AccordionContent>
                    Usage is metered monthly based on active SKUs and order volume.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Can I export my data?</AccordionTrigger>
                <AccordionContent>
                    Yes — every table supports CSV export from the dashboard.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const Multiple: Story = {
    render: () => (
        <Accordion type="multiple" defaultValue={['a', 'b']}>
            <AccordionItem value="a">
                <AccordionTrigger>Shipping</AccordionTrigger>
                <AccordionContent>
                    We ship from 3 warehouses and support overnight delivery in the US.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
                <AccordionTrigger>Returns</AccordionTrigger>
                <AccordionContent>
                    Returns are accepted within 30 days for a full refund.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
                <AccordionTrigger>Warranty</AccordionTrigger>
                <AccordionContent>
                    Electronics carry a 1-year limited warranty. Other items are final-sale.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const RichContent: Story = {
    render: () => (
        <Accordion type="single" collapsible defaultValue="details">
            <AccordionItem value="details">
                <AccordionTrigger>Order details</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span>$142.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Shipping</span>
                            <span>$9.99</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>$151.99</span>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="history">
                <AccordionTrigger>Status history</AccordionTrigger>
                <AccordionContent>
                    <ul className="list-disc pl-5 text-sm">
                        <li>Placed · Apr 12, 9:02 AM</li>
                        <li>Paid · Apr 12, 9:03 AM</li>
                        <li>Shipped · Apr 13, 11:48 AM</li>
                        <li>Delivered · Apr 15, 2:20 PM</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};
