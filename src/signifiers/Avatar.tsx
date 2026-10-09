import {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useState,
    type ComponentPropsWithoutRef,
    type ElementType,
    type ReactElement,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { InternalPersonIcon } from '@/icons/internal-icons';

export interface AvatarProps extends ComponentPropsWithoutRef<'div'> {
    src?: string;
    srcSet?: string;
    sizes?: string;
    alt?: string;
    variant?: 'circular' | 'rounded' | 'square';
    component?: ElementType;
    imgProps?: ComponentPropsWithoutRef<'img'>;
}

const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
};

export const avatarBaseClasses =
    'relative flex shrink-0 items-center justify-center w-10 h-10 font-plex-sans text-[14px] font-semibold tracking-normal leading-none overflow-hidden select-none bg-avatar text-white';

function SourcedImage({
    src,
    srcSet,
    sizes,
    alt,
    imgProps,
    fallback,
}: {
    src?: string;
    srcSet?: string;
    sizes?: string;
    alt?: string;
    imgProps?: ComponentPropsWithoutRef<'img'>;
    fallback: ReactNode;
}) {
    const [failedSource, setFailedSource] = useState<string | null>(null);
    const key = `${src ?? ''}|${srcSet ?? ''}`;
    if (failedSource === key) return <>{fallback}</>;
    return (
        <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            {...imgProps}
            onError={event => {
                setFailedSource(key);
                imgProps?.onError?.(event);
            }}
            className={cn(
                'w-full h-full text-center object-cover text-transparent indent-[10000px]',
                imgProps?.className
            )}
        />
    );
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
    {
        src,
        srcSet,
        sizes,
        alt,
        variant = 'circular',
        component,
        imgProps,
        className,
        children,
        ...other
    },
    ref
) {
    const Component = component ?? 'div';
    const fallback =
        children != null ? children : alt ? alt[0] : <InternalPersonIcon className="h-3/4 w-3/4" />;
    const hasImage = Boolean(src || srcSet);
    return (
        <Component
            ref={ref}
            data-slot="avatar"
            className={cn(avatarBaseClasses, variantClasses[variant], className)}
            {...other}
        >
            {hasImage ? (
                <SourcedImage
                    src={src}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    imgProps={imgProps}
                    fallback={fallback}
                />
            ) : (
                fallback
            )}
        </Component>
    );
});

export interface AvatarGroupProps extends ComponentPropsWithoutRef<'div'> {
    max?: number;
    total?: number;
    spacing?: 'medium' | 'small' | number;
    variant?: AvatarProps['variant'];
    surplusClassName?: string;
    renderSurplus?: (surplus: number) => ReactNode;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
    {
        max = 5,
        total,
        spacing = 'medium',
        variant = 'circular',
        surplusClassName,
        renderSurplus,
        className,
        children,
        ...other
    },
    ref
) {
    const clampedMax = max < 2 ? 2 : max;
    const items = Children.toArray(children).filter(
        (child): child is ReactElement<{ className?: string }> => isValidElement(child)
    );
    const totalAvatars = total ?? items.length;
    const maxAvatars = totalAvatars === clampedMax ? clampedMax : clampedMax - 1;
    const shown = Math.min(items.length, maxAvatars);
    const extra = Math.max(totalAvatars - clampedMax, totalAvatars - shown, 0);
    const marginValue = spacing === 'small' ? 16 : spacing === 'medium' ? 8 : spacing;
    const avatarClasses = 'border-2 border-solid border-surface box-content!';
    return (
        <div
            ref={ref}
            className={cn('flex flex-row-reverse', className)}
            style={{ ['--avatar-group-gap' as string]: `-${marginValue}px` }}
            {...other}
        >
            {extra ? (
                <Avatar
                    variant={variant}
                    className={cn(
                        avatarClasses,
                        'ml-(--avatar-group-gap) last:ml-0',
                        surplusClassName
                    )}
                >
                    {renderSurplus ? renderSurplus(extra) : `+${extra}`}
                </Avatar>
            ) : null}
            {items
                .slice(0, shown)
                .reverse()
                .map((child, index) =>
                    cloneElement(child, {
                        key: child.key ?? index,
                        className: cn(
                            avatarClasses,
                            'ml-(--avatar-group-gap) last:ml-0',
                            child.props.className
                        ),
                    })
                )}
        </div>
    );
});
