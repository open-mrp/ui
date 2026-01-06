import EventIcon from '@/icons/EventIcon';
import { cn } from '@/utils/cn';

export interface EventBadgeProps {
    event: string;
    className?: string;
}

export default function EventBadge({ event, className }: EventBadgeProps) {
    return (
        <div className={cn('flex cursor-pointer relative group', className)} title={event}>
            <EventIcon size="h-3 w-3" color="white" />
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {event}
            </div>
        </div>
    );
}
