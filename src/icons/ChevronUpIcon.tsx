export default function ChevronUpIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className || 'h-4 w-4'}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 15l-6-6-6 6" />
        </svg>
    );
}
