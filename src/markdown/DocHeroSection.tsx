import React from 'react';

export interface DocHeroSectionProps {
    children: React.ReactNode;
}

export default function DocHeroSection({ children }: DocHeroSectionProps) {
    return <div style={{ padding: '0 1rem 1rem 0' }}>{children}</div>;
}
