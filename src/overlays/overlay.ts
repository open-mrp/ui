export const OVERLAY_ATTRIBUTE = 'data-overlay';

export const overlayProps = { [OVERLAY_ATTRIBUTE]: '' } as const;

const OVERLAY_SELECTOR = `[${OVERLAY_ATTRIBUTE}], [data-radix-popper-content-wrapper]`;

export function isInsideOverlay(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest(OVERLAY_SELECTOR) !== null;
}
