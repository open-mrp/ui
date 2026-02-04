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

    if (renderLink) {
        return renderLink({ href, children, className, style });
    }

    return (
        <a href={href} className={className} style={style} onClick={onClick}>
            {children}
        </a>
    );
}
