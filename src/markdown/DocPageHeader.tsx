import { cn } from '@/utils/cn';

export interface DocPageHeaderProps {
    title: string;
    subtitle: string;
    className?: string;
}
export default function DocPageHeader({ title, subtitle, className }: DocPageHeaderProps) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <h1 className="text-4xl font-bold">{title}</h1>
            <h2
                className="text-2xl font-light text-text-secondary"
                style={{
                    letterSpacing: '0.01em',
                    padding: '0px',
                }}
            >
                {subtitle}
            </h2>
        </div>
    );
}
