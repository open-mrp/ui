import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const shadowScale = Array.from({ length: 25 }, (_, index) => `elevation-${index}`);

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            shadow: shadowScale,
        },
    },
    override: {
        conflictingClassGroups: {
            'font-size': [],
        },
        conflictingClassGroupModifiers: {
            'font-size': [],
        },
    },
});

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
