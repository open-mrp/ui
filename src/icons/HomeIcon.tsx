import { cn } from '@/utils/cn';

interface HomeIconProps {
    className?: string;
}

export default function HomeIcon({ className }: HomeIconProps) {
    return (
        <svg
            className={cn('', className)}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2zm0 2.83L19.17 12H4.83L12 4.83z" />
        </svg>
    );
}
