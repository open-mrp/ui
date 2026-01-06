import React from 'react';

export interface SequenceActorLabelProps {
    label: React.ReactNode;
    color: string;
    highlightWidth?: number;
}

export default function SequenceActorLabel({
    label,
    color,
    highlightWidth = 6,
}: SequenceActorLabelProps) {
    return (
        <div className="flex items-center relative hover:cursor-auto">
            <div
                className="rounded-sm"
                style={{
                    position: 'absolute',
                    width: `${highlightWidth}px`,
                    background: color,
                    left: '-2px',
                    top: '-1px',
                    bottom: '-1px',
                }}
            />
            <p
                style={{
                    color: 'var(--foreground)',
                    marginLeft: '12px',
                    paddingTop: 0,
                    fontWeight: 500,
                    width: 'fit-content',
                    whiteSpace: 'nowrap',
                }}
            >
                {label}
            </p>
        </div>
    );
}
