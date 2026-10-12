import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

function Items() {
    return (
        <>
            <AccordionItem value="one">
                <AccordionTrigger>One</AccordionTrigger>
                <AccordionContent>First panel</AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
                <AccordionTrigger>Two</AccordionTrigger>
                <AccordionContent>Second panel</AccordionContent>
            </AccordionItem>
        </>
    );
}

describe('Accordion', () => {
    it('opens one item at a time in single mode and collapses when collapsible', async () => {
        render(
            <Accordion type="single" collapsible>
                <Items />
            </Accordion>,
        );
        const one = screen.getByRole('button', { name: 'One' });
        const two = screen.getByRole('button', { name: 'Two' });

        await userEvent.click(one);
        expect(one).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('region', { name: 'One' })).toHaveTextContent('First panel');

        await userEvent.click(two);
        expect(one).toHaveAttribute('aria-expanded', 'false');
        expect(two).toHaveAttribute('data-state', 'open');
        expect(screen.queryByText('First panel')).not.toBeInTheDocument();

        await userEvent.click(two);
        expect(two).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps the open item open when not collapsible', async () => {
        render(
            <Accordion type="single" defaultValue="one">
                <Items />
            </Accordion>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'One' }));
        expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute(
            'aria-expanded',
            'true',
        );
    });

    it('allows several open items in multiple mode and reports changes', async () => {
        const onValueChange = jest.fn();
        render(
            <Accordion type="multiple" defaultValue={['one']} onValueChange={onValueChange}>
                <Items />
            </Accordion>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'Two' }));
        expect(onValueChange).toHaveBeenLastCalledWith(['one', 'two']);
        expect(screen.getByText('First panel')).toBeInTheDocument();
        expect(screen.getByText('Second panel')).toBeInTheDocument();
    });

    it('moves focus between triggers with the arrow keys', async () => {
        render(
            <Accordion type="single" collapsible>
                <Items />
            </Accordion>,
        );
        screen.getByRole('button', { name: 'One' }).focus();
        await userEvent.keyboard('{ArrowDown}');
        expect(screen.getByRole('button', { name: 'Two' })).toHaveFocus();
        await userEvent.keyboard('{ArrowDown}');
        expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
        await userEvent.keyboard('{End}');
        expect(screen.getByRole('button', { name: 'Two' })).toHaveFocus();
    });
});
