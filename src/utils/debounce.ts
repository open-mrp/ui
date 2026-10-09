export interface Debounced<T extends (...args: never[]) => void> {
    (...args: Parameters<T>): void;
    clear: () => void;
}

export function debounce<T extends (...args: never[]) => void>(func: T, wait = 166): Debounced<T> {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    function debounced(this: unknown, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    }
    debounced.clear = () => {
        clearTimeout(timeout);
    };
    return debounced;
}
