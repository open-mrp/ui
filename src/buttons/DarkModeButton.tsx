'use client';

import { useDarkMode } from '@/hooks/useDarkMode';
import MoonIcon from '@/icons/MoonIcon';
import SunIcon from '@/icons/SunIcon';
import { GlassButton, type GlassButtonProps } from './GlassButton';

export interface DarkModeButtonProps extends GlassButtonProps {
    variant?: 'icon' | 'outlined';
    className?: string;
}

export default function DarkModeButton({
    variant = 'icon',
    className,
    ...props
}: DarkModeButtonProps) {
    const { isDark, toggleDarkMode } = useDarkMode();

    if (variant === 'icon') {
        return (
            <GlassButton
                className={className}
                variant="icon"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                {...props}
            >
                {isDark ? <SunIcon /> : <MoonIcon />}
            </GlassButton>
        );
    }

    return (
        <GlassButton className={className} variant="outlined" onClick={toggleDarkMode} {...props}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
        </GlassButton>
    );
}
