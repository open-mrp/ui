import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cn } from '@/utils/cn';

export interface DividerProps extends ComponentPropsWithoutRef<'hr'> {
    orientation?: 'horizontal' | 'vertical';
    flexItem?: boolean;
    variant?: 'fullWidth' | 'inset' | 'middle';
    textAlign?: 'center' | 'left' | 'right';
    light?: boolean;
    absolute?: boolean;
    component?: ElementType;
}

export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(
    {
        orientation = 'horizontal',
        flexItem = false,
        variant = 'fullWidth',
        textAlign = 'center',
        absolute = false,
        light: _light,
        component,
        className,
        children,
        ...other
    },
    ref
) {
    const vertical = orientation === 'vertical';
    const Component = component ?? (children || vertical ? 'div' : 'hr');
    const withChildren = Boolean(children);
    const role = Component !== 'hr' ? 'separator' : undefined;
    return (
        <Component
            ref={ref}
            role={role}
            aria-orientation={
                role === 'separator' && (Component !== 'hr' || vertical) ? orientation : undefined
            }
            className={cn(
                'm-0 shrink-0 border-0 border-solid border-divider',
                !withChildren &&
                    (vertical ? 'h-full border-r-[length:thin]' : 'border-b-[length:thin]'),
                absolute && 'absolute bottom-0 left-0 w-full',
                variant === 'inset' && 'ml-[72px]',
                variant === 'middle' && (vertical ? 'my-2' : 'mx-4'),
                flexItem && 'self-stretch h-auto',
                withChildren &&
                    'flex text-center before:self-center before:content-[""] after:self-center after:content-[""]',
                withChildren &&
                    !vertical &&
                    'before:w-full before:border-t-[length:thin] before:border-solid before:border-divider after:w-full after:border-t-[length:thin] after:border-solid after:border-divider',
                withChildren &&
                    vertical &&
                    'flex-col before:h-full before:border-l-[length:thin] before:border-solid before:border-divider after:h-full after:border-l-[length:thin] after:border-solid after:border-divider',
                withChildren && textAlign === 'left' && !vertical && 'before:w-[10%] after:w-[90%]',
                withChildren &&
                    textAlign === 'right' &&
                    !vertical &&
                    'before:w-[90%] after:w-[10%]',
                className
            )}
            {...other}
        >
            {withChildren ? (
                <span
                    className={cn(
                        'inline-block whitespace-nowrap',
                        vertical ? 'py-[9.6px]' : 'px-[9.6px]'
                    )}
                >
                    {children}
                </span>
            ) : null}
        </Component>
    );
});
