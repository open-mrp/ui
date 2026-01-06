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
    const className = `py-1 text-sm px-2 rounded-md block !no-underline ${
        active
            ? 'font-medium bg-gray-800'
            : '!text-gray-400 hover:!text-gray-300 hover:bg-gray-800 pr-3'
    }`;

    const style = {
        cursor: active ? 'default' : 'pointer',
        color: active ? 'var(--color-primary-500)' : 'var(--color-gray-400)',
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
