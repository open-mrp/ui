'use client';

import { useEffect, useRef } from 'react';

export interface NavItemProps {
    href: string;
    children: string;
    active: boolean;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    renderLink?: (props: {
        href: string;
        children: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
    }) => React.ReactNode;
}

export default function NavItem({ href, children, active, onClick, renderLink }: NavItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const hasMountedRef = useRef(false);

    useEffect(() => {
        if (active && ref.current) {
            ref.current.scrollIntoView({
                block: 'nearest',
                behavior: hasMountedRef.current ? 'smooth' : 'instant',
            });
        }
        hasMountedRef.current = true;
    }, [active]);

    const className = `py-1 text-sm px-2 rounded-md block !no-underline pr-3 ${
        active
            ? 'font-medium'
            : 'hover:!text-[var(--sidenav-item-hover-color)] hover:!bg-[var(--sidenav-item-hover-bg)]'
    }`;

    const style: React.CSSProperties = {
        cursor: active ? 'default' : 'pointer',
        color: active ? 'var(--sidenav-item-active-color)' : 'var(--sidenav-item-color)',
        backgroundColor: active ? 'var(--sidenav-item-active-bg)' : undefined,
    };

    return (
        <div ref={ref}>
            {renderLink ? (
                renderLink({ href, children, className, style })
            ) : (
                <a href={href} className={className} style={style} onClick={onClick}>
                    {children}
                </a>
            )}
        </div>
    );
}
