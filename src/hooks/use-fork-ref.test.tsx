import { render } from '@testing-library/react';
import { createRef, type Ref } from 'react';
import { useForkRef } from './use-fork-ref';

function Target({ refs }: { refs: Array<Ref<HTMLDivElement> | undefined> }) {
    const handleRef = useForkRef(...refs);
    return <div ref={handleRef} data-testid="target" />;
}

describe('useForkRef', () => {
    it('attaches the node to every ref', () => {
        const a = createRef<HTMLDivElement>();
        const calls: Array<HTMLDivElement | null> = [];
        const b = (node: HTMLDivElement | null) => {
            calls.push(node);
        };
        const { getByTestId } = render(<Target refs={[a, b]} />);
        expect(a.current).toBe(getByTestId('target'));
        expect(calls).toEqual([getByTestId('target')]);
    });

    it('moves the node to a ref passed on a later render', () => {
        const a = createRef<HTMLDivElement>();
        const b = createRef<HTMLDivElement>();
        const { getByTestId, rerender } = render(<Target refs={[a]} />);
        expect(a.current).toBe(getByTestId('target'));
        rerender(<Target refs={[b]} />);
        expect(a.current).toBeNull();
        expect(b.current).toBe(getByTestId('target'));
    });

    it('keeps the same callback while the refs are unchanged', () => {
        const a = createRef<HTMLDivElement>();
        let calls = 0;
        const b = () => {
            calls += 1;
        };
        const { rerender } = render(<Target refs={[a, b]} />);
        rerender(<Target refs={[a, b]} />);
        rerender(<Target refs={[a, b]} />);
        expect(calls).toBe(1);
    });

    it('clears every ref on unmount', () => {
        const a = createRef<HTMLDivElement>();
        const { unmount } = render(<Target refs={[a]} />);
        unmount();
        expect(a.current).toBeNull();
    });
});
