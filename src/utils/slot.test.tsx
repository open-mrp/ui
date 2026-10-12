import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Slot } from './slot';

describe('Slot', () => {
    it('merges props onto its child and runs the child handler first', () => {
        const calls: string[] = [];
        const ref = createRef<HTMLElement>();
        render(
            <Slot
                ref={ref}
                className="slot-class"
                data-state="open"
                onClick={() => calls.push('slot')}
            >
                <button type="button" className="child-class" onClick={() => calls.push('child')}>
                    Go
                </button>
            </Slot>,
        );
        const button = screen.getByRole('button', { name: 'Go' });

        fireEvent.click(button);

        expect(calls).toEqual(['child', 'slot']);
        expect(button).toHaveClass('slot-class', 'child-class');
        expect(button).toHaveAttribute('data-state', 'open');
        expect(ref.current).toBe(button);
    });
});
