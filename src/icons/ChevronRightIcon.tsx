interface ChevronRightIconProps {
    className?: string;
}

export default function ChevronRightIcon({ className = 'h-4 w-4' }: ChevronRightIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 5l7 7-7 7" />
        </svg>
    );
}
