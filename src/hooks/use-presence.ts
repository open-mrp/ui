import { useEffect, useRef, useState } from 'react';

export type PresenceState = 'open' | 'closed';

export function usePresence(open: boolean, exitDuration: number) {
    const [mounted, setMounted] = useState(open);
    const [state, setState] = useState<PresenceState>(open ? 'open' : 'closed');
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [previousOpen, setPreviousOpen] = useState(open);
    if (previousOpen !== open) {
        setPreviousOpen(open);
        if (open) {
            setMounted(true);
            setState('open');
        } else {
            setState('closed');
        }
    }
    useEffect(() => {
        clearTimeout(timer.current);
        if (open) return;
        timer.current = setTimeout(() => {
            setMounted(false);
        }, exitDuration);
        return () => clearTimeout(timer.current);
    }, [open, exitDuration]);
    return { mounted: mounted || open, state };
}
